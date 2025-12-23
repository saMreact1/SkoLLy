module.exports = (req, res, next) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) return res.status(401).json({ message: 'Tenant ID not found' });

  req.tenantId = tenantId;
  next();
};
