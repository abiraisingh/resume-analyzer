import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

const JobMatch = () => {
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [match, setMatch] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const resumeRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/resume`, { });
        const jobRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/job`, { });
        setResumes(resumeRes.data);
        setJobs(jobRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, [navigate]);

  const handleCreateJob = async () => {
    if (!jobTitle || !jobDesc) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/job`, { title: jobTitle, description: jobDesc });
      setJobs([...jobs, res.data]);
      setJobTitle('');
      setJobDesc('');
      setShowForm(false);
      alert('Job description created!');
    } catch (err) {
      alert('Failed to create job');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMatch = async () => {
    if (!selectedResume || !selectedJob) {
      alert('Please select both a resume and job');
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/job/match`, { resumeId: selectedResume, jobId: selectedJob });
      setMatch(res.data);
    } catch (err) {
      alert('Failed to match resume');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navigation />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-10 animate-slideUp">
            <h1 className="section-title text-4xl mb-3">Match Resume with Job</h1>
            <p className="text-lg text-gray-600">Find out how well your resume matches job descriptions and get insights on missing skills.</p>
          </div>

          {/* Selection Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Job Creation/Selection */}
            <div className="card p-8 animate-slideUp">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Job Description</h2>
                  <p className="text-sm text-gray-600 mt-1">Select or create a job to match against</p>
                </div>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="btn-secondary px-4 py-2 text-sm"
                >
                  {showForm ? 'Cancel' : '+ New Job'}
                </button>
              </div>

              {showForm ? (
                <div className="space-y-4">
                  <div>
                    <label className="label-text">Job Title</label>
                    <input
                      type="text"
                      placeholder="e.g., Senior Full Stack Developer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label-text">Job Description</label>
                    <textarea
                      placeholder="Paste the full job description here..."
                      value={jobDesc}
                      onChange={(e) => setJobDesc(e.target.value)}
                      className="input-field h-40 resize-none"
                    />
                  </div>
                  <button
                    onClick={handleCreateJob}
                    disabled={isLoading || !jobTitle || !jobDesc}
                    className="btn-primary w-full"
                  >
                    {isLoading ? 'Creating...' : 'Create Job Description'}
                  </button>
                </div>
              ) : (
                <div>
                  <label className="label-text">Select Job</label>
                  <select
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                    className="input-field"
                  >
                    <option value="">-- Choose a job --</option>
                    {jobs.map((j) => (
                      <option key={j._id} value={j._id}>
                        {j.title}
                      </option>
                    ))}
                  </select>
                  {jobs.length === 0 && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700">No job descriptions yet. Create one to get started!</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Resume Selection */}
            <div className="card p-8 animate-slideUp" style={{ animationDelay: '100ms' }}>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Resume</h2>
              <p className="text-sm text-gray-600 mb-6">Select the resume to match</p>

              <label className="label-text">Select Resume</label>
              <select
                value={selectedResume}
                onChange={(e) => setSelectedResume(e.target.value)}
                className="input-field"
              >
                <option value="">-- Choose a resume --</option>
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.filename}
                  </option>
                ))}
              </select>
              {resumes.length === 0 && (
                <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-700">
                    No resumes uploaded yet.{' '}
                    <a href="/upload" className="font-semibold underline hover:no-underline">
                      Upload one first
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Match Button */}
          <div className="text-center mb-8 animate-slideUp" style={{ animationDelay: '200ms' }}>
            <button
              onClick={handleMatch}
              disabled={isLoading || !selectedResume || !selectedJob}
              className="btn-primary px-12 py-3 text-lg font-bold inline-block disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Finding matches...
                </span>
              ) : 'Analyze Match'}
            </button>
          </div>

          {/* Match Results */}
          {match && (
            <div className="card p-10 animate-slideUp" style={{ animationDelay: '300ms' }}>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Match Analysis Results</h2>

              {/* Match Score Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Main Score */}
                <div className="col-span-1 md:col-span-1 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-8 border border-primary-200">
                  <p className="text-sm text-gray-600 font-medium mb-2">Match Score</p>
                  <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text mb-4">
                    {match.matchPercentage?.toFixed(1)}%
                  </div>
                  <div className="progress-bar mb-3">
                    <div
                      className={`${
                        match.matchPercentage > 80
                          ? 'bg-gradient-to-r from-green-500 to-green-600'
                          : match.matchPercentage > 60
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                          : match.matchPercentage > 40
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                          : 'bg-gradient-to-r from-red-500 to-red-600'
                      } progress-fill`}
                      style={{ width: `${Math.min(match.matchPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    {match.matchPercentage > 80
                      ? '🎯 Excellent Match!'
                      : match.matchPercentage > 60
                      ? '✓ Good Match'
                      : match.matchPercentage > 40
                      ? '⚠ Moderate Match'
                      : '📈 Needs Improvement'}
                  </p>
                </div>

                {/* Stats */}
                <div className="col-span-1 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
                  <p className="text-sm text-gray-600 font-medium mb-4">Matched Skills</p>
                  <p className="text-4xl font-bold text-green-600 mb-2">
                    {match.matchedSkills?.length || 0}
                  </p>
                  <p className="text-xs text-gray-600">Keywords found in your resume</p>
                </div>

                <div className="col-span-1 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-8 border border-orange-200">
                  <p className="text-sm text-gray-600 font-medium mb-4">Missing Skills</p>
                  <p className="text-4xl font-bold text-orange-600 mb-2">
                    {match.missingSkills?.length || 0}
                  </p>
                  <p className="text-xs text-gray-600">Keywords not in your resume</p>
                </div>
              </div>

              {/* Matched Skills */}
              {match.matchedSkills && match.matchedSkills.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Your Matching Skills
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {match.matchedSkills.map((skill, idx) => (
                      <span key={idx} className="badge-success">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Skills */}
              {match.missingSkills && match.missingSkills.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 6H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Skills to Add
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {match.missingSkills.slice(0, 10).map((skill, idx) => (
                      <span key={idx} className="badge-warning">
                        ⚠ {skill}
                      </span>
                    ))}
                  </div>
                  {match.missingSkills.length > 10 && (
                    <p className="text-sm text-gray-600 mt-3">
                      ... and {match.missingSkills.length - 10} more skills
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default JobMatch;