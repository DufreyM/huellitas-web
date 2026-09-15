const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const UPLOADS_DIR = path.join(__dirname, "../../../uploads");
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const uniqueName = crypto.randomBytes(16).toString("hex");
        cb(null, `${uniqueName}${path.extname(file.originalname)}`);
    }
});

function fileFilter(req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(new Error("Solo se permiten imágenes JPEG, PNG, WEBP o GIF"));
    }

    cb(null, true);
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = { upload, UPLOADS_DIR };
