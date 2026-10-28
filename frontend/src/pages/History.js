import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import api from '../utils/api';

const History = () => {
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
        if (active) setError('Your archive couldn’t be loaded. Please try again.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="app-shell">
      <Navigation />
      <main className="page-wrap inner-page">
        <div className="inner-header">
          <div><p className="eyebrow"><span className="eyebrow-dot" /> THE CAREER CANVAS ARCHIVE</p><h1 className="display-title inner-title">Proof of<br /><span>your progress.</span></h1></div>
          <div className="header-side-note">{resumes.length.toString().padStart(2, '0')} SCANS<br />AND COUNTING <span>✳</span></div>
        </div>

        <div className="archive-bar"><span>YOUR RESUME HISTORY</span><span>{resumes.length} {resumes.length === 1 ? 'EDITION' : 'EDITIONS'} / DESCENDING DATE</span></div>
        {error && <div className="notice notice-error" role="alert">{error}</div>}
        {isLoading && <div className="empty-panel">OPENING YOUR ARCHIVE…</div>}
        {!isLoading && !error && !resumes.length && (
          <div className="archive-empty"><span className="empty-mark">✳</span><h2>The next version<br />starts right here.</h2><p>Your scans will live here, side by side, so you can watch your story get stronger.</p><Link to="/upload" className="button button-ink">MAKE YOUR FIRST SCAN <span>↗</span></Link></div>
        )}
        {!isLoading && !error && resumes.map((resume, index) => {
          const score = Math.max(0, Math.min(100, Number(resume.analysis?.atsScore) || 0));
          const skills = Array.isArray(resume.analysis?.skills) ? resume.analysis.skills : [];
          const recommendations = Array.isArray(resume.analysis?.recommendations) ? resume.analysis.recommendations : [];
          return (
            <article className="archive-card" key={resume._id}>
              <div className="archive-card-top"><span>EDITION {String(index + 1).padStart(2, '0')}</span><span>{new Date(resume.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
              <div className="archive-card-main">
                <div className="archive-file"><span className="file-mark">✳</span><div><h2>{resume.filename || 'Untitled resume'}</h2><p>YOUR CAREER STORY, IN PROGRESS</p></div></div>
                <div className="archive-score"><span>ATS SCORE</span><strong>{score}<small>%</small></strong><div className="score-track"><span style={{ width: `${score}%` }} /></div></div>
              </div>
              <div className="archive-card-bottom">
                <div className="archive-skills"><span className="tag-caption">STRENGTHS SPOTTED</span><div className="skill-cloud">{skills.length ? skills.slice(0, 7).map((skill) => <span className="skill-tag" key={skill}>{skill}</span>) : <span className="muted-copy">No skills detected in this scan.</span>}{skills.length > 7 && <span className="skill-tag tag-more">+{skills.length - 7} MORE</span>}</div></div>
                <div className="archive-notes"><span className="tag-caption">NEXT LITTLE UPGRADES</span>{recommendations.length ? <ul>{recommendations.slice(0, 2).map((recommendation, noteIndex) => <li key={`${resume._id}-${noteIndex}`}>{recommendation}</li>)}</ul> : <p>No recommendations for this scan.</p>}</div>
                <Link to="/match" className="text-link">MATCH A ROLE ↗</Link>
              </div>
            </article>
          );
        })}
        <footer className="page-footer"><span>CAREER CANVAS © 2025</span><span>EVERY EDITION IS A NEW BEGINNING ✳</span></footer>
      </main>
    </div>
  );
};

export default History;
