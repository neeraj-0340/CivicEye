import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    let resource_type = 'auto'; // Auto-detect for images/videos
    
    // Check if it's a video file specifically
    const extname = path.extname(file.originalname).toLowerCase();
    if (['.mp4', '.mov', '.avi', '.wmv'].includes(extname)) {
      resource_type = 'video';
    } else if (['.jpeg', '.jpg', '.png', '.gif'].includes(extname)) {
      resource_type = 'image';
    }
    
    return {
      folder: 'civiceye/complaints',
      public_id: file.fieldname + '-' + uniqueSuffix,
      resource_type: resource_type,
    };
  },
});

// File filter to accept only images and videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|wmv/;
  // Check ext
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed!'));
  }
};

// Initialize multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: fileFilter
});

export default upload;