// frontend/src/lib/api.ts

const GRAPHQL_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/graphql`
  : 'http://localhost:8080/graphql';

const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : 'http://localhost:8080/api';

// Helper function to make GraphQL requests (Cookie-based)
async function graphqlRequest(query: string, variables?: any) {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important: includes cookies
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data;
}

// Helper function to make REST requests (Cookie-based)
async function restRequest(
  endpoint: string,
  method: string,
  body?: any,
  token?: string,
  isFormData: boolean = false,
  retries = 3
): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const headers: any = {};

      // Only add Content-Type if there's a body and it's not FormData
      if (body && !isFormData) {
        headers['Content-Type'] = 'application/json';
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const config: any = {
        method,
        headers,
        credentials: 'include', // Important for cookies
        signal: AbortSignal.timeout(30000), // 30 second timeout
      };

      // Only add body if it exists
      if (body) {
        config.body = isFormData ? body : JSON.stringify(body);
      }

      const response = await fetch(`${API_URL}/${endpoint}`, config);

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      let result;

      if (contentType?.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        result = { message: text, success: response.ok };
      }

      if (!response.ok) {
        throw new Error(result.message || `Request failed with status ${response.status}`);
      }

      return result;
    } catch (err: any) {
      console.error(`❌ REST request error (attempt ${attempt}/${retries}):`, err);

      // Retry if not the last attempt and error is network-related
      if (attempt < retries && (err.name === 'TypeError' || err.name === 'AbortError')) {
        console.log(`🔄 Retrying in ${attempt}s...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        continue;
      }

      // Last attempt failed or non-retryable error
      throw new Error(err.message || 'Failed to connect to server');
    }
  }

  throw new Error('Maximum retry attempts reached');
}

export const api = {
  auth: {
    register: async (formData: FormData) => {
      return restRequest('auth/register', 'POST', formData, undefined, true);
    },

    login: async (email: string, password: string) => {
      return restRequest('auth/login', 'POST', { email, password });
    },

    sendOTP: async (identifier: string) => {
      const isEmail = identifier.includes('@');
      const payload = isEmail ? { email: identifier } : { phone: identifier };
      return restRequest('auth/send-otp', 'POST', payload);
    },

    verifyOTP: async (identifier: string, code: string) => {
      const isEmail = identifier.includes('@');
      const payload = isEmail
        ? { email: identifier, emailOtp: code }
        : { phone: identifier, phoneOtp: code };
      return restRequest('auth/verify-otp', 'POST', payload);
    },

    logout: async () => {
      try {
        await restRequest('auth/logout', 'POST');
        console.log('✅ Logout successful');
      } catch (err) {
        console.warn('⚠️ Logout API failed:', err);
      }
    },

    getMe: async () => {
      const query = `
        query Me {
          me {
            id
            fullname
            email
            phone
            role
            accountStatus
            mobileNumber
            isVerified
            isKYCCompleted
            kycStatus
            avatar
          }
        }
      `;
      return graphqlRequest(query);
    },
  },

  dashboard: {
    getData: async () => {
      const query = `
        query Dashboard {
          dashboard {
            balance {
              total
              change
              recentDeposits
            }
            activities {
              id
              type
              amount
              currency
              status
              createdAt
            }
            notifications {
              id
              title
              message
              isRead
              isDone
              priority
              createdAt
            }
            watchlist {
              symbol
              assetType
              alertPrice
              notes
              addedAt
            }
            pendingActions
            charts {
              portfolioPerformance
              depositActivity
            }
          }
        }
      `;
      return graphqlRequest(query);
    },
  },

  user: {
    getProfile: async () => {
      const query = `
        query UserProfile {
          userProfile {
            id
            fullname
            email
            phone
            role
            accountStatus
            mobileNumber
            Address
            Address1
            city
            state
            country
            pincode
            dateOfBirth
            nationality
            avatar
            isVerified
            isKYCCompleted
            kycStatus
          }
        }
      `;
      return graphqlRequest(query);
    },

    updateProfile: async (input: any) => {
      const query = `
        mutation UpdateProfile($input: UpdateProfileInput!) {
          updateProfile(input: $input) {
            id
            fullname
            email
            phone
            Address
            city
            state
            country
            pincode
          }
        }
      `;
      return graphqlRequest(query, { input });
    },

    getBalance: async () => {
      const query = `
        query UserBalance {
          userBalance {
            id
            availableBalance
            totalBalance
            lockedBalance
            totalDeposited
            totalWithdrawn
            totalProfit
            totalLoss
            currency
            totalInvested
            unrealizedPnL
            realizedPnL
            bonusBalance
            referralEarnings
          }
        }
      `;
      return graphqlRequest(query);
    },

    getPortfolio: async () => {
      const query = `
        query UserPortfolio {
          userPortfolio {
            id
            totalValue
            totalInvested
            totalProfitLoss
            profitLossPercentage
            activePositions
            closedPositions
          }
        }
      `;
      return graphqlRequest(query);
    },
  },

  transactions: {
    getAll: async (params?: {
      page?: number;
      limit?: number;
      type?: string;
      status?: string
    }) => {
      const query = `
        query Transactions($page: Int, $limit: Int, $type: TransactionType, $status: TransactionStatus) {
          transactions(page: $page, limit: $limit, type: $type, status: $status) {
            transactions {
              id
              type
              amount
              currency
              status
              paymentMethod
              description
              balanceBefore
              balanceAfter
              createdAt
              updatedAt
            }
            pagination {
              page
              limit
              totalPages
              totalItems
              hasNext
              hasPrevious
            }
          }
        }
      `;
      return graphqlRequest(query, params);
    },

    createDepositWithFile: async (formData: FormData) => {
      return restRequest('transactions/deposit', 'POST', formData, undefined, true);
    },

    getById: async (id: string) => {
      const query = `
        query Transaction($id: ID!) {
          transaction(id: $id) {
            id
            type
            amount
            currency
            status
            paymentMethod
            description
            notes
            balanceBefore
            balanceAfter
            createdAt
            updatedAt
          }
        }
      `;
      return graphqlRequest(query, { id });
    },

    createDeposit: async (input: any) => {
      const query = `
        mutation CreateDeposit($input: CreateDepositInput!) {
          createDeposit(input: $input) {
            id
            type
            amount
            currency
            status
            createdAt
          }
        }
      `;
      return graphqlRequest(query, { input });
    },

    createWithdrawal: async (input: any) => {
      const query = `
        mutation CreateWithdrawal($input: CreateWithdrawalInput!) {
          createWithdrawal(input: $input) {
            id
            type
            amount
            currency
            status
            createdAt
          }
        }
      `;
      return graphqlRequest(query, { input });
    },
  },

  notifications: {
    getAll: async (params?: { page?: number; limit?: number; isRead?: boolean }) => {
      const query = `
        query Notifications($page: Int, $limit: Int, $isRead: Boolean) {
          notifications(page: $page, limit: $limit, isRead: $isRead) {
            notifications {
              id
              type
              title
              message
              isRead
              isDone
              priority
              actionRequired
              actionUrl
              actionLabel
              createdAt
            }
            pagination {
              page
              limit
              totalPages
              totalItems
              hasNext
              hasPrevious
            }
          }
        }
      `;
      return graphqlRequest(query, params);
    },

    markAsRead: async (id: string) => {
      const query = `
        mutation MarkNotificationAsRead($id: ID!) {
          markNotificationAsRead(id: $id) {
            id
            isRead
          }
        }
      `;
      return graphqlRequest(query, { id });
    },

    markAllAsRead: async () => {
      const query = `
        mutation MarkAllNotificationsAsRead {
          markAllNotificationsAsRead {
            success
            message
          }
        }
      `;
      return graphqlRequest(query);
    },

    delete: async (id: string) => {
      const query = `
        mutation DeleteNotification($id: ID!) {
          deleteNotification(id: $id) {
            success
            message
          }
        }
      `;
      return graphqlRequest(query, { id });
    },
  },

  watchlist: {
    get: async () => {
      const query = `
        query Watchlist {
          watchlist {
            id
            assets {
              symbol
              assetType
              addedAt
              alertPrice
              notes
            }
          }
        }
      `;
      return graphqlRequest(query);
    },

    add: async (input: {
      symbol: string;
      assetType: string;
      alertPrice?: number;
      notes?: string
    }) => {
      const query = `
        mutation AddToWatchlist($input: AddToWatchlistInput!) {
          addToWatchlist(input: $input) {
            id
            assets {
              symbol
              assetType
              alertPrice
              notes
            }
          }
        }
      `;
      return graphqlRequest(query, { input });
    },

    remove: async (symbol: string) => {
      const query = `
        mutation RemoveFromWatchlist($symbol: String!) {
          removeFromWatchlist(symbol: $symbol) {
            id
            assets {
              symbol
              assetType
            }
          }
        }
      `;
      return graphqlRequest(query, { symbol });
    },

    update: async (symbol: string, input: { alertPrice?: number; notes?: string }) => {
      const query = `
        mutation UpdateWatchlistItem($symbol: String!, $input: UpdateWatchlistInput!) {
          updateWatchlistItem(symbol: $symbol, input: $input) {
            id
            assets {
              symbol
              alertPrice
              notes
            }
          }
        }
      `;
      return graphqlRequest(query, { symbol, input });
    },
  },

  market: {
    getQuote: async (symbol: string, assetType: string) => {
      return restRequest(`market/quote?symbol=${symbol}&assetType=${assetType}`, 'GET');
    },

    getWatchlistQuotes: async () => {
      return restRequest('market/watchlist-quotes', 'GET');
    },

    search: async (query: string) => {
      return restRequest(`market/search?query=${query}`, 'GET');
    },

    getCompanyProfile: async (symbol: string) => {
      return restRequest(`market/company-profile?symbol=${symbol}`, 'GET');
    },

    getCandles: async (
      symbol: string,
      resolution: string,
      from: number,
      to: number,
      assetType?: string
    ) => {
      let url = `market/candles?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`;
      if (assetType) {
        url += `&assetType=${assetType}`;
      }
      return restRequest(url, 'GET');
    },

    getCryptoSymbols: async () => {
      const { fetchAllCryptoData } = await import('./binance');
      return await fetchAllCryptoData();
    },

    getCryptoPaginated: async (page: number = 1, limit: number = 10) => {
      const { fetchAllCryptoData, paginateCryptoData } = await import('./binance');
      const allData = await fetchAllCryptoData();
      return paginateCryptoData(allData, page, limit);
    },

    getForexPairs: async () => {
      return restRequest('forex/pairs', 'GET');
    },

    getForexPaginated: async (page: number = 1, limit: number = 10) => {
      return restRequest(`forex/pairs/paginated?page=${page}&limit=${limit}`, 'GET');
    }
  },

  orders: {
    getAll: async (status?: string) => {
      const query = `
        query Orders($status: OrderStatus) {
          orders(status: $status) {
            id
            symbol
            assetType
            orderType
            side
            quantity
            price
            stopPrice
            status
            filledQuantity
            averageFillPrice
            timeInForce
            createdAt
            updatedAt
          }
        }
      `;
      return graphqlRequest(query, { status });
    },

    getById: async (id: string) => {
      const query = `
        query Order($id: ID!) {
          order(id: $id) {
            id
            symbol
            assetType
            orderType
            side
            quantity
            price
            stopPrice
            status
            filledQuantity
            averageFillPrice
            timeInForce
            notes
            createdAt
            updatedAt
          }
        }
      `;
      return graphqlRequest(query, { id });
    },

    create: async (input: any) => {
      const query = `
        mutation CreateOrder($input: CreateOrderInput!) {
          createOrder(input: $input) {
            id
            symbol
            assetType
            orderType
            side
            quantity
            price
            status
            createdAt
          }
        }
      `;
      return graphqlRequest(query, { input });
    },

    createRest: async (data: any) => {
      return restRequest('orders', 'POST', data);
    },

    getAllRest: async (status?: string) => {
      let url = 'orders';
      if (status) url += `?status=${status}`;
      return restRequest(url, 'GET');
    },

    cancel: async (id: string) => {
      const query = `
        mutation CancelOrder($id: ID!) {
          cancelOrder(id: $id) {
            id
            status
            updatedAt
          }
        }
      `;
      return graphqlRequest(query, { id });
    }
  },

  positions: {
    getAll: async () => {
      const query = `
        query Positions {
          positions {
            id
            symbol
            assetType
            quantity
            averagePrice
            currentPrice
            marketValue
            unrealizedPnL
            unrealizedPnLPercent
            totalCost
            side
            openedAt
            lastUpdated
          }
        }
      `;
      return graphqlRequest(query);
    },

    getBySymbol: async (symbol: string) => {
      const query = `
        query Position($symbol: String!) {
          position(symbol: $symbol) {
            id
            symbol
            assetType
            quantity
            averagePrice
            currentPrice
            marketValue
            unrealizedPnL
            unrealizedPnLPercent
            totalCost
            side
            openedAt
            lastUpdated
          }
        }
      `;
      return graphqlRequest(query, { symbol });
    }
  },

  transfers: {
    internalTransfer: async (data: { fromAccount: string; toAccount: string; amount: number }) => {
      return restRequest('transactions/transfer', 'POST', data);
    }
  },

  bank: {
    getAccounts: async () => {
      return restRequest('bank-accounts', 'GET');
    },

    addAccount: async (data: {
      bankName: string;
      accountHolderName: string;
      accountNumber: string;
      accountType: string;
      ifscCode: string;
    }) => {
      return restRequest('bank-accounts', 'POST', data);
    },

    updateAccount: async (id: string, updates: any) => {
      return restRequest(`bank-accounts/${id}`, 'PATCH', updates);
    },

    deleteAccount: async (id: string) => {
      return restRequest(`bank-accounts/${id}`, 'DELETE');
    },
  },

  password: {
    forgotPassword: async (email: string) => {
      return restRequest('password/forgot', 'POST', { email });
    },

    verifyResetOTP: async (email: string, otp: string) => {
      return restRequest('password/verify-otp', 'POST', { email, otp });
    },

    resetPassword: async (resetToken: string, newPassword: string) => {
      return restRequest('password/reset', 'POST', { resetToken, newPassword });
    },

    changePassword: async (currentPassword: string, newPassword: string) => {
      return restRequest('password/change', 'POST', { currentPassword, newPassword });
    }
  },

  admin: {
    // Dashboard
    getDashboardStats: async () => {
      return restRequest('admin/dashboard', 'GET');
    },

    // Users Management
    getAllUsers: async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string
    }) => {
      const query = new URLSearchParams(params as any).toString();
      return restRequest(`admin/users${query ? '?' + query : ''}`, 'GET');
    },

    getUserDetails: async (userId: string) => {
      return restRequest(`admin/users/${userId}`, 'GET');
    },

    updateUserStatus: async (userId: string, accountStatus: string, reason?: string) => {
      return restRequest(`admin/users/${userId}/status`, 'PATCH', { accountStatus, reason });
    },

    updateKYCStatus: async (userId: string, kycStatus: string, reason?: string) => {
      return restRequest(`admin/users/${userId}/kyc`, 'PATCH', { kycStatus, reason });
    },

    addBalance: async (userId: string, amount: number, note?: string) => {
      return restRequest(`admin/users/${userId}/add-balance`, 'POST', { amount, note });
    },

    // Transactions Management
    getAllTransactions: async (params?: {
      page?: number;
      limit?: number;
      type?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    }) => {
      const query = new URLSearchParams(params as any).toString();
      return restRequest(`admin/transactions${query ? '?' + query : ''}`, 'GET');
    },

    getTransactionDetails: async (transactionId: string) => {
      return restRequest(`admin/transactions/${transactionId}`, 'GET');
    },

    updateTransactionStatus: async (transactionId: string, status: string, notes?: string) => {
      return restRequest(`admin/transactions/${transactionId}/status`, 'PATCH', { status, notes });
    },

    // Orders Management
    getAllOrders: async (params?: {
      page?: number;
      limit?: number;
      status?: string;
      orderType?: string;
      assetType?: string;
      side?: string;
      userId?: string;
      symbol?: string;
      startDate?: string;
      endDate?: string;
    }) => {
      const query = new URLSearchParams(params as any).toString();
      return restRequest(`admin/orders${query ? '?' + query : ''}`, 'GET');
    },

    getOrderDetails: async (orderId: string) => {
      return restRequest(`admin/orders/${orderId}`, 'GET');
    },

    updateOrderStatus: async (orderId: string, status: string, reason?: string) => {
      return restRequest(`admin/orders/${orderId}/status`, 'PATCH', { status, reason });
    },

    forceExecuteOrder: async (orderId: string, fillPrice?: number, fillQuantity?: number) => {
      return restRequest(`admin/orders/${orderId}/execute`, 'POST', { fillPrice, fillQuantity });
    },

    getOrderStatistics: async (params?: {
      startDate?: string;
      endDate?: string;
      period?: string;
    }) => {
      const query = new URLSearchParams(params as any).toString();
      return restRequest(`admin/orders/stats${query ? '?' + query : ''}`, 'GET');
    },

    bulkCancelOrders: async (orderIds: string[], reason?: string) => {
      return restRequest('admin/orders/bulk/cancel', 'POST', { orderIds, reason });
    },

    // Statistics & Analytics
    getPlatformStats: async () => {
      return restRequest('admin/stats', 'GET');
    },

    getRevenueStats: async (params?: {
      startDate?: string;
      endDate?: string;
      period?: 'day' | 'week' | 'month' | 'year'
    }) => {
      const query = new URLSearchParams(params as any).toString();
      return restRequest(`admin/stats/revenue${query ? '?' + query : ''}`, 'GET');
    },

    getUserActivityStats: async (params?: {
      startDate?: string;
      endDate?: string
    }) => {
      const query = new URLSearchParams(params as any).toString();
      return restRequest(`admin/stats/user-activity${query ? '?' + query : ''}`, 'GET');
    },

    // Export Operations
    exportUsers: async (format: 'csv' | 'excel' = 'csv') => {
      return restRequest(`admin/export/users?format=${format}`, 'GET');
    },

    exportTransactions: async (params?: {
      format?: 'csv' | 'excel';
      startDate?: string;
      endDate?: string;
      type?: string;
      status?: string;
    }) => {
      const query = new URLSearchParams(params as any).toString();
      return restRequest(`admin/export/transactions${query ? '?' + query : ''}`, 'GET');
    },

    // Bulk Operations
    bulkUpdateUserStatus: async (userIds: string[], accountStatus: string, reason?: string) => {
      return restRequest('admin/users/bulk/update-status', 'POST', { userIds, accountStatus, reason });
    },

    bulkApproveKYC: async (userIds: string[]) => {
      return restRequest('admin/users/bulk/approve-kyc', 'POST', { userIds });
    },

    bulkRejectKYC: async (userIds: string[], reason: string) => {
      return restRequest('admin/users/bulk/reject-kyc', 'POST', { userIds, reason });
    },

    // System Configuration
    getSystemSettings: async () => {
      return restRequest('admin/settings', 'GET');
    },

    updateSystemSettings: async (settings: any) => {
      return restRequest('admin/settings', 'PATCH', settings);
    },

    // Audit Logs
    getAuditLogs: async (params?: {
      page?: number;
      limit?: number;
      action?: string;
      userId?: string;
      startDate?: string;
      endDate?: string;
    }) => {
      const query = new URLSearchParams(params as any).toString();
      return restRequest(`admin/audit-logs${query ? '?' + query : ''}`, 'GET');
    },
  },
};

// Export helpers for external use
export { graphqlRequest, restRequest };
