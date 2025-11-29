const Teacher = require('../models/teacher.model');

exports.getAllTeachers = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const teachers = await Teacher.find({ tenantId });
    res.status(200).json(teachers);
  } catch (err) {
    console.error('Error fetching teachers:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
