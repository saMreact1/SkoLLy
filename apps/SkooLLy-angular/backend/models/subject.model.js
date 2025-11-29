const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nameLower: { type: String, required: true, lowercase: true, trim: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
    },
    code: { type: String, trim: true },
    level: { type: String, trim: true },
    compulsory: { type: Boolean, default: true }
  },
  { timestamps: true }
);

SubjectSchema.index({ tenantId: 1, nameLower: 1 }, { unique: true });

SubjectSchema.pre('validate', function (next) {
  if (this.name && !this.nameLower) {
    this.nameLower = this.name.toLowerCase().trim();
  }
  next();
});



module.exports = mongoose.model('Subject', SubjectSchema);