require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const mobilesRoutes = require('./routes/mobiles');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const adminMobilesRoutes = require('./routes/adminMobiles');
const adminOrdersRoutes = require('./routes/adminOrders');
const adminUsersRoutes = require('./routes/adminUsers');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Mobile E-Commerce API is running",
    version: "1.0.0"
  });
});

app.get("/healthCheck", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy"
  });
});

// API Routes

// Authentication routes
app.use('/api/auth', authRoutes);

// Customer routes
app.use('/api/mobiles', mobilesRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);

// Admin routes
app.use('/api/admin/mobiles', adminMobilesRoutes);
app.use('/api/admin/orders', adminOrdersRoutes);
app.use('/api/admin/users', adminUsersRoutes);

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start listening
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`API Documentation:`);
      console.log(`- Customer APIs: /api/mobiles, /api/cart, /api/orders`);
      console.log(`- Admin APIs: /api/admin/mobiles, /api/admin/orders, /api/admin/users`);
      console.log(`- Auth APIs: /api/auth`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();