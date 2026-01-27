const jwt = require('jsonwebtoken');
const User = require('../models/User');

// token verification
const verifyToken = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            next();
        }
        catch (error) {
            res.status(401).json({
                message: 'Not authorized, invalid token'
            })
        }
    } else {
        res.status(401).json({
            message: 'not authorized, token not found'
        })
    }
};

// role checking
const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `'${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    }
};

module.exports = { verifyToken, authorizeRole };

