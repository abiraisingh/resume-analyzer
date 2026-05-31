const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const axios = require('axios');
const fs = require('fs');
const mongoose = require('mongoose');
const Resume = require('../models/Resume');

const router = express.Router();

// Configure multer
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Upload and analyze resume
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    let text = '';

    // PDF Processing
    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
    }

    // DOCX Processing
    else if (
      req.file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({
        path: req.file.path
      });

      text = result.value;
    }

    else {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        success: false,
        error: 'Only PDF and DOCX files are supported'
      });
    }

    if (!text || text.trim().length < 20) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        success: false,
        error: 'Could not extract enough text from the resume'
      });
    }

    const aiServiceUrl =
      process.env.AI_SERVICE_URL ||
      'https://resume-analyzer-2-jusn.onrender.com';

    console.log('================================');
    console.log('AI Service URL:', aiServiceUrl);
    console.log('Resume Text Length:', text.length);
    console.log('Calling:', `${aiServiceUrl}/analyze`);
    console.log('================================');

    const aiResponse = await axios.post(
      `${aiServiceUrl}/analyze`,
      { text },
      {
        timeout: 120000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const analysis = aiResponse.data;

    const resume = new Resume({
      userId: new mongoose.Types.ObjectId(),
      filename: req.file.originalname,
      text,
      analysis
    });

    await resume.save();

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(200).json({
      success: true,
      message: 'Resume uploaded and analyzed successfully',
      data: resume
    });

  } catch (err) {

    console.error('========== UPLOAD ERROR ==========');
    console.error('Message:', err.message);

    if (err.code) {
      console.error('Code:', err.code);
    }

    if (err.config) {
      console.error('Request URL:', err.config.url);
    }

    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Response Data:', err.response.data);
    }

    console.error(err.stack);
    console.error('==================================');

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      error:
        err.response?.data?.detail ||
        err.response?.data?.error ||
        err.message ||
        'Resume analysis failed'
    });
  }
});

// Get all resumes
router.get('/', async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes
    });

  } catch (err) {
    console.error('Get resumes error:', err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Get single resume
router.get('/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: resume
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;
