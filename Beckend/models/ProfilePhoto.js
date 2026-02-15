const mongoose = require("mongoose");

const profilePhotoSchema = new mongoose.Schema({

    photo: {
        type: Buffer,
        required: true
    },

    photoType: {
        type: String,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("ProfilePhoto", profilePhotoSchema);
