const ProfilePhoto = require("../models/ProfilePhoto");

exports.UploadPhoto=async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const newPhoto = new ProfilePhoto({
            photo: req.file.buffer,
            photoType: req.file.mimetype
        });

        await newPhoto.save();

        res.status(201).json({
            success: true,
            message: "Photo uploaded successfully",
            id: newPhoto._id
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.GetPhoto= async (req, res) => {
    try {

        const photo = await ProfilePhoto.findById(req.params.id);

        if (!photo) {
            return res.status(404).json({ message: "Photo not found" });
        }

        res.set("Content-Type", photo.photoType);
        res.send(photo.photo);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.DeletePhoto= async (req, res) => {
    try {

        await ProfilePhoto.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Photo deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
