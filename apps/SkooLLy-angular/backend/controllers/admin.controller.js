const Student = require('../models/student.model');
const Teacher = require('../models/teacher.model');
const Class = require('../models/class.model');
const Attendance = require('../models/attendance.model');
const moment = require('moment');

exports.getOverview = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const [students, teachers, attendanceToday] = await Promise.all([
      Student.countDocuments({ tenantId }),
      Teacher.countDocuments({ tenantId }),
      Attendance.countDocuments({
        tenantId,
        date: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lt: new Date().setHours(23, 59, 59, 999),
        },
      }),
    ]);

    res.json({
      totalStudents: students,
      totalTeachers: teachers,
      attendanceToday,
    });
  } catch (err) {
    res.status(500).json({ error: 'Dashboard stats failed to load' });
  }
};

exports.getStudentsByClass = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    // Populate the classId field to get class name
    const students = await Student.find({ tenantId }).populate('classId');

    const grouped = students.reduce((acc, student) => {
      const className = student.classId?.name || 'Unassigned';
      acc[className] = (acc[className] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(grouped);
    const data = Object.values(grouped);

    res.json({ labels, data });
  } catch (error) {
    console.error('Error in getStudentsByClass:', error);
    res.status(500).json({ error: 'Failed to fetch students by class' });
  }
};

exports.getGenderDistribution = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const male = await Student.countDocuments({
      tenantId,
      gender: { $regex: /^male$/i },
    });

    const female = await Student.countDocuments({
      tenantId,
      gender: { $regex: /^female$/i },
    });

    res.json({
      labels: ['Male', 'Female'],
      data: [male, female],
    });
  } catch (error) {
    console.error('Error in getGenderDistribution:', error);
    res.status(500).json({ error: 'Failed to fetch gender distribution' });
  }
};


exports.getWeeklyAttendance = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);

    const records = await Attendance.find({
      tenantId,
      date: { $gte: weekAgo, $lte: today }
    });

    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const attendanceMap = {};

    for (let i = 0; i < 7; i++) {
      const day = new Date(weekAgo);
      day.setDate(day.getDate() + i);
      const label = days[day.getDay()];
      attendanceMap[label] = 0;
    }

    records.forEach(record => {
      const day = days[new Date(record.date).getDay()];
      attendanceMap[day] = (attendanceMap[day] || 0) + 1;
    });

    res.json({
      labels: Object.keys(attendanceMap),
      data: Object.values(attendanceMap)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weekly attendance' });
  }
};
