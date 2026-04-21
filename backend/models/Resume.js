const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  text: { type: String, required: true },
  analysis: {
    skills: [String],
    education: String,
    experience: String,
    projects: [String],
    atsScore: Number,
    missingKeywords: [String],
    recommendations: [String]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);