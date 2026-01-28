const Upload = require('../models/Upload');

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // save it to db
        const job = await Upload.create({
            fileName: req.fileName,
            filePath: req.filePath,
            uploadedBy: req.user._id,
            type: req.body.type || 'RECONCILIATION',
            status: 'pending'
        });

        res.status(201).json({
            message: 'File uploaded succesfully',
            jobId: job._id
        });

    } catch (error) {
        console.log("file upload error", error);
        res.status(500).json({
            message: 'Server error during uplaod'
        });
    }
}

module.exports = { uploadFile };