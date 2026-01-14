const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authenticateAdmin } = require('../middleware/auth');

// Get all orders with user details
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const result = await Order.getOrdersWithUserDetails(filter, {
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

// Get order by ID
router.get('/:id', authenticateAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update order status (generic endpoint)
router.put('/:id', authenticateAdmin, express.json(), async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }

    const result = await Order.updateStatus(req.params.id, status);

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const order = await Order.findById(req.params.id);

    res.json({ 
      success: true, 
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete order
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { ObjectId } = require('../config/database');
    const result = await Order.getCollection().deleteOne({ 
      _id: new ObjectId(req.params.id) 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ 
      success: true, 
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Accept order
router.patch('/accept/:id', authenticateAdmin, async (req, res) => {
  try {
    const result = await Order.updateStatus(req.params.id, 'accepted');

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const order = await Order.findById(req.params.id);

    res.json({ 
      success: true, 
      message: 'Order accepted successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Deliver order
router.patch('/deliver/:id', authenticateAdmin, async (req, res) => {
  try {
    const result = await Order.updateStatus(req.params.id, 'delivered');

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const order = await Order.findById(req.params.id);

    res.json({ 
      success: true, 
      message: 'Order delivered successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cancel order
router.patch('/cancel/:id', authenticateAdmin, async (req, res) => {
  try {
    const result = await Order.updateStatus(req.params.id, 'cancelled');

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const order = await Order.findById(req.params.id);

    res.json({ 
      success: true, 
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get order statistics
router.get('/stats/overview', authenticateAdmin, async (req, res) => {
  try {
    const stats = await Order.getCollection().aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]).toArray();

    const totalOrders = await Order.getCollection().countDocuments();

    res.json({ 
      success: true, 
      data: {
        totalOrders,
        statusBreakdown: stats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
