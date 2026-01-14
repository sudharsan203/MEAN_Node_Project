const express = require('express');
const AuthRoutes = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { authenticateUser } = require('../middleware/auth');

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'MobileECommerce2025',
    { expiresIn: '24h' } // Token expires in 24 hours
  );
};

// Register new user
AuthRoutes.post('/register', express.json(), async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email, and password are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    console.log("Existing User =>", existingUser);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already registered' 
      });
    }

    // Create user (password will be hashed in the model)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      phone,
      address
    });

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.role);

    const { password: pwd, ...userWithoutPassword } = user;

    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login
AuthRoutes.post('/login', express.json(), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    const user = await User.findByEmail(email);
    console.log("User details Login=>", user)
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials. Email not found.' 
      });
    }

    // Compare hashed password
    const isPasswordValid = await User.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials. Incorrect password.' 
      });
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.role);

    const { password: pwd, ...userWithoutPassword } = user;

    res.json({ 
      success: true, 
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get current user profile (requires authentication)
AuthRoutes.get('/profile', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;

    res.json({ success: true, data: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new address to user profile
AuthRoutes.post('/address', authenticateUser, express.json(), async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ success: false, error: 'Address is required' });
    }

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Initialize addresses array if it doesn't exist
    const addresses = user.addresses || [];
    
    // Add new address with unique ID
    const newAddress = {
      id: Date.now().toString(),
      ...address,
      createdAt: new Date()
    };
    
    addresses.push(newAddress);

    // Update user with new addresses array
    await User.updateById(req.userId, { addresses });

    res.json({ 
      success: true, 
      message: 'Address added successfully',
      data: newAddress
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all addresses
AuthRoutes.get('/addresses', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ 
      success: true, 
      data: user.addresses || []
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete an address
AuthRoutes.delete('/address/:id', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const addresses = (user.addresses || []).filter(addr => addr.id !== req.params.id);

    await User.updateById(req.userId, { addresses });

    res.json({ 
      success: true, 
      message: 'Address deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = AuthRoutes;
