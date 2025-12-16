const mongoose = require("mongoose");

const termSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ["FIRST", "SECOND", "THIRD"],
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true,
    }   
}, { timestamps: true })

module.exports = mongoose.model("Term", termSchema);