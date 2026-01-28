import multer from 'multer';
import os from 'os'; // ✅ Vercel ke liye zaroori hai
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // ✅ NEW: System ka temporary folder use karein (Jo Vercel allow karta hai)
    cb(null, os.tmpdir());
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // ✅ File extension (.jpg, .png) bhi add kar diya taaki Cloudinary ko samajh aaye
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

export default upload;