# Trading Platform API Endpoints Reference

## Base URLs
- **Backend**: `http://localhost:8080`
- **GraphQL**: `http://localhost:8080/graphql`
- **REST API**: `http://localhost:8080/api`

---

## GraphQL API

### Authentication Required
All GraphQL queries and mutations require JWT token in Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Queries

#### 1. Get Current User
```graphql
query Me {
  me {
    id
    fullname
    email
    role
    accountStatus
    isVerified
    isKYCCompleted
    kycStatus
  }
}
```

#### 2. Get Dashboard Data ⭐
```graphql
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
```

#### 3. Get User Profile
```graphql
query UserProfile {
  userProfile {
    id
    fullname
    email
    phone
    Address
    city
    state
    country
    pincode
    dateOfBirth
    nationality
    avatar
  }
}
```

#### 4. Get User Balance
```graphql
query UserBalance {
  userBalance {
    availableBalance
    totalBalance
    lockedBalance
    totalDeposited
    totalWithdrawn
    totalProfit
    totalLoss
    currency
  }
}
```

#### 5. Get Transactions (Paginated)
```graphql
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
```

#### 6. Get Notifications (Paginated)
```graphql
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
      createdAt
    }
    pagination {
      page
      limit
      totalPages
      totalItems
    }
  }
}
```

#### 7. Get Watchlist
```graphql
query Watchlist {
  watchlist {
    id
    assets {
      symbol
      assetType
      alertPrice
      notes
      addedAt
    }
  }
}
```

### Mutations

#### 1. Register User
```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    success
    message
    token
    user {
      id
      fullname
      email
    }
  }
}
```

Variables:
```json
{
  "input": {
    "fullname": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "mobileNumber": "+1234567890",
    "Address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "pincode": "10001"
  }
}
```

#### 2. Login
```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    success
    message
    token
    user {
      id
      fullname
      email
      role
    }
  }
}
```

Variables:
```json
{
  "input": {
    "email": "john@example.com",
    "password": "SecurePass123"
  }
}
```

#### 3. Create Deposit
```graphql
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
```

Variables:
```json
{
  "input": {
    "amount": 1000,
    "currency": "USD",
    "paymentMethod": "bank_transfer",
    "bankDetails": {
      "accountNumber": "1234567890",
      "bankName": "Example Bank"
    }
  }
}
```

#### 4. Create Withdrawal
```graphql
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
```

#### 5. Add to Watchlist
```graphql
mutation AddToWatchlist($input: AddToWatchlistInput!) {
  addToWatchlist(input: $input) {
    id
    assets {
      symbol
      assetType
      alertPrice
    }
  }
}
```

Variables:
```json
{
  "input": {
    "symbol": "AAPL",
    "assetType": "stock",
    "alertPrice": 150.00,
    "notes": "Watch for earnings"
  }
}
```

#### 6. Remove from Watchlist
```graphql
mutation RemoveFromWatchlist($symbol: String!) {
  removeFromWatchlist(symbol: $symbol) {
    id
    assets {
      symbol
    }
  }
}
```

#### 7. Mark Notification as Read
```graphql
mutation MarkNotificationAsRead($id: ID!) {
  markNotificationAsRead(id: $id) {
    id
    isRead
  }
}
```

#### 8. Update Profile
```graphql
mutation UpdateProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) {
    id
    fullname
    email
    Address
    city
    state
  }
}
```

---

## REST API Endpoints

### News API

#### 1. Get All News (Paginated)
```
GET /api/news?page=1&limit=10&q=bitcoin
```

Response:
```json
{
  "data": [
    {
      "source": { "name": "CoinDesk" },
      "author": "John Doe",
      "title": "Bitcoin Reaches New High",
      "description": "Bitcoin price surges...",
      "url": "https://...",
      "urlToImage": "https://...",
      "publishedAt": "2024-01-01T00:00:00Z",
      "content": "Full article content..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### 2. Get Crypto News
```
GET /api/news/crypto
```

#### 3. Get Forex News
```
GET /api/news/forex
```

#### 4. Get Stock News
```
GET /api/news/stocks
```

### Auth API (REST)

#### 1. Register
```
POST /api/auth/register
Content-Type: multipart/form-data

Body:
- fullname
- email
- password
- mobileNumber
- Address
- city
- state
- country
- pincode
```

#### 2. Login
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 3. Send OTP
```
POST /api/auth/send-otp
Content-Type: application/json

Body:
{
  "email": "user@example.com"
}
OR
{
  "phone": "+1234567890"
}
```

#### 4. Verify OTP
```
POST /api/auth/verify-otp
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "emailOtp": "123456"
}
OR
{
  "phone": "+1234567890",
  "phoneOtp": "123456"
}
```

### Market API (REST)

#### 1. Get Quote
```
GET /api/market/quote?symbol=AAPL&assetType=stock
Authorization: Bearer YOUR_JWT_TOKEN
```

#### 2. Get Watchlist Quotes
```
GET /api/market/watchlist-quotes
Authorization: Bearer YOUR_JWT_TOKEN
```

#### 3. Search Symbols
```
GET /api/market/search?query=apple
Authorization: Bearer YOUR_JWT_TOKEN
```

#### 4. Get Company Profile
```
GET /api/market/company-profile?symbol=AAPL
Authorization: Bearer YOUR_JWT_TOKEN
```

#### 5. Get Candlestick Data
```
GET /api/market/candles?symbol=AAPL&resolution=D&from=1609459200&to=1640995200&assetType=stock
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Health & Status Endpoints

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "database": "connected",
    "websocket": "active",
    "graphql": "active",
    "news": "active"
  }
}
```

### API Documentation
```
GET /api/docs
```

### Test Endpoint
```
GET /test
```

---

## Enums Reference

### TransactionType
- `deposit`
- `withdrawal`
- `investment`
- `profit`
- `loss`
- `fee`
- `bonus`
- `refund`
- `transfer`

### TransactionStatus
- `pending`
- `processing`
- `completed`
- `failed`
- `cancelled`
- `rejected`

### PaymentMethod
- `bank_transfer`
- `credit_card`
- `debit_card`
- `upi`
- `crypto`
- `paypal`

### AssetType
- `cryptocurrency`
- `stock`
- `forex`
- `commodity`

### KYCStatus
- `not_started`
- `pending`
- `under_review`
- `approved`
- `rejected`

### NotificationPriority
- `low`
- `medium`
- `high`
- `urgent`

---

## Error Handling

### GraphQL Errors
```json
{
  "errors": [
    {
      "message": "Unauthorized",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

### REST API Errors
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

---

## Environment Variables Required

```env
# Server
PORT=8080
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/trading

# JWT
JWT_SECRET=your-secret-key-here

# News API
NEWSAPI_KEY=your-newsapi-key

# Market Data (Optional)
FINNHUB_API_KEY=your-finnhub-key
ALPHA_VANTAGE_KEY=your-alphavantage-key
```

---

## Testing with cURL

### GraphQL Request
```bash
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"query":"query { dashboard { balance { total } } }"}'
```

### REST Request
```bash
curl -X GET "http://localhost:8080/api/news?page=1&limit=5" \
  -H "Content-Type: application/json"
```

---

## Frontend Integration Example

```typescript
// Using the api client
import { api } from '@/lib/api';

// Get dashboard data
const dashboardData = await api.dashboard.getData(token);

// Get transactions
const transactions = await api.transactions.getAll(token, {
  page: 1,
  limit: 10,
  type: 'deposit'
});

// Add to watchlist
await api.watchlist.add(token, {
  symbol: 'AAPL',
  assetType: 'stock',
  alertPrice: 150
});
```

---

## Summary

✅ **GraphQL API**: Complete with authentication, dashboard, transactions, notifications, watchlist
✅ **REST API**: News, Auth, Market data endpoints
✅ **Security**: JWT authentication, password hashing, OTP verification
✅ **Database**: MongoDB with Mongoose models
✅ **Real-time**: WebSocket support available
✅ **Documentation**: GraphiQL interface in development mode

All endpoints are **production-ready** and fully functional! 🚀
