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
    termName: String,
    termId: {
      type: mongoose.Types.ObjectId,
      ref: "Term",
    },
    testRequest: [{ type: mongoose.Types.ObjectId, ref: "Test" }],

    resultRequest: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Result",
      },
    ],
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
