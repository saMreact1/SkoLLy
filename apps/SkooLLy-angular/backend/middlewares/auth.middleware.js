const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Include tenantId if it's in the token
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            tenantId: decoded.tenantId, // 👈 DON'T forget this!
        };

        next();
    } catch (err) {
        console.error('JWT error:', err);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

