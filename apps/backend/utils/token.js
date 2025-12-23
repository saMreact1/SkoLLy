const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      tenantId: user.tenantId
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};
