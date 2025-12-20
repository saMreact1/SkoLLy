const mongoose = require("mongoose");

const termSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ["FIRST", "SECOND", "THIRD"],
        required: true,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true,
    }, 
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true })

module.exports = mongoose.model("Term", termSchema);