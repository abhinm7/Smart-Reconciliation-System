const multer = require('multer');
const path = require('path');
const fs = require('fs');

// create the upload directory only if not exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads/');
}

// specify file name and path to be saved
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
});

// filter file only with allowed formats
const fileFilter = (req, file, cb) => {
    if (file.mimetype.includes('csv') || file.mimetype.includes('sheet') || file.mimetype.includes('excel')) {
        cb(null, true);
    } else {
        cb(new Error('Only .csv, .xlsx files are allowed'), false);
    }
};

// configure multer with file size limit
module.exports = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });