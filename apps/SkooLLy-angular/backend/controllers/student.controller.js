const Student = require('../models/student.model');
const User = require('../models/user.model');
const Class = require('../models/class.model');
const mongoose = require('mongoose');

exports.getAllStudents = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const students = await Student.find({ tenantId }).populate('classId', 'name');
    res.status(200).json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.createStudent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const admin = await User.findById(req.user.id).populate('tenantId').session(session);
    const schoolName = admin.tenantId.name;

    const student = new Student({
      ...req.body,
      role: 'student',
      tenantId: admin.tenantId._id,
      schoolName
    });

    await student.save({ session });

    if (!req.body.classId) {
      throw new Error('Class ID is required');
    }

    const updatedClass = await Class.findByIdAndUpdate(
      req.body.classId,
      { $push: { students: student._id } },
      { new: true, session }
    );

    if (!updatedClass) {
      throw new Error('Class not found');
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(student);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};