const multer = require('multer');
const path = require('path')
const multerStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/images'); // Directory where files will be stored
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + path.extname(file.originalname)); // Rename file to avoid duplicates
    }
});

// Initialize multer upload with the defined storage configuration
const upload = multer({ storage: multerStorage })
module.exports = upload
