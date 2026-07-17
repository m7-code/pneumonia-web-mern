import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import { protect } from '../middleware/protect.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

function getFormDataHeaders(formData) {
  return new Promise((resolve, reject) => {
    formData.getLength((err, length) => {
      if (err) return reject(err);
      resolve({
        ...formData.getHeaders(),
        'Content-Length': length,
      });
    });
  });
}

// Har baar naya FormData banane wala helper - ek hi instance dobara use nahi hota
function buildFormData(file) {
  const formData = new FormData();
  formData.append('file', file.buffer, {
    filename: file.originalname,
    contentType: file.mimetype,
  });
  return formData;
}

async function callFastApi(file) {
  const primaryUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
  const fallbackUrl = process.env.FASTAPI_URL_FALLBACK;

  try {
    const primaryFormData = buildFormData(file); // naya instance
    const headers = await getFormDataHeaders(primaryFormData);
    const response = await axios.post(`${primaryUrl}/predict`, primaryFormData, {
      headers,
      timeout: 8000,
    });
    return response.data;
  } catch (primaryErr) {
    console.error('Primary (local) failed:', primaryErr.message);

    if (fallbackUrl) {
      try {
        const fallbackFormData = buildFormData(file); // dobara NAYA instance
        const headers = await getFormDataHeaders(fallbackFormData);
        const response = await axios.post(`${fallbackUrl}/predict`, fallbackFormData, {
          headers,
          timeout: 60000,
        });
        return response.data;
      } catch (fallbackErr) {
        console.error('Fallback (Hugging Face) failed:', fallbackErr.message);
        throw fallbackErr;
      }
    }
    throw primaryErr;
  }
}

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

    const data = await callFastApi(req.file);

    res.json({ success: true, data });
  } catch (err) {
    console.error('Analyze route error:', err.message);

    if (err.code === 'ECONNREFUSED' || err.code === 'ECONNABORTED') {
      return res.status(500).json({
        success: false,
        message: 'Could not reach the analysis server (local or hosted). Please try again shortly.',
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