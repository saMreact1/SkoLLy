const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Types.ObjectId,
      ref: "School",
      required: true,
    },
    schoolName: String,
    sessionId: {
      type: mongoose.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    sessionName: String,
    termId: {
      type: mongoose.Types.ObjectId,
      ref: "Term",
      required: true,
    },
    termName: String,
    termId: { type: mongoose.Types.ObjectId, ref: "Term" },
    allTest: [
      {
        subject: String,
        className: String,
        teacherName: String,
        subjectCode: String,
        subjectId: { type: mongoose.Types.ObjectId, ref: "Subject" },
        teacherId: { type: mongoose.Types.ObjectId, ref: "Teacher" },
        classId: { type: mongoose.Types.ObjectId, ref: "Class" },
        subjectTest: [
          {
            number: Number,
            question: String,
            options: [{type: String}],
            question_answer: String,
            question_score: Number,
            _id: false
          }
        ],
        isApproved: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Test", testSchema);
