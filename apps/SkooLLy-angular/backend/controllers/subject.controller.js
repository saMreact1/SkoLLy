const Subject = require('../models/subject.model');
const mongoose = require('mongoose');


exports.getSubject = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const subjects = await Subject.find({ tenantId })
      .populate('teacher', 'fullName email');
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSubject = async (req, res) => {
  try {
    const subject = new Subject({
      name: req.body.name,
      code: req.body.code,
      tenantId: req.user.tenantId,
      teacher: req.body.teacher || null
    });

    await subject.save();
    
    res.status(201).json(subject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const updated = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('teacher', 'fullName email');
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}