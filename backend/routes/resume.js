const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const axios = require('axios');
const fs = require('fs');
const mongoose = require('mongoose');
const Resume = require('../models/Resume');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// Configure multer
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

const receiveResume = (req, res, next) => {
  upload.single('file')(req, res, error => {
    if (!error) return next();
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ success: false, error: 'Resume files must be 10 MB or smaller' });
    }
    return res.status(400).json({ success: false, error: 'Unable to receive the uploaded file' });
  });
};

const removeTemporaryFile = async filePath => {
  if (!filePath) return;
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Failed to remove uploaded temporary file:', error);
    }
  }
};

// Upload and analyze resume
router.post('/upload', receiveResume, async (req, res) => {
  let responseStatus = 200;
  let responseBody;
  try {
    if (!req.file) {
      responseStatus = 400;
      responseBody = {
        success: false,
        error: 'No file uploaded'
      };
    } else {
      let text = '';

      if (req.file.mimetype === 'application/pdf') {
        const dataBuffer = await fs.promises.readFile(req.file.path);
        const pdfData = await pdfParse(dataBuffer);
        text = pdfData.text;
      } else if (
        req.file.mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const result = await mammoth.extractRawText({ path: req.file.path });
        text = result.value;
      } else {
        responseStatus = 400;
        responseBody = { success: false, error: 'Only PDF and DOCX files are supported' };
      }

      if (responseStatus === 200 && (!text || text.trim().length < 20)) {
        responseStatus = 400;
        responseBody = { success: false, error: 'Could not extract enough text from the resume' };
      }

      if (responseStatus === 200) {
        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
        const aiResponse = await axios.post(
          `${aiServiceUrl}/analyze`,
          { text },
          {
            timeout: 120000,
            headers: { 'Content-Type': 'application/json' }
          }
        );

        const resume = new Resume({
          userId: req.user.id,
          filename: req.file.originalname,
          text,
          analysis: aiResponse.data
        });

        await resume.save();
        responseBody = {
          success: true,
          message: 'Resume uploaded and analyzed successfully',
          data: resume
        };
      }
    }
  } catch (err) {
    console.error('Resume upload failed:', err);
    responseStatus = err.response ? 502 : 500;
    responseBody = {
      success: false,
      error: err.response ? 'The analysis service is unavailable' : 'Resume analysis failed'
    };
  } finally {
    await removeTemporaryFile(req.file?.path);
  }

  return res.status(responseStatus).json(responseBody);
});

// Get all resumes
router.get('/', async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).sort({ createdAt: -1, _id: -1 });

    return res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes
    });

  } catch (err) {
    console.error('Get resumes error:', err);

    return res.status(500).json({
      success: false,
      error: 'Failed to fetch resumes'
    });
  }
});

// Get single resume
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid resume ID' });
    }

    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });

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
    console.error('Get resume error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch resume'
    });
  }
});

module.exports = router;
