const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);


// ✅ Create job
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body || {};

    if (
      typeof title !== 'string' ||
      typeof description !== 'string' ||
      !title.trim() ||
      !description.trim()
    ) {
      return res.status(400).json({ error: "Missing fields" });
    }
    if (title.length > 120 || description.length > 20000) {
      return res.status(400).json({ error: 'Job title or description is too long' });
    }

    const job = new Job({
      userId: req.user.id,
      title: title.trim(),
      description: description.trim()
    });

    await job.save();

    return res.status(201).json(job);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create job' });
  }
});


// ✅ Get jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json(jobs);

  } catch (err) {
    console.error('Get jobs error:', err);
    return res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});


// ✅ Match resume with job
router.post('/match', async (req, res) => {
  try {
    const { resumeId, jobId } = req.body || {};

    if (!mongoose.isValidObjectId(resumeId) || !mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({ error: 'Valid resume and job IDs are required' });
    }

    const [resume, job] = await Promise.all([
      Resume.findOne({ _id: resumeId, userId: req.user.id }),
      Job.findOne({ _id: jobId, userId: req.user.id })
    ]);

    if (!resume || !job) {
      return res.status(404).json({ error: "Resume or Job not found" });
    }

    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    const aiResponse = await axios.post(`${aiServiceUrl}/match`, {
      resumeText: resume.text,
      jobText: job.description
    });

    return res.json(aiResponse.data);

  } catch (err) {
    console.error('Job match failed:', err);
    return res.status(err.response ? 502 : 500).json({
      error: err.response ? 'The analysis service is unavailable' : 'Failed to match resume'
    });
  }
});


module.exports = router;