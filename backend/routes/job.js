const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const Job = require('../models/Job');
const Resume = require('../models/Resume');

const router = express.Router();


// ✅ Create job
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const job = new Job({
      userId: new mongoose.Types.ObjectId(), // ✅ FIX
      title,
      description
    });

    await job.save();

    res.json(job);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ Get jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find(); // ✅ remove user filter
    res.json(jobs);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Match resume with job
router.post('/match', async (req, res) => {
  try {
    const { resumeId, jobId } = req.body;

    const resume = await Resume.findById(resumeId);
    const job = await Job.findById(jobId);

    if (!resume || !job) {
      return res.status(404).json({ error: "Resume or Job not found" });
    }

    const aiResponse = await axios.post('http://localhost:8000/match', {
      resumeText: resume.text,
      jobText: job.description
    });

    res.json(aiResponse.data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;