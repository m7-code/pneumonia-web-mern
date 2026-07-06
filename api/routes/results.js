import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import { protect } from '../middleware/protect.js';

const router = express.Router();

// Memory storage - file disk pe save nahi hoti, seedha FastAPI ko forward hoti hai
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB - Laravel wali limit jaisa
});

router.post('/analyze', protect, upload.single('xray_image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(422).json({ success: false, message: 'X-ray image is required.' });
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(422).json({
        success: false,
        message: 'Only JPEG, JPG and PNG images are supported.',
      });
    }

    const fastApiUrl = process.env.FASTAPI_URL || 'http://localhost:8000';

    // FastAPI ko multipart form-data ke roop me forward karna
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(`${fastApiUrl}/predict`, formData, {
      headers: formData.getHeaders(),
      timeout: 120000, // 2 minute - Laravel wali timeout jaisa
    });

    res.json({ success: true, data: response.data });
  } catch (err) {
    if (err.code === 'ECONNREFUSED' || err.code === 'ECONNABORTED') {
      return res.status(500).json({
        success: false,
        message: 'Could not reach the analysis server. Make sure the FastAPI service is running.',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Something went wrong while analyzing the image.',
      error: err.message,
    });
  }
});

export default router;