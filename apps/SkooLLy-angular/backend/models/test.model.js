const mongoose = require("mongoose");

const studentAnswerSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  studentName: String,

  options: [
    {
      question_number: Number,
      student_option: String,
    }
  ]
}, { _id: false });


const questionSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: [{ type: String, required: true }],
  question_score: {
    type: Number,
    default: 10,
  },
  question_answer: {
    type: String,
    required: true,
  }
}, { _id: false });


const classSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  className: String,

  questions: [questionSchema],
  studentAnswers: [studentAnswerSchema],
});

const subjectSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  teacherName: String,

  subjectId: {
    type: mongoose.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  subjectName: String,
  subjectCode: String,

  classes: [classSchema],
});

const testSchema = new mongoose.Schema({
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

  isApproved: {
    type: Boolean,
    default: false,
  },

  subjects: [subjectSchema],

}, { timestamps: true });

module.exports = mongoose.model("Test", testSchema);
