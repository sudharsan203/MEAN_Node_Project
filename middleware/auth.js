const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token and authenticate user
const authenticateUser = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required. No token provided.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'User not found. Invalid token.' 
      });
    }

    // Attach user info to request
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.user = user;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired' 
      });
    }
    res.status(401).json({ 
      success: false,
      error: 'Authentication failed' 
    });
  }
};

// Middleware to verify admin role
const authenticateAdmin = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required. No token provided.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user exists and is admin
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'User not found. Invalid token.' 
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        error: 'Access denied. Admin privileges required.' 
      });
    }

    // Attach user info to request
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.user = user;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired' 
      });
    }
    res.status(401).json({ 
      success: false,
      error: 'Authentication failed' 
    });
  }
};

// Middleware to verify user is customer
const authenticateCustomer = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required. No token provided.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this-in-production');
    
    // Verify user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'User not found. Invalid token.' 
      });
    }

    if (user.role !== 'customer') {
      return res.status(403).json({ 
        success: false,
        error: 'Access denied. Customer access only.' 
      });
    }

    // Attach user info to request
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.user = user;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired' 
      });
    }
    res.status(401).json({ 
      success: false,
      error: 'Authentication failed' 
    });
  }
};

module.exports = { authenticateUser, authenticateAdmin, authenticateCustomer };
