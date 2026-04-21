import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

const History = () => {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchResumes = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/resume`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setResumes(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        console.error('Failed to fetch resumes:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResumes();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Navigation />
        <div className="pt-24 flex items-center justify-center">
          <svg className="animate-spin h-12 w-12 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navigation />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-10 animate-slideUp">
            <h1 className="section-title text-4xl mb-3">Analysis History</h1>
            <p className="text-lg text-gray-600">Review all your resume analyses and track your improvements over time.</p>
          </div>

          {/* Content */}
          <div>
            {resumes.length === 0 ? (
              <div className="card p-16 text-center animate-slideUp">
                <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No analyses yet</h3>
                <p className="text-gray-600 mb-6">Start by uploading your first resume to see it appear here.</p>
                <a href="/upload" className="btn-primary inline-block">
                  Upload Your Resume
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {resumes.map((resume, idx) => {
                  const atsScore = resume.analysis?.atsScore || 0;
                  const scoreColor = atsScore >= 75 ? 'green' : atsScore >= 50 ? 'yellow' : 'red';
                  const scoreIcon = atsScore >= 75 ? '🎯' : atsScore >= 50 ? '⚠️' : '📈';

                  return (
                    <div 
                      key={resume._id}
                      className="card p-6 hover:shadow-lg hover:-translate-y-1 transition-all animate-slideUp"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        {/* Left Section */}
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className="flex-shrink-0">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                                scoreColor === 'green' ? 'bg-green-100' : scoreColor === 'yellow' ? 'bg-yellow-100' : 'bg-red-100'
                              }`}>
                                {scoreIcon}
                              </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-800 mb-1">{resume.filename}</h3>
                              <p className="text-xs text-gray-500 mb-3">
                                {new Date(resume.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>

                              {/* ATS Score */}
                              <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-semibold text-gray-700">ATS Score</span>
                                  <span className={`text-sm font-bold ${
                                    scoreColor === 'green' ? 'text-green-600' : scoreColor === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                                  }`}>
                                    {atsScore}%
                                  </span>
                                </div>
                                <div className="progress-bar h-2">
                                  <div 
                                    className={`${
                                      scoreColor === 'green' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                      scoreColor === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                                      'bg-gradient-to-r from-red-500 to-red-600'
                                    } progress-fill`}
                                    style={{ width: `${atsScore}%` }}
                                  ></div>
                                </div>
                              </div>

                              {/* Skills */}
                              {resume.analysis?.skills && resume.analysis.skills.length > 0 && (
                                <div className="mb-3">
                                  <p className="text-xs font-semibold text-gray-600 mb-2">Top Skills ({resume.analysis.skills.length})</p>
                                  <div className="flex flex-wrap gap-2">
                                    {resume.analysis.skills.slice(0, 6).map((skill, i) => (
                                      <span key={i} className="badge-primary text-xs">
                                        {skill}
                                      </span>
                                    ))}
                                    {resume.analysis.skills.length > 6 && (
                                      <span className="text-xs text-gray-500 px-2 py-1">
                                        +{resume.analysis.skills.length - 6} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Recommendations */}
                              {resume.analysis?.recommendations && resume.analysis.recommendations.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-gray-600 mb-2">Key Recommendations</p>
                                  <ul className="text-xs text-gray-600 space-y-1">
                                    {resume.analysis.recommendations.slice(0, 2).map((rec, i) => (
                                      <li key={i} className="flex items-start">
                                        <svg className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span>{rec}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Section - Actions */}
                        <div className="flex-shrink-0 flex gap-2">
                          <a 
                            href="/match" 
                            className="btn-outline px-4 py-2 text-sm inline-flex items-center gap-2 whitespace-nowrap"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Match Job
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default History;