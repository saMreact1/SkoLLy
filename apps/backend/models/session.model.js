const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    schoolName: {
        type: String,
        required: true,
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School"
    },
    sessionName: {
        type: String,
        required: true
    },
    startYear: {
        type: Number,
        required: true,
        match: /^\d{4}$/,
    },
    endYear: {
        type: Number,
        required: true,
        match: /^\d{4}$/,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    terms: [
             {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Term"
            }
    ]
}, { timestamps: true });


module.exports = mongoose.model('Session', sessionSchema);
