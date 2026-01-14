# Mobile E-Commerce API

A comprehensive Node.js and MongoDB-based mobile shop application with **JWT authentication** and **role-based authorization** (Customer & Admin).

## 🔐 Security Features

- ✅ **JWT Token Authentication** - Secure token-based authentication
- ✅ **Password Hashing** - Bcrypt password encryption
- ✅ **Role-Based Authorization** - Customer and Admin access control
- ✅ **Token Expiration** - 24-hour token validity
- ✅ **Protected Routes** - Middleware-based route protection

## Features

### Customer Features
- 📱 View list of mobiles with different brands & models
- 📄 Pagination support
- 🔍 Filtering by brand, price range, and search
- 👁️ View detailed specifications of selected mobile
- 🛒 Add mobiles to cart
- 📦 Place orders
- 📋 Review placed orders

### Admin Features
- 👥 Manage users
- 📊 Manage orders (accept, deliver, cancel)
- 📱 Modify available mobiles in shop
- 📈 View statistics

## Project Structure

```
my-node_Peoject/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── User.js              # User model
│   ├── Mobile.js            # Mobile model
│   ├── Cart.js              # Cart model
│   └── Order.js             # Order model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── mobiles.js           # Customer mobile routes
│   ├── cart.js              # Cart routes
│   ├── orders.js            # Customer order routes
│   ├── adminMobiles.js      # Admin mobile management
│   ├── adminOrders.js       # Admin order management
│   └── adminUsers.js        # Admin user management
├── middleware/
│   └── auth.js              # Authentication middleware
├── index.js                 # Main application file
├── seedData.js              # Seed database with sample data
└── test.http                # API test examples

```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in the root directory:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
MONGODB_URI=mongodb://localhost:27017
DB_NAME=MobileECommerce
NODE_ENV=development
```

**Important:** Change `JWT_SECRET` to a strong random string! Generate one:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. Make sure MongoDB is running on `mongodb://localhost:27017`

4. Seed the database with sample data:
```bash
node seedData.js
```

5. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### 🔐 Authentication (Public)
- `POST /auth/register` - Register new user (returns JWT token)
- `POST /auth/login` - Login user (returns JWT token)
- `GET /auth/profile` - Get current user profile (requires authentication)

**All endpoints below require JWT token in Authorization header:**
```
Authorization: Bearer <your-jwt-token>
```

### 📱 Customer - Mobiles (Public/Protected)
- `GET /mobiles` - Get all mobiles (with pagination, filtering, search) - **Public**
- `GET /mobiles/:id` - Get mobile by ID - **Public**
- `GET /mobiles/filters/brands` - Get unique brands - **Public**

### 🛒 Customer - Cart (Protected - Customer/Admin)
- `GET /cart` - Get cart (requires authentication)
- `POST /cart/add` - Add item to cart
- `PUT /cart/update/:mobileId` - Update item quantity
- `DELETE /cart/remove/:mobileId` - Remove item from cart
- `DELETE /cart/clear` - Clear cart

### 📦 Customer - Orders (Protected - Customer/Admin)
- `POST /orders` - Place order from cart
- `GET /orders` - Get user's orders
- `GET /orders/:id` - Get specific order

### 👥 Admin - Users (Protected - Admin Only)
- `GET /admin/users` - Get all users
- `GET /admin/users/:id` - Get user by ID
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user
- `GET /admin/users/stats/overview` - Get user statistics

### 📱 Admin - Mobiles (Protected - Admin Only)
- `GET /admin/mobiles` - Get all mobiles (includes unavailable)
- `POST /admin/mobiles` - Add new mobile
- `PUT /admin/mobiles/:id` - Update mobile
- `PATCH /admin/mobiles/:id/stock` - Update stock
- `PATCH /admin/mobiles/:id/availability` - Toggle availability
- `DELETE /admin/mobiles/:id` - Delete mobile

### 📊 Admin - Orders (Protected - Admin Only)
- `GET /admin/orders` - Get all orders with user details
- `GET /admin/orders/:id` - Get order by ID
- `PUT /admin/orders/:id` - Update order status
- `GET /admin/orders/stats` - Get order statistics

## 🔐 Authentication & Authorization

### JWT Token Authentication
This project uses **JWT (JSON Web Token)** for secure authentication:

1. **Register or Login** to receive a JWT token
2. **Include the token** in the Authorization header for protected routes:
   ```
   Authorization: Bearer <your-jwt-token>
   ```
3. Tokens expire after **24 hours**

### Role-Based Access Control

- **Customer Role**: Can access cart, place orders, view own orders
- **Admin Role**: Can manage users, mobiles, and all orders

### Quick Start Example

```bash
# 1. Register a new customer
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123","role":"customer"}'

# 2. Login (get token)
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'

# 3. Use token for protected routes
curl http://localhost:5000/cart \
  -H "Authorization: Bearer <your-token-here>"
```

### Documentation
- 📖 **Full Authentication Guide**: See [AUTH_GUIDE.md](AUTH_GUIDE.md)
- 🚀 **Quick Reference**: See [QUICK_REF_AUTH.md](QUICK_REF_AUTH.md)
- 🧪 **Test Examples**: See [test-auth.http](test-auth.http)

## Database Collections

- **users** - User accounts (customers and admins)
- **mobiles** - Mobile phone inventory
- **carts** - User shopping carts
- **orders** - Customer orders

## Testing

Use the `test-auth.http` file with REST Client extension in VS Code to test all authentication endpoints.

For other API endpoints, use the `test.http` file.

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **JWT (jsonwebtoken)** - Authentication tokens
- **Bcrypt.js** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variables

## License

ISC
