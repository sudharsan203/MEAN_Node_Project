const express = require('express');
const router = express.Router();
const Mobile = require('../models/Mobile');
const { authenticateAdmin } = require('../middleware/auth');

// Get all mobiles (including unavailable)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await Mobile.findAll({}, {
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: result.mobiles,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new mobile
router.post('/add', authenticateAdmin, express.json(), async (req, res) => {
  try {
    const mobile = await Mobile.create(req.body);

    res.json({ 
      success: true, 
      message: 'Mobile added successfully',
      data: mobile
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update mobile
router.put('/update/:id', authenticateAdmin, express.json(), async (req, res) => {
  try {
    const result = await Mobile.updateById(req.params.id, req.body);

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: 'Mobile not found' });
    }

    const mobile = await Mobile.findById(req.params.id);

    res.json({ 
      success: true, 
      message: 'Mobile updated successfully',
      data: mobile
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete mobile
router.delete('/delete/:id', authenticateAdmin, async (req, res) => {
  try {
    const result = await Mobile.deleteById(req.params.id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Mobile not found' });
    }

    res.json({ 
      success: true, 
      message: 'Mobile deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', authenticateAdmin, async (req, res) => {
  try {
    const mobile = await Mobile.findById(req.params.id);
    if (!mobile) {
      return res.status(404).json({ success: false, error: 'Mobile not found' });
    }
    res.json({ success: true, data: mobile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update stock
router.patch('/stock/:id', authenticateAdmin, express.json(), async (req, res) => {
  try {
    const { stock } = req.body;

    if (stock === undefined) {
      return res.status(400).json({ success: false, error: 'Stock value is required' });
    }

    const result = await Mobile.updateById(req.params.id, { stock });

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: 'Mobile not found' });
    }

    const mobile = await Mobile.findById(req.params.id);

    res.json({ 
      success: true, 
      message: 'Stock updated successfully',
      data: mobile
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Toggle availability
router.patch('/availability/:id', authenticateAdmin, express.json(), async (req, res) => {
  try {
    const { isAvailable } = req.body;

    if (isAvailable === undefined) {
      return res.status(400).json({ success: false, error: 'isAvailable value is required' });
    }

    const result = await Mobile.updateById(req.params.id, { isAvailable });

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: 'Mobile not found' });
    }

    const mobile = await Mobile.findById(req.params.id);

    res.json({ 
      success: true, 
      message: 'Availability updated successfully',
      data: mobile
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
