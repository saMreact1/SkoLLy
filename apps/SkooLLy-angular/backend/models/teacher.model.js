const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  phone: String,
  gender: String,
  bio: String,
  address: String,
  dob: Date,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  role: {
    type: String,
    default: 'teacher',
  },
  subject: {
    type: String,
    default: ''
  },
  subjectId: {
    type: mongoose.Types.ObjectId,
    ref: 'Subject',
  },
  classes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class"
    }
  ],
  password: {
    type: String,
    required: true,
  },
  schoolName: {
    type: String,
    required: true,
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Teacher', teacherSchema);
