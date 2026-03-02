# UPI Payment System - Setup Guide

## Quick Start

### Step 1: Install Dependencies
```bash
pnpm install
cd server && pnpm install && cd ..
```

### Step 2: Set Up Environment Variables
Copy `.env.local.example` to `.env.local` and update with your MongoDB credentials:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
MONGODB_URI="mongodb://localhost:27017"
MONGODB_DB="upi_payment_system"
ADMIN_EMAIL="admin@plannermarket.com"
ADMIN_PASSWORD="admin123"
```

### Step 3: Start MongoDB
```bash
# Local MongoDB
mongod

# OR for macOS with Homebrew
brew services start mongodb-community

# OR use MongoDB Atlas (cloud)
# Update MONGODB_URI with your Atlas connection string
```

### Step 4: Start Development Server
```bash
pnpm dev
```

Visit: http://localhost:3000

### Step 5: Access Admin Dashboard
1. Go to http://localhost:3000/admin
2. Login with:
   - Email: `admin@plannermarket.com`
   - Password: `admin123`

---

## 📊 Database Structure

### Default Collections Created Automatically

#### 1. **admins** Collection
```javascript
{
  _id: ObjectId,
  email: "admin@plannermarket.com",
  password: "admin123", // hash this in production
  name: "Admin",
  role: "super-admin",
  permissions: [
    "view_orders",
    "approve_payments",
    "update_order_status",
    "manage_admins"
  ],
  isActive: true,
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

#### 2. **orders** Collection
```javascript
{
  _id: ObjectId,
  userId: "user123",
  items: [
    {
      id: "product1",
      name: "Product Name",
      price: 100,
      quantity: 1
    }
  ],
  total: 100,
  status: "Pending", // "Pending", "Processing", "Shipped", "Delivered"
  paymentMethod: "UPI", // "UPI", "Card", "NetBanking"
  paymentApproved: false,
  transactionId: "UPI123456",
  customerDetails: {
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    address: "123 Main St, City"
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. **payments** Collection
```javascript
{
  _id: ObjectId,
  orderId: ObjectId,
  amount: 100,
  status: "completed",
  method: "UPI",
  transactionId: "UPI123456",
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Reference

### Admin Login
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@plannermarket.com","password":"admin123"}'
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "admin": {
    "id": "...",
    "email": "admin@plannermarket.com",
    "name": "Admin",
    "role": "super-admin"
  }
}
```

### Get Dashboard Data
```bash
curl -X GET http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer <token>"
```

### Approve Payment
```bash
curl -X POST http://localhost:3000/api/admin/orders/{orderId} \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

---

## 🛠️ File Structure

```
project/
├── server/
│   ├── models/
│   │   ├── Admin.ts         # Admin schema & interface
│   │   ├── Order.ts         # Order schema & interface
│   │   └── index.ts         # Export all models
│   ├── middleware/
│   │   └── auth.ts          # Auth helpers (verify token, hash password)
│   ├── db.ts                # MongoDB connection & initialization
│   ├── index.ts             # Server entry point
│   └── package.json         # Server dependencies
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   │   └── route.ts         # POST /api/admin/login
│   │   │   ├── dashboard/
│   │   │   │   └── route.ts         # GET /api/admin/dashboard
│   │   │   └── orders/
│   │   │       └── [orderId]/
│   │   │           └── route.ts     # POST/GET /api/admin/orders/{orderId}
│   │   └── orders/
│   │       └── route.ts             # Order management
│   ├── admin/
│   │   ├── page.tsx                 # Admin login page
│   │   └── dashboard/
│   │       └── page.tsx             # Admin dashboard
│   ├── (store)/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── navbar.tsx
│   ├── footer.tsx
│   └── ui/                  # Radix UI components
├── lib/
│   ├── data.ts              # Sample product data
│   ├── store.ts             # Zustand store
│   └── utils.ts             # Utility functions
├── public/
├── .env.local               # Environment variables (create from .env.local.example)
├── .env.local.example       # Environment template
├── package.json             # Client dependencies
├── tsconfig.json
└── README.md
```

---

## 🚀 Workflow

### For Customers:
1. Browse products at http://localhost:3000
2. Add items to cart
3. Go to checkout
4. Select payment method:
   - **UPI**: Scan QR code, enter transaction ID
   - **Card/NetBanking**: Standard payment form
5. Place order
6. View order status at confirmation page

### For Admins:
1. Login at http://localhost:3000/admin
2. View all orders and pending UPI payments
3. Click "Approve Pay" for UPI orders awaiting approval
4. Order moves to "Processing" status
5. Track shipping and delivery status

---

## 🔒 Security Notes

Current implementation is for **development only**. For production:

1. **Hash Passwords**: Use bcrypt
   ```typescript
   import bcrypt from 'bcrypt';
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **Use JWT**: Implement proper JWT with expiration
   ```typescript
   import jwt from 'jsonwebtoken';
   const token = jwt.sign(adminData, process.env.JWT_SECRET, { expiresIn: '24h' });
   ```

3. **HTTPS**: Always use HTTPS in production
4. **CORS**: Configure CORS properly
5. **Rate Limiting**: Add rate limiting on sensitive endpoints
6. **Input Validation**: Validate all inputs with Zod

---

## 📱 Testing UPI Payment Flow

1. Go to store and add items to cart
2. Checkout → Select UPI
3. Scan QR code (or in test, just note the Transaction ID)
4. Enter any Transaction ID (e.g., "UPI123456")
5. Place order
6. Order appears in admin dashboard with "Pending" status
7. Admin approves payment
8. Order status changes to "Processing"
9. Customer sees order confirmation

---

## 🆘 Common Issues & Fixes

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Fix**: Start MongoDB service
```bash
# macOS
brew services start mongodb-community

# Windows
# Run MongoDB from your installation directory
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Fix**: Kill the process using port 3000
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Admin Login Failed
- Verify email and password in `.env.local`
- Check database: `db.admins.findOne({email: "..."})`
- Ensure MongoDB is running

### Orders Not Showing
- Check MongoDB connection
- Verify collection exists: `db.orders.count()`
- Check logs for errors

---

## 📞 Next Steps

1. **Customize Products**: Edit `lib/data.ts`
2. **Add More Admins**: Insert into `admins` collection
3. **Email Notifications**: Configure SMTP in `.env.local` and update `server/mail.ts`
4. **Payment Gateway**: Integrate real payment processors
5. **Deploy**: Use Vercel (frontend) + Heroku/Railway (backend)

Good luck! 🚀
