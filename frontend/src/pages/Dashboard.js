import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import api from '../utils/api';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    api.get('/resume')
      .then(({ data }) => {
        if (active) setResumes(Array.isArray(data.data) ? data.data : []);
      })
      .catch(() => {
        if (active) setError('We couldn’t load your scans. Please try again in a moment.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const latest = resumes[0];
  const score = Math.max(0, Math.min(100, Number(latest?.analysis?.atsScore) || 0));
  const actions = [
    { number: '01', title: 'Run a new scan', description: 'Get an ATS score and actionable notes on your resume.', path: '/upload', className: 'action-lime', symbol: '↗' },
    { number: '02', title: 'Match a role', description: 'See how your experience lines up against a real job.', path: '/match', className: 'action-pink', symbol: '✳' },
    { number: '03', title: 'Review your archive', description: 'Track your progress from one version to the next.', path: '/history', className: 'action-orange', symbol: '↘' },
  ];

  return (
    <div className="app-shell">
      <Navigation />
      <main className="page-wrap dashboard-wrap">
        <div className="hero-panel">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> YOUR CAREER, IN FULL COLOR</p>
            <h1 className="display-title">Make your<br /><span>next move</span><br />impossible to miss.</h1>
            <p className="hero-description">Turn your experience into a story hiring teams can’t scroll past. Scan, sharpen, and show up ready.</p>
            <Link to="/upload" className="button button-ink">Scan your resume <span>↗</span></Link>
          </div>
          <div className="hero-art" aria-label="Career score illustration">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="hero-sticker">MAKE<br />YOUR<br />MOVE <span>✳</span></div>
            <div className="score-ticket">
              <span className="ticket-label">LATEST ATS SCORE</span>
              <strong>{latest ? `${score}%` : '—'}</strong>
              <span className="ticket-foot">{latest ? 'Your story, measured.' : 'Your first scan is one click away.'}</span>
              <span className="ticket-star">✳</span>
            </div>
            <span className="art-caption">THE CAREER<br />UPGRADE CLUB®</span>
          </div>
          <span className="hero-index">VOL. 01 — YOUR CAREER EDITION</span>
        </div>

        <section className="stat-strip" aria-label="Your career workspace">
          <div className="stat-block"><span className="stat-value">{resumes.length.toString().padStart(2, '0')}</span><span className="stat-label">RESUMES IN YOUR ARCHIVE</span></div>
          <div className="stat-block"><span className="stat-value">{latest ? `${score}%` : '—'}</span><span className="stat-label">MOST RECENT ATS SCORE</span></div>
          <div className="stat-block"><span className="stat-value">{latest?.analysis?.skills?.length || 0}</span><span className="stat-label">SKILLS SPOTTED IN THE LATEST SCAN</span></div>
          <div className="stat-note">GOOD WORK<br />LOOKS GOOD<br />ON YOU <span>✳</span></div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div><p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p><h2 className="section-title">Pick your power move<span>.</span></h2></div>
            <span className="section-index">THREE WAYS IN / 001–003</span>
          </div>
          <div className="action-grid">
            {actions.map((action) => (
              <Link to={action.path} key={action.number} className={`action-card ${action.className}`}>
                <span className="action-number">{action.number} / STUDIO</span>
                <span className="action-symbol" aria-hidden="true">{action.symbol}</span>
                <div><h3>{action.title}</h3><p>{action.description}</p></div>
                <span className="action-arrow">LET’S GO ↗</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="recent-section">
          <div className="section-heading recent-heading">
            <div><p className="eyebrow">FRESH OFF THE PRESS</p><h2 className="section-title">Latest scans<span>.</span></h2></div>
            <Link to="/history" className="text-link">THE WHOLE ARCHIVE ↗</Link>
          </div>
          {error && <div className="notice notice-error" role="alert">{error}</div>}
          {isLoading ? <div className="empty-panel">OPENING YOUR STUDIO…</div> : null}
          {!isLoading && !error && resumes.length === 0 && (
            <div className="empty-panel"><span className="empty-mark">✳</span><span>Nothing in the archive yet. Make your first move.</span><Link to="/upload" className="text-link">UPLOAD A RESUME ↗</Link></div>
          )}
          {!isLoading && !error && resumes.slice(0, 3).map((resume, index) => {
            const resumeScore = Math.max(0, Math.min(100, Number(resume.analysis?.atsScore) || 0));
            return (
              <div className="scan-row" key={resume._id}>
                <span className="scan-count">0{index + 1}</span>
                <span className="scan-file">{resume.filename}</span>
                <span className="scan-date">{new Date(resume.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="scan-score">{resumeScore}<small>%</small></span>
                <span className="scan-meter"><span style={{ width: `${resumeScore}%` }} /></span>
              </div>
            );
          })}
        </section>

        <footer className="page-footer"><span>CAREER CANVAS © 2025</span><span>MADE FOR THE NEXT VERSION OF YOU ✳</span></footer>
      </main>
    </div>
  );
};

export default Dashboard;
