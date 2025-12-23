const School = require('../models/school.model');

exports.createSchool = async (req, res) => {
  try {
    const { name, address, schoolEmail, schoolPhone, logo } = req.body;

    const school = new School({
      name,
      address,
      schoolEmail,
      schoolPhone,
      logo,
      createdBy: req.user.id,
      tenantId: req.user.tenantId
    });

    await school.save();
    res.status(201).json({ message: 'School created successfully', school });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /school/profile
exports.getSchoolProfile = async (req, res) => {
  try {
    const tenantId = req.user.tenantId; // pulled from decoded JWT

    const school = await School.findById(tenantId);

    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    res.json({
      name: school.name,
      logo: school.logo,
      email: school.schoolEmail,
      phone: school.schoolPhone,
      address: school.address,
      state: school.state
    });
  } catch (err) {
    console.error('School profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// GET /schools/name/:name
exports.getSchoolByName = async (req, res) => {
  const { name } = req.params;
  const school = await School.findOne({ name });
  if (!school) return res.status(404).json({ message: 'School not found' });
  res.status(200).json(school);
};
