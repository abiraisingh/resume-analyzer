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
const upload = multer({ dest: 'uploads/' });


// 🚀 Upload and analyze resume (AUTH REMOVED)
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // ❗ Check file exists
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let text = '';

    // 📄 Handle PDF
    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(req.file.path);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    }

    // 📄 Handle DOCX
    else if (
      req.file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ path: req.file.path });
      text = result.value;
    }

    else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // 🤖 Call AI service
    const aiResponse = await axios.post(
      'http://localhost:8000/analyze',
      { text }
    );

    const analysis = aiResponse.data;

    // 💾 Save to DB (temporary user)
    const resume = new Resume({
      userId: new mongoose.Types.ObjectId(),
      filename: req.file.originalname,
      text,
      analysis
    });

    await resume.save();

    // 🧹 Cleanup uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      message: "Resume uploaded and analyzed successfully",
      data: resume
    });

  } catch (err) {
    console.error("Upload error:", err.message);

    res.status(500).json({
      error: err.message || "Server error"
    });
  }
});


// 📄 Get all resumes (AUTH REMOVED)
router.get('/', async (req, res) => {
  try {
    const resumes = await Resume.find();

    res.json(resumes);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;