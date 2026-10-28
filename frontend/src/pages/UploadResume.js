import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import api from '../utils/api';

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError('');
    if (rejectedFiles.length) {
      setFile(null);
      setError('Choose a PDF or DOCX file no larger than 10 MB.');
      return;
    }
    if (acceptedFiles[0]) setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true,
    maxSize: 10 * 1024 * 1024,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Add a resume before starting your scan.');
      return;
    }

    setIsLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 130000,
      });
      navigate('/history', { state: { uploaded: true } });
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'The scan couldn’t be completed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Navigation />
      <main className="page-wrap inner-page">
        <div className="inner-header">
          <div><p className="eyebrow"><span className="eyebrow-dot" /> THE RESUME REFRESH</p><h1 className="display-title inner-title">Give your<br /><span>story a scan.</span></h1></div>
          <div className="header-side-note">A LITTLE CLARITY.<br />A LOT MORE CONFIDENCE.<span>✳</span></div>
        </div>

        <div className="upload-layout">
          <form onSubmit={handleSubmit} className="upload-card">
            <div className="upload-card-top"><span>YOUR NEXT BIG THING STARTS HERE</span><span>01 — 03</span></div>
            <div
              {...getRootProps({
                className: `dropzone${isDragActive ? ' is-dragging' : ''}${file ? ' has-file' : ''}`,
                'aria-label': 'Resume upload area',
              })}
            >
              <input {...getInputProps()} />
              <span className="dropzone-symbol" aria-hidden="true">{file ? '✓' : '＋'}</span>
              {file ? (
                <>
                  <p className="dropzone-kicker">READY FOR ITS CLOSE-UP</p>
                  <h2 className="dropzone-title">{file.name}</h2>
                  <p className="dropzone-hint">{(file.size / (1024 * 1024)).toFixed(2)} MB · PDF OR DOCX</p>
                  <button type="button" className="text-link remove-file" onClick={() => setFile(null)}>REMOVE FILE ×</button>
                </>
              ) : (
                <>
                  <p className="dropzone-kicker">{isDragActive ? 'DROP IT LIKE IT’S HOT' : 'PDF OR DOCX · 10 MB MAX'}</p>
                  <h2 className="dropzone-title">{isDragActive ? 'We’ve got you.' : 'Drop your resume.'}</h2>
                  <p className="dropzone-hint">Drag a file onto this space or choose one from your device.</p>
                  <button type="button" className="button button-outline" onClick={open}>Choose a file <span>↗</span></button>
                </>
              )}
            </div>
            {error && <div className="notice notice-error" role="alert">{error}</div>}
            <button type="submit" className="button button-ink upload-submit" disabled={isLoading || !file}>
              {isLoading ? 'SCANNING YOUR STORY…' : 'START MY RESUME SCAN'} <span>{isLoading ? '◌' : '↗'}</span>
            </button>
            <p className="upload-privacy">Your document stays yours. We use its text to create your analysis.</p>
          </form>

          <aside className="upload-aside">
            <p className="eyebrow">THE GOOD STUFF, DELIVERED</p>
            <h2>More than<br />a number<span>.</span></h2>
            <div className="process-list">
              <div><span className="process-number">01</span><div><h3>ATS reality check</h3><p>See how your resume reads to an applicant tracking system.</p></div></div>
              <div><span className="process-number">02</span><div><h3>Skills, spotted</h3><p>Surface the strengths and experience already in your story.</p></div></div>
              <div><span className="process-number">03</span><div><h3>A next-step edit</h3><p>Get clear, practical ideas for your next revision.</p></div></div>
            </div>
            <Link to="/history" className="text-link">VISIT YOUR SCAN ARCHIVE ↗</Link>
          </aside>
        </div>
        <footer className="page-footer"><span>CAREER CANVAS © 2025</span><span>YOUR NEXT CHAPTER LOOKS GOOD ✳</span></footer>
      </main>
    </div>
  );
};

export default UploadResume;
