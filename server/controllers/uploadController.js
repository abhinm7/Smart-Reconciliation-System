const Upload = require('../models/Upload');
const { fileQueue } = require('../worker/queue');

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // save it to db
        const job = await Upload.create({
            fileName: req.file.filename,
            filePath: req.file.path,
            uploadedBy: req.user._id,
            type: req.body.type || 'RECONCILIATION',
            status: 'pending'
        });

        // assign job asynchronously
        await fileQueue.add('process-file', {
            jobId: job._id,
            filePath: req.file.path,
            type: job.type
        });

        // log audit for creation
        await logAudit({
            req,
            action: 'UPLOAD_FILE',
            collection: 'UploadJob',
            docId: job._id,
            oldValue: null,
            newValue: job.toObject()
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

const getJobs = async (req, res) => {
    try {
        const jobs = await Upload.find({ uploadedBy: req.user._id })
            .sort({ createdAt: -1 });
        
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { uploadFile, getJobs };