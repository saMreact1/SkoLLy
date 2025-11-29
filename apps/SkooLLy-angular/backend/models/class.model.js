const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  assignedTeacher: { type: String },
  students: [{ type: String }],
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true }
});


module.exports = mongoose.model('Class', classSchema);