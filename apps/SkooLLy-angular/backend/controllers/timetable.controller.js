const Timetable = require('../models/timetable.model');

exports.saveTimetable = async (req, res) => {
  try {
    const { classId, grid } = req.body;
    if (!classId || !grid) {
      return res.status(400).json({ message: 'classId and grid are required' });
    }

    const updated = await Timetable.findOneAndUpdate(
      { classId },
      { $set: { grid } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.json({ message: 'Timetable saved', data: updated });
  } catch (err) {
    console.error('saveTimetable error:', err);
    return res.status(500).json({ message: 'Server error saving timetable' });
  }
};

exports.getTimetable = async (req, res) => {
  try {
    const { classId } = req.params;
    const doc = await Timetable.findOne({ classId });
    return res.json({ data: doc ? doc.grid : {} });
  } catch (err) {
    console.error('getTimetable error:', err);
    return res.status(500).json({ message: 'Server error fetching timetable' });
  }
};

exports.addRow = async (req, res) => {
  try {
    const { classId, time } = req.body;

    if (!classId || !time) {
      return res.status(400).json({ message: "classId and time are required" });
    }

    // Update timetable for all days with empty slots for the new time
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]; // match your frontend days
    const updates = {};
    days.forEach(day => {
      updates[`${day}_${time}`] = [];
    });

    const timetable = await Timetable.findOneAndUpdate(
      { classId },
      { $set: updates },
      { new: true, upsert: true }
    );

    res.json({ success: true, timetable });
  } catch (err) {
    console.error("Error adding row:", err);
    res.status(500).json({ message: "Server error" });
  }
}
