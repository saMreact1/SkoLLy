const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const User = require('../models/user.model');
const Student = require('../models/student.model');
const Teacher = require('../models/teacher.model');
const Class = require('../models/class.model');
const nodemailer = require('nodemailer');
const School = require('../models/school.model');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/token');
const generateDefaultClasses = require('../utils/generateClasses')
const { generateDefaultSubjects } = require('../utils/generateSubjects');
const Subject = require('../models/subject.model');


exports.register = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction(); // ✅ Only start ONCE

    const {
      email,
      schoolName,
      schoolExists: rawSchoolExists,
      schoolInfo: rawSchoolInfo,
      personalInfo: rawPersonalInfo
    } = req.body;

    const schoolExists = JSON.parse(rawSchoolExists);
    const schoolInfo = rawSchoolInfo ? JSON.parse(rawSchoolInfo) : null;
    const personalInfo = JSON.parse(rawPersonalInfo);

    console.log("REQ.BODY:", req.body);

    // ✅ Normalize school name
    const normalizedSchoolName = schoolName.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Email already exists' });
    }

    let school;

    if (!schoolExists) {
      const existingSchool = await School.findOne({ name: normalizedSchoolName }).session(session);

      if (existingSchool) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'School already exists' });
      }

      const logoFilename = req.file ? req.file.filename : null;

      school = await School.create([{
        name: normalizedSchoolName,
        email: schoolInfo.schoolEmail,
        phone: schoolInfo.schoolPhone,
        address: schoolInfo.address,
        schoolType: schoolInfo.schoolType,
        logo: logoFilename,
        state: schoolInfo.state
      }], { session });

      school = school[0]; // create() returns an array with a session

      await generateDefaultClasses(schoolInfo.schoolType, school._id, session);

      await generateDefaultSubjects(schoolInfo.schoolType, school._id, session);

    } else {
      school = await School.findOne({ name: normalizedSchoolName }).session(session);
      if (!school) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: 'School not found' });
      }

      // (Optional) Backfill subjects if the school has none yet
      // This protects old tenants that existed before you added this feature.
      const subjectCount = await Subject.countDocuments({ tenantId: school._id }).session(session);
      if (subjectCount === 0 && schoolInfo?.schoolType) {
        await generateDefaultSubjects(schoolInfo.schoolType, school._id, session);
      }
    }

    if (personalInfo.classId === '') {
      delete personalInfo.classId;
    }

    personalInfo.email = email;

    const hashedPassword = await bcrypt.hash(personalInfo.password, 10);

    const user = new User({
      ...personalInfo,
      password: hashedPassword,
      tenantId: school._id
    });

    await user.save({ session });

    if (user.role === 'student') {
      const student = new Student({
        ...personalInfo,
        classId: personalInfo.classId,
        tenantId: school._id,
        schoolName: school.name
      });

      await student.save({ session });

      await Class.updateOne(
        { _id: personalInfo.classId },
        { $push: { students: `${personalInfo.firstName} ${personalInfo.lastName}` } },
        { session }
      );
    } else if (user.role === 'teacher') {
      const teacher = new Teacher({
        ...personalInfo,
        subject: personalInfo.subject || '',
        tenantId: school._id,
        schoolName: school.name
      });
      
      await teacher.save({ session });
    }

    await session.commitTransaction(); // ✅ Success
    session.endSession();

    return res.status(201).json({ message: 'Registration successful' });

  } catch (err) {
    try {
      await session.abortTransaction(); // ✅ Only if it was started
    } catch (abortErr) {
      console.warn('Tried to abort a transaction that was never started.');
    }
    session.endSession();
    console.error('REGISTRATION FAILED:', err);
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = generateToken(user);

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};


exports.checkSchoolAndEmail = async (req, res) => {
  const { email, school } = req.body;

  if (!school) {
    return res.status(400).json({ success: false, message: 'schoolName is required' });
  }

  try {
    const emailExists = await User.exists({ email });

    // 🔧 Fetch the actual school document
    const existingSchool = await School.findOne({ name: school });

    if (existingSchool) {
      return res.status(200).json({
        emailExists,
        schoolExists: true,
        school: {
          _id: existingSchool._id,
          name: existingSchool.name,
          tenantId: existingSchool._id // or use ._id directly as tenantId
        }
      });
    } else {
      return res.status(200).json({
        emailExists,
        schoolExists: false,
        school: null
      });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Check failed', error: err.message });
  }
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    const resetLink = `http://localhost:4200/reset-password/${token}`;

    // Set up your transporter (update with real credentials or use ethereal)
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // e.g. samueladeleke@gmail.com
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"SkooLLy" <no-reply@skoolly.com>`,
      to: email,
      subject: 'Reset Your Password - SkooLLy',
      html: `
        <h2>Forgot your password?</h2>
        <p>Click the link below to reset it:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you didn’t request this, ignore this email.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};