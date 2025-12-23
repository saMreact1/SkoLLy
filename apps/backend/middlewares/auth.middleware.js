const jwt = require('jsonwebtoken');
const Session = require('../models/session.model');
require('dotenv').config();


exports.authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // getting current session id
        const currentSession = await Session.findOne({
            schoolId: decoded?.tenantId,
            isActive: true
        })

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            tenantId: decoded.tenantId,
            sessionId: currentSession ? currentSession._id : null
        };
        next();
    } catch (err) {
        console.error('JWT error:', err);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

