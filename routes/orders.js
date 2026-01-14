const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Mobile = require('../models/Mobile');
const { authenticateUser } = require('../middleware/auth');

// Place an order from cart
router.post('/place', authenticateUser, express.json(), async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ 
        success: false, 
        error: 'Shipping address is required' 
      });
    }

    // Get cart with details
    const cart = await Cart.getCartWithDetails(req.userId);

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cart is empty' 
      });
    }

    // Check stock availability
    for (const item of cart.items) {
      if (item.mobile.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          error: `Insufficient stock for ${item.mobile.brand} ${item.mobile.model}` 
        });
      }
    }

    // Create order
    const orderData = {
      userId: req.userId,
      items: cart.items.map(item => ({
        mobileId: item.mobile._id,
        mobile: {
          brand: item.mobile.brand,
          model: item.mobile.model,
          imageUrl: item.mobile.imageUrl
        },
        quantity: item.quantity,
        price: item.mobile.price,
        subtotal: item.subtotal
      })),
      totalAmount: cart.total,
      shippingAddress
    };

    const order = await Order.create(orderData);

    // Update stock
    for (const item of cart.items) {
      await Mobile.updateStock(item.mobile._id, -item.quantity);
    }

    // Clear cart
    await Cart.clearCart(req.userId);

    res.json({ 
      success: true, 
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's orders
router.get('/my-orders', authenticateUser, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await Order.findByUserId(req.userId, {
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: result.orders,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get specific order by ID
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Verify order belongs to user
    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
