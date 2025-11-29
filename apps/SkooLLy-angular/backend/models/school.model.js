const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  email: { type: String },
  name: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String },
  address: { type: String },
  schoolType: [{ type: String, enum: ['nursery', 'primary', 'secondary', 'college'] }],
  logo: { type: String },
  state: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('School', schoolSchema);
