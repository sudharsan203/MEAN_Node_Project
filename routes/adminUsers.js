const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateAdmin } = require('../middleware/auth');

// Get all users
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const { role } = req.query;
    
    const filter = {};
    if (role) {
      filter.role = role;
    }

    const users = await User.findAll(filter);

    // Remove passwords from response
    const sanitizedUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json({ 
      success: true, 
      data: sanitizedUsers
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user by ID
router.get('/:id', authenticateAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;

    res.json({ success: true, data: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update user
router.put('/update/:id', authenticateAdmin, express.json(), async (req, res) => {
  try {
    // Don't allow password update through this route
    const { password, ...updateData } = req.body;

    const result = await User.updateById(req.params.id, updateData);

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = await User.findById(req.params.id);
    const { password: pwd, ...userWithoutPassword } = user;

    res.json({ 
      success: true, 
      message: 'User updated successfully',
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete user
router.delete('/delete/:id', authenticateAdmin, async (req, res) => {
  try {
    const result = await User.deleteById(req.params.id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ 
      success: true, 
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user statistics
router.get('/stats/overview', authenticateAdmin, async (req, res) => {
  try {
    const stats = await User.getCollection().aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    const totalUsers = await User.getCollection().countDocuments();

    res.json({ 
      success: true, 
      data: {
        totalUsers,
        roleBreakdown: stats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
