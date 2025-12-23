const Class = require('../models/class.model');
const School = require('../models/school.model');
const Teacher = require('../models/teacher.model');
const User = require("../models/user.model");
const Student = require("../models/student.model");
const mongoose = require("mongoose");

const jwt = require('jsonwebtoken');
require('dotenv').config();

// GET all classes for the logged-in user's tenant (school)
exports.getClasses = async (req, res) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ message: 'Missing tenant ID' });
    }

    const classes = await Class.find({ tenantId })
      .populate('assignedTeacher', 'fullName email')
      .populate('students', 'fullName email');

    res.json(classes);
  } catch (error) {
    console.error('❌ Error getting classes:', error);
    res.status(500).json({ message: 'Server error fetching classes' });
  }
};


// CREATE a new class
exports.createClass = async (req, res) => {
  try {
    const { name, assignedTeacher, students } = req.body;

    const schoolId = req.user?.schoolId || req.body.schoolId; // ← 👈 Get from JWT or fallback

    if (!schoolId || !assignedTeacher) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newClass = new Class({
      name,
      schoolId,
      assignedTeacher,
      students
    });

    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    console.error('❌ Error creating class:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCurrentUserClasses = async(req, res) => {
  const { id, tenantId } = req.user;

  try {
    const user = await User.findById(id);

      // Convert tenantId string to ObjectId for the query
    const userClass = await Class.findOne({
      schoolId: tenantId,
      _id: user.classId
    }).select('-students');

    return res.status(200).json(userClass)

  } catch (error) {
    console.log("Error occurred in get user current user controller", error.message)
    res.status(500).json({message: "Server error, could not complete this operation"});
  }
}
// GET classes by school name (for pre-registration lookup)
exports.getClassesByTenantId = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const classes = await Class.find({ schoolId: tenantId })
      .populate('assignedTeacher', 'fullName email')
      .populate('students', 'fullName email');

    const safeClasses = classes.map(c => ({
      ...c.toObject(),
      students: c.students || []
    }));

    res.status(200).json(safeClasses);
  } catch (err) {
    console.error('❌ Error fetching classes by tenant:', err);
    res.status(500).json({ message: 'Server error fetching classes.' });
  }
};

exports.getClassStudents = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);
    if (!classData) return res.status(404).json({ message: 'Class not found' });
    res.json(classData.students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Class not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const deleted = await Class.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Class not found' });
    res.json({ message: 'Class deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.assignTeacher = async (req, res) => {
  const { teacherId } = req.body;
  const { classId } = req.params;

  if (!teacherId) {
    return res.status(400).json({ message: 'Teacher ID is required' });
  }

  try {
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { assignedTeacher: teacherId },
      { new: true }
    );
    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(updatedClass);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
