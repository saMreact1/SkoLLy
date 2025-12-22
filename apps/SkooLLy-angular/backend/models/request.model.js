const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    sessionName: String,
    sessionId: {
      type: mongoose.Types.ObjectId,
      ref: "Session",
    },
    schoolName: String,
    schoolId: {
      type: mongoose.Types.ObjectId,
      ref: "School",
    },
    term: String,
    termId: {
      type: mongoose.Types.ObjectId,
      ref: "Term",
    },
    result: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Result",
      },
    ],
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
