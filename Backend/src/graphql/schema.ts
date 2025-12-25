export const schema = `
  # Scalars
  scalar Date
  scalar JSON

  # Enums
  enum UserRole {
    user
    admin
    moderator
  }

  enum AccountStatus {
    active
    inactive
    suspended
    under_review
    pending
  }

  enum KYCStatus {
    not_started
    pending
    under_review
    approved
    rejected
  }

  enum TransactionType {
    deposit
    withdrawal
    investment
    profit
    loss
    fee
    bonus
    refund
    transfer
  }

  enum TransactionStatus {
    pending
    processing
    completed
    failed
    cancelled
    rejected
  }

  enum PaymentMethod {
    bank_transfer
    credit_card
    debit_card
    upi
    crypto
    paypal
  }

  enum Currency {
    USD
    EUR
    GBP
    INR
  }

  enum NotificationType {
    kyc_approved
    kyc_rejected
    payment_approved
    payment_rejected
    balance_added
    investment_created
    investment_closed
    account_suspended
    price_alert
    margin_call
    general
  }

  enum NotificationPriority {
    low
    medium
    high
    urgent
  }

  enum AssetType {
    cryptocurrency
    stock
    forex
    commodity
  }

  enum OrderType {
    market
    limit
    stop
    stop_limit
  }

  enum OrderSide {
    buy
    sell
  }

  enum OrderStatus {
    pending
    working
    filled
    partially_filled
    cancelled
    rejected
  }

  enum TimeInForce {
    day
    gtc
    ioc
    fok
  }

  enum PositionSide {
    long
    short
  }

  # Types
  type User {
    id: ID!
    fullname: String!
    email: String!
    phone: String
    role: UserRole!
    accountStatus: AccountStatus!
    mobileNumber: String!
    leverage_type: String
    Address: String!
    Address1: String
    city: String!
    state: String!
    country: String!
    pincode: String!
    dateOfBirth: String
    nationality: String
    avatar: String
    isVerified: Boolean!
    isKYCCompleted: Boolean!
    kycStatus: KYCStatus!
    twoFactorEnabled: Boolean!
    lastActive: Date
    createdAt: Date!
    updatedAt: Date!
    balance: AccountBalance
    portfolio: Portfolio
  }

  type AuthPayload {
    success: Boolean!
    message: String
    token: String
    user: User
  }

  type AccountBalance {
    id: ID!
    userId: ID!
    availableBalance: Float!
    totalBalance: Float!
    lockedBalance: Float!
    totalDeposited: Float!
    totalWithdrawn: Float!
    totalProfit: Float!
    totalLoss: Float!
    currency: Currency!
    totalInvested: Float!
    unrealizedPnL: Float!
    realizedPnL: Float!
    bonusBalance: Float!
    referralEarnings: Float!
    lastUpdated: Date!
    createdAt: Date!
    updatedAt: Date!
  }

  type Transaction {
    id: ID!
    userId: ID!
    type: TransactionType!
    amount: Float!
    currency: String!
    status: TransactionStatus!
    paymentMethod: PaymentMethod
    description: String
    notes: String
    balanceBefore: Float
    balanceAfter: Float
    createdAt: Date!
    updatedAt: Date!
  }

  type Notification {
    id: ID!
    userId: ID!
    type: NotificationType!
    title: String!
    message: String!
    isRead: Boolean!
    isDone: Boolean!
    priority: NotificationPriority!
    actionRequired: Boolean!
    actionUrl: String
    actionLabel: String
    createdAt: Date!
    updatedAt: Date!
  }

  type WatchlistAsset {
    symbol: String!
    assetType: AssetType!
    addedAt: Date!
    alertPrice: Float
    notes: String
  }

  type Watchlist {
    id: ID!
    userId: ID!
    assets: [WatchlistAsset!]!
    createdAt: Date!
    updatedAt: Date!
  }

  type Portfolio {
    id: ID!
    userId: ID!
    totalValue: Float!
    totalInvested: Float!
    totalProfitLoss: Float!
    profitLossPercentage: Float!
    activePositions: Int!
    closedPositions: Int!
    createdAt: Date!
    updatedAt: Date!
  }

  type Order {
    id: ID!
    userId: ID!
    symbol: String!
    assetType: AssetType!
    orderType: OrderType!
    side: OrderSide!
    quantity: Float!
    price: Float
    stopPrice: Float
    status: OrderStatus!
    filledQuantity: Float!
    averageFillPrice: Float
    timeInForce: TimeInForce!
    expiresAt: Date
    notes: String
    createdAt: Date!
    updatedAt: Date!
  }

  type Position {
    id: ID!
    userId: ID!
    symbol: String!
    assetType: AssetType!
    quantity: Float!
    averagePrice: Float!
    currentPrice: Float
    marketValue: Float
    unrealizedPnL: Float
    unrealizedPnLPercent: Float
    totalCost: Float!
    side: PositionSide!
    openedAt: Date!
    lastUpdated: Date!
    createdAt: Date!
    updatedAt: Date!
  }

  type DashboardData {
    balance: BalanceData!
    activities: [Transaction!]!
    notifications: [Notification!]!
    watchlist: [WatchlistAsset!]!
    pendingActions: Int!
    charts: ChartData!
  }

  type BalanceData {
    total: Float!
    change: String!
    recentDeposits: Float!
  }

  type ChartData {
    portfolioPerformance: [Float!]!
    depositActivity: [Float!]!
  }

  type PaginatedTransactions {
    transactions: [Transaction!]!
    pagination: PaginationInfo!
  }

  type PaginatedNotifications {
    notifications: [Notification!]!
    pagination: PaginationInfo!
  }

  type PaginationInfo {
    page: Int!
    limit: Int!
    totalPages: Int!
    totalItems: Int!
    hasNext: Boolean!
    hasPrevious: Boolean!
  }

  type OTPResponse {
    success: Boolean!
    message: String
  }

  type GenericResponse {
    success: Boolean!
    message: String!
  }

  # Input Types
  input RegisterInput {
    fullname: String!
    email: String!
    password: String!
    mobileNumber: String!
    Address: String!
    city: String!
    state: String!
    country: String!
    pincode: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    fullname: String
    phone: String
    Address: String
    Address1: String
    city: String
    state: String
    country: String
    pincode: String
    dateOfBirth: String
    nationality: String
  }

  input CreateDepositInput {
    amount: Float!
    currency: String!
    paymentMethod: PaymentMethod!
    bankDetails: JSON
    proofDocument: String
  }

  input CreateWithdrawalInput {
    amount: Float!
    currency: String!
    paymentMethod: PaymentMethod!
    bankDetails: JSON
  }

  input AddToWatchlistInput {
    symbol: String!
    assetType: AssetType!
    alertPrice: Float
    notes: String
  }

  input UpdateWatchlistInput {
    alertPrice: Float
    notes: String
  }

  input CreateOrderInput {
    symbol: String!
    assetType: AssetType!
    orderType: OrderType!
    side: OrderSide!
    quantity: Float!
    price: Float
    stopPrice: Float
    timeInForce: TimeInForce
    notes: String
  }

  # Queries
  type Query {
    # Auth
    me: User

    # Dashboard
    dashboard: DashboardData!

    # User
    userProfile: User!
    userBalance: AccountBalance!
    userPortfolio: Portfolio

    # Transactions
    transactions(page: Int, limit: Int, type: TransactionType, status: TransactionStatus): PaginatedTransactions!
    transaction(id: ID!): Transaction

    # Notifications
    notifications(page: Int, limit: Int, isRead: Boolean): PaginatedNotifications!

    # Watchlist
    watchlist: Watchlist!

    # Orders
    orders(status: OrderStatus): [Order!]!
    order(id: ID!): Order

    # Positions
    positions: [Position!]!
    position(symbol: String!): Position
  }

  # Mutations
  type Mutation {
    # Auth
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    logout: GenericResponse!
    
    # OTP
    sendOTP(identifier: String!): OTPResponse!
    verifyOTP(identifier: String!, code: String!): AuthPayload!

    # User
    updateProfile(input: UpdateProfileInput!): User!

    # Transactions
    createDeposit(input: CreateDepositInput!): Transaction!
    createWithdrawal(input: CreateWithdrawalInput!): Transaction!

    # Notifications
    markNotificationAsRead(id: ID!): Notification!
    markAllNotificationsAsRead: GenericResponse!
    deleteNotification(id: ID!): GenericResponse!

    # Watchlist
    addToWatchlist(input: AddToWatchlistInput!): Watchlist!
    removeFromWatchlist(symbol: String!): Watchlist!
    updateWatchlistItem(symbol: String!, input: UpdateWatchlistInput!): Watchlist!

    # Orders
    createOrder(input: CreateOrderInput!): Order!
    cancelOrder(id: ID!): Order!
  }
`;
