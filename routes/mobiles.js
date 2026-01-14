const express = require('express');
const router = express.Router();
const Mobile = require('../models/Mobile');
const { authenticateCustomer } = require('../middleware/auth');

// Get all mobiles with pagination and filtering
router.get('/', authenticateCustomer, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      brand, 
      minPrice, 
      maxPrice, 
      search,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build filter
    const filter = { isAvailable: true };
    
    if (brand) {
      filter.brand = { $regex: brand, $options: 'i' };
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$or = [
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const result = await Mobile.findAll(filter, {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOptions
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

// Get mobile by ID
router.get('/:id', authenticateCustomer, async (req, res) => {
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

// Get unique brands
router.get('/filters/brands', authenticateCustomer, async (req, res) => {
  try {
    const brands = await Mobile.getCollection().distinct('brand', { isAvailable: true });
    res.json({ success: true, data: brands });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
