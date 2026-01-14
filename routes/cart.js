const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { authenticateUser } = require('../middleware/auth');

// Get user's cart with details
router.get('/', authenticateUser, async (req, res) => {
  try {
    const cart = await Cart.getCartWithDetails(req.userId);
    
    res.json({ 
      success: true, 
      data: cart || { items: [], total: 0 }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add item to cart
router.post('/add', authenticateUser, async (req, res) => {
  try {
    const { mobileId, quantity = 1 } = req.body;

    if (!mobileId) {
      return res.status(400).json({ success: false, error: 'Mobile ID is required' });
    }

    await Cart.addItem(req.userId, mobileId, quantity);
    const cart = await Cart.getCartWithDetails(req.userId);

    res.status(201).json({ 
      success: true, 
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update item quantity
router.put('/update', authenticateUser, async (req, res) => {
  try {
    const { mobileId, quantity } = req.body;

    if (!mobileId || !quantity || quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        error: 'Valid mobile ID and quantity are required' 
      });
    }

    await Cart.updateItemQuantity(req.userId, mobileId, quantity);
    const cart = await Cart.getCartWithDetails(req.userId);

    res.json({ 
      success: true, 
      message: 'Cart updated',
      data: cart
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:mobileId', authenticateUser, async (req, res) => {
  try {
    await Cart.removeItem(req.userId, req.params.mobileId);
    const cart = await Cart.getCartWithDetails(req.userId);

    res.json({ 
      success: true, 
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clear cart
router.delete('/clear', authenticateUser, async (req, res) => {
  try {
    await Cart.clearCart(req.userId);

    res.json({ 
      success: true, 
      message: 'Cart cleared'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
