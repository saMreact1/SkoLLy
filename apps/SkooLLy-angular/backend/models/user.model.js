const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullName: { type: String },
  phone: { type: String },
  gender: { type: String },
  bio: { type: String },
  role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  password: { type: String, required: true },
  profilePic: String,
  resetToken: String,
  resetTokenExpiry: Date,
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);