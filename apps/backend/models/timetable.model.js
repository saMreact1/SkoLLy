const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema(
  {
    id: String,           // subject id (optional)
    subjectName: String,  // e.g. "Math"
    color: String         // e.g. "#fdcb6e"
  },
  { _id: false }
);

const TimetableSchema = new mongoose.Schema(
  {
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true, unique: true },
    // grid example: { "Mon-8-9am": [Slot], "Mon-9-10am": [] }
    grid: { type: Map, of: [SlotSchema], default: {} }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Timetable', TimetableSchema);
