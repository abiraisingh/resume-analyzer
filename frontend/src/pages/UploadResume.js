import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
    }
  }, [navigate]);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file first");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/resume/upload`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Resume uploaded and analyzed successfully!");
      navigate("/");
    } catch (err) {
      alert(`Upload failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <Navigation />

      <main className="pt-24 pb-12 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-10 animate-fade-in-down">
              <h1 className="section-title text-4xl mb-3 text-glow">Upload Your Resume</h1>
              <p className="text-lg text-gray-600">Get AI-powered insights to optimize your resume for ATS and employers.</p>
            </div>

            {/* Upload Card */}
            <div className="glass p-10 animate-bounce-in animation-delay-200">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={`border-4 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 ${
                    file
                      ? 'border-green-400 bg-green-50/30 ring-2 ring-green-200'
                      : 'border-primary-300 bg-primary-50/30 hover:border-primary-500 hover:bg-primary-100/30 hover:ring-2 hover:ring-primary-300'
                  }`}
                >
                  <input {...getInputProps()} />

                  {!file ? (
                    <div className="animate-float">
                      <svg className="mx-auto h-16 w-16 text-primary-400 mb-4 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 12m0 0l-4 4m4-4l4 4" />
                      </svg>
                      <p className="text-xl font-semibold text-gray-800 mb-2">
                        Drag and drop your resume
                      </p>
                      <p className="text-gray-600 mb-1">or click to browse your computer</p>
                      <p className="text-sm text-gray-500">PDF or DOCX • Up to 10MB</p>
                    </div>
                  ) : (
                    <div className="animate-rotate-in">
                      <svg className="mx-auto h-16 w-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xl font-semibold text-green-700 mb-1">
                        {file.name}
                      </p>
                      <p className="text-sm text-green-600">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to upload
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !file}
                  className="btn-primary w-full py-3 text-lg font-bold ripple"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading & Analyzing...
                    </span>
                  ) : 'Upload & Analyze Resume'}
                </button>
              </form>

              {/* Info Section */}
              <div className="mt-10 pt-8 border-t border-white/20">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-primary-600 animate-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  What happens after upload?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start group hover-lift p-3 rounded-lg transition-all">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 text-white font-bold text-sm group-hover:shadow-lg group-hover:shadow-primary-500/50 transition-all">
                        1
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-800">ATS Compatibility Analysis</h4>
                      <p className="text-sm text-gray-600 mt-1">Your resume will be scanned for ATS readability and formatting issues.</p>
                    </div>
                  </div>
                  <div className="flex items-start group hover-lift p-3 rounded-lg transition-all animation-delay-100">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 text-white font-bold text-sm group-hover:shadow-lg group-hover:shadow-primary-500/50 transition-all">
                        2
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-800">Content Extraction</h4>
                      <p className="text-sm text-gray-600 mt-1">Key information (skills, experience, education) will be extracted.</p>
                    </div>
                  </div>
                  <div className="flex items-start group hover-lift p-3 rounded-lg transition-all animation-delay-200">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 text-white font-bold text-sm group-hover:shadow-lg group-hover:shadow-primary-500/50 transition-all">
                        3
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-800">Personalized Recommendations</h4>
                      <p className="text-sm text-gray-600 mt-1">Get actionable insights to improve your resume score.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="mt-8 glass p-8 animate-fade-in-up animation-delay-300">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m0 0h6" />
                </svg>
                Tips for Best Results
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start group hover-glow transition-all p-2 rounded">
                  <svg className="w-4 h-4 mt-1 mr-3 text-green-500 flex-shrink-0 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Use standard fonts like Arial, Calibri, or Times New Roman
                </li>
                <li className="flex items-start group hover-glow transition-all p-2 rounded animation-delay-100">
                  <svg className="w-4 h-4 mt-1 mr-3 text-green-500 flex-shrink-0 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Keep formatting simple - avoid images and complex layouts
                </li>
                <li className="flex items-start group hover-glow transition-all p-2 rounded animation-delay-200">
                  <svg className="w-4 h-4 mt-1 mr-3 text-green-500 flex-shrink-0 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Include relevant keywords from job descriptions
                </li>
                <li className="flex items-start group hover-glow transition-all p-2 rounded animation-delay-300">
                  <svg className="w-4 h-4 mt-1 mr-3 text-green-500 flex-shrink-0 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Ensure proper spelling and grammar throughout
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadResume;