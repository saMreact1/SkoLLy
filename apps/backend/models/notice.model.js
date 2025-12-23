const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },
  tenantId: { type: String, required: true }
});


module.exports = mongoose.model('Notice', noticeSchema);
