# UPI Payment System - Restructured

This is a full-stack Next.js application with MongoDB database integration, featuring a UPI payment system with admin approval workflow.

## 📁 Project Structure

```
├── client/                 # Next.js frontend application
├── server/                 # Backend API server
│   ├── models/            # MongoDB data models (Order, Admin, etc.)
│   ├── routes/            # API route handlers
│   ├── middleware/        # Authentication & authorization
│   ├── db.ts              # Database connection & initialization
│   ├── index.ts           # Server entry point
│   └── package.json       # Server dependencies
├── app/                   # Next.js app directory
│   ├── api/               # API routes
│   │   ├── admin/         # Admin endpoints
│   │   │   ├── login/     # Admin login
│   │   │   ├── dashboard/ # Admin dashboard data
│   │   │   └── orders/    # Order management
│   │   └── orders/        # Order endpoints
│   ├── (store)/           # Store pages (layout group)
│   ├── admin/             # Admin pages
│   ├── login/             # Authentication pages
│   └── signup/
├── components/            # React components
├── lib/                   # Utility functions & stores
├── server/                # Server utilities
├── .env.local.example     # Environment variables template
└── package.json           # Client dependencies
```

## 🗄️ Database Structure

### MongoDB Collections

#### `admins` Collection
- `_id`: ObjectId (Primary Key)
- `email`: String (Unique Index)
- `password`: String (hashed in production)
- `name`: String
- `role`: "super-admin" | "admin"
- `permissions`: Array of permission strings
- `isActive`: Boolean
- `createdAt`: Date
- `updatedAt`: Date
- `lastLogin`: Date (optional)

**Default Admin:**
- Email: `admin@plannermarket.com`
- Password: `admin123`
- Role: `super-admin`

#### `orders` Collection
- `_id`: ObjectId (Primary Key)
- `userId`: String (Index)
- `items`: Array of OrderItems
  - `id`: String
  - `name`: String
  - `price`: Number
  - `quantity`: Number
- `total`: Number
- `status`: "Pending" | "Processing" | "Shipped" | "Delivered" (Index)
- `paymentMethod`: "UPI" | "Card" | "NetBanking"
- `paymentApproved`: Boolean
- `transactionId`: String (for UPI payments)
- `customerDetails`: Object
  - `name`: String
  - `email`: String
  - `phone`: String
  - `address`: String
- `createdAt`: Date (Index)
- `updatedAt`: Date

#### `payments` Collection
- `_id`: ObjectId (Primary Key)
- `orderId`: ObjectId (Index)
- `amount`: Number
- `status`: String (Index)
- `method`: String
- `transactionId`: String
- `createdAt`: Date
- `updatedAt`: Date

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- MongoDB instance running locally or MongoDB Atlas URI
- TypeScript knowledge

### 1. Clone & Install Dependencies

```bash
# Install client dependencies
pnpm install

# Install server dependencies
cd server
pnpm install
cd ..
```

### 2. Environment Setup

Create `.env.local` file in the root directory:

```env
# MongoDB connection
MONGODB_URI="mongodb://localhost:27017"
MONGODB_DB="upi_payment_system"

# Admin credentials
ADMIN_EMAIL="admin@plannermarket.com"
ADMIN_PASSWORD="admin123"

# JWT Secret
JWT_SECRET="your-secret-key-change-this"

# Email configuration (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# Application URLs
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. MongoDB Setup

#### Option A: Local MongoDB
```bash
# macOS with Homebrew
brew services start mongodb-community

# Windows
# Download from https://www.mongodb.com/try/download/community
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env.local`

### 4. Initialize Database

The database will be automatically initialized when the server starts. Collections and indexes will be created, and the default admin user will be inserted.

### 5. Run the Application

```bash
# Development mode (Next.js)
pnpm dev

# The application will be available at http://localhost:3000
```

## 📡 API Endpoints

### Admin Endpoints

#### Login
```
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@plannermarket.com",
  "password": "admin123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "base64_encoded_token",
  "admin": {
    "id": "...",
    "email": "admin@plannermarket.com",
    "name": "Admin",
    "role": "super-admin"
  }
}
```

#### Get Dashboard
```
GET /api/admin/dashboard
Headers:
  Authorization: Bearer <token>

Response:
{
  "success": true,
  "admin": {...},
  "stats": {
    "totalOrders": 10,
    "pendingApprovals": 2,
    "processingOrders": 3,
    "shippedOrders": 2,
    "deliveredOrders": 3,
    "totalRevenue": 5000
  },
  "pendingOrders": [...],
  "orders": [...]
}
```

#### Approve Payment
```
POST /api/admin/orders/{orderId}
Headers:
  Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Payment approved successfully",
  "order": {...}
}
```

#### Get Order Details
```
GET /api/admin/orders/{orderId}
Headers:
  Authorization: Bearer <token>

Response:
{
  "success": true,
  "order": {...}
}
```

## 🔐 Authentication

The system uses token-based authentication:

1. Admin logs in → Receives authorization token
2. Token is included in request headers: `Authorization: Bearer <token>`
3. Backend verifies token before processing admin requests

**Production Recommendations:**
- Use bcrypt for password hashing
- Implement JWT with expiration
- Use HTTPS for all requests
- Add rate limiting on login endpoint

## 💳 Payment Workflow

### UPI Payment Flow
1. User selects UPI at checkout
2. QR code is displayed
3. User scans and completes payment
4. User enters transaction ID
5. Order is placed with `paymentApproved: false`
6. Admin sees pending approval in dashboard
7. Admin clicks "Approve Pay" button
8. Order status changes to "Processing"
9. Order confirmation updated for user

### Card/Net Banking Payment Flow
1. User selects Card or Net Banking
2. Standard payment form is displayed
3. Payment is processed
4. Order is placed with `paymentApproved: true`
5. Order status automatically set to "Processing"
6. No admin approval required

## 🛠️ Development

### Adding New Admin Users

Connect to MongoDB and insert:
```javascript
db.admins.insertOne({
  email: "newadmin@example.com",
  password: "hashed_password", // hash in production
  name: "New Admin",
  role: "admin",
  permissions: ["view_orders", "approve_payments"],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Creating New Collections

Edit `server/db.ts` in the `initializeDatabases()` function to add new collections with proper indexes.

### Adding Models

1. Create new file in `server/models/`
2. Define TypeScript interface
3. Define MongoDB schema
4. Export from `server/models/index.ts`

## 📊 Database Indexes

Indexes are automatically created for performance:

| Collection | Field | Type |
|-----------|-------|------|
| orders | userId | Ascending |
| orders | status | Ascending |
| orders | createdAt | Descending |
| admins | email | Ascending (Unique) |
| payments | orderId | Ascending |
| payments | status | Ascending |

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running: `mongosh`
- Verify `MONGODB_URI` in `.env.local`
- Check network connectivity to MongoDB Atlas

### Admin Login Fails
- Verify credentials in `.env.local`
- Check if admin user exists: `db.admins.findOne({email: "..."})`
- Ensure admin is active: `isActive: true`

### Orders Not Appearing
- Check MongoDB connection
- Verify collection exists: `db.getCollectionNames()`
- Check order data: `db.orders.find({})`

## 📚 Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Backend:** Node.js, MongoDB
- **Authentication:** Token-based (JWT ready)
- **Styling:** Tailwind CSS + Radix UI
- **Forms:** React Hook Form + Zod
- **State Management:** Zustand
- **Database:** MongoDB with TypeScript support

## 📝 License

This project is provided as-is for educational and commercial purposes.

## 🤝 Support

For issues or questions, refer to the documentation or check the MongoDB and Next.js official documentation.
