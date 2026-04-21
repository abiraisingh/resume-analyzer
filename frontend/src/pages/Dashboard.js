import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchResumes = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/resume`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setResumes(res.data);
      } catch (err) {
        console.error('Failed to fetch resumes:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResumes();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-3000"></div>

      <Navigation />

      {/* Main Content */}
      <main className="pt-24 pb-12 relative z-10">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-16 animate-fade-in-down">
            <h1 className="section-title text-5xl md:text-6xl mb-4 text-glow">Welcome to Resume Analyzer</h1>
            <p className="text-lg text-gray-600 max-w-2xl font-medium">Analyze your resume, improve your skills, and find perfect job matches with AI-powered insights.</p>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Link 
              to="/upload" 
              className="group glass hover-lift card-hover p-8 cursor-pointer animate-fade-in-up"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-in transition-all duration-500 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 12m0 0l-4 4m4-4l4 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Upload Resume</h3>
              <p className="text-gray-600 text-sm">Upload and analyze your resume with AI insights</p>
              <div className="mt-4 flex items-center text-green-600 font-semibold group-hover:translate-x-1 transition-transform">
                Get Started →
              </div>
            </Link>

            <Link 
              to="/match" 
              className="group glass hover-lift card-hover p-8 hover:cursor-pointer animate-fade-in-up animation-delay-100"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-in transition-all duration-500 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Job Match</h3>
              <p className="text-gray-600 text-sm">Match your resume with job descriptions</p>
              <div className="mt-4 flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                Match Now →
              </div>
            </Link>

            <Link 
              to="/history" 
              className="group glass hover-lift card-hover p-8 hover:cursor-pointer animate-fade-in-up animation-delay-200"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-in transition-all duration-500 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">History</h3>
              <p className="text-gray-600 text-sm">View your previous analyses</p>
              <div className="mt-4 flex items-center text-purple-600 font-semibold group-hover:translate-x-1 transition-transform">
                View History →
              </div>
            </Link>
          </div>

          {/* Recent Analyses Section */}
          <div className="glass card-hover p-8 animate-fade-in-up animation-delay-300">
            <div className="flex items-center mb-8">
              <svg className="w-6 h-6 mr-3 text-primary-600 animate-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Recent Analyses
              </h2>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : resumes.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 mb-4 text-lg font-medium">No resumes uploaded yet</p>
                  <Link to="/upload" className="btn-primary inline-block">
                    Upload Your First Resume
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {resumes.map((resume, idx) => (
                    <div 
                      key={resume._id} 
                      className="group glass-dark hover-lift p-6 rounded-xl animate-bounce-in cursor-pointer"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start flex-1">
                          <svg className="w-5 h-5 mt-1 mr-3 text-primary-400 flex-shrink-0 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"></path>
                          </svg>
                          <div>
                            <h3 className="font-bold text-lg text-white group-hover:text-primary-200 transition-colors">{resume.filename}</h3>
                            <p className="text-xs text-gray-300 mt-1">{new Date(resume.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {/* ATS Score */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-200">ATS Score</span>
                            <span className={`text-lg font-bold ${resume.analysis?.atsScore >= 75 ? 'text-green-400' : resume.analysis?.atsScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {resume.analysis?.atsScore || 0}%
                            </span>
                          </div>
                          <div className="progress-bar">
                            <div 
                              className={`${resume.analysis?.atsScore >= 75 ? 'bg-gradient-to-r from-green-500 to-green-600' : resume.analysis?.atsScore >= 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 'bg-gradient-to-r from-red-500 to-red-600'} progress-fill animate-pulse`}
                              style={{ width: `${resume.analysis?.atsScore || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;