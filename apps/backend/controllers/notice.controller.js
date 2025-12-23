const Notice = require('../models/notice.model');

exports.getNotices = async (req, res) => {
    try {
        const notices = await Notice.find({ tenantId: req.user.tenantId }).sort({ date: -1 });
        res.json(notices);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}

exports.createNotices = async (req, res) => {
    const { title, content } = req.body;
    try {
        const newNotice = new Notice({
            title,
            content,
            tenantId: req.user.tenantId,
            createdBy: req.user.name || 'Admin',
        });
        const saved = await newNotice.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}

exports.deleteNotices = async (req, res) => {
    try {
        const deleted = await Notice.findOneAndDelete({
            _id: req.params.id,
            tenantId: req.user.tenantId
        });

        if (!deleted) return res.status(404).json({ message: 'Notice not found' });
        res.json({ message: 'Notice deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}

exports.updateNotices = async (req, res) => {
    try {
    const updated = await Notice.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Notice not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update notice' });
  }
}