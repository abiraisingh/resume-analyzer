import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import api from '../utils/api';

const SKILL_TERMS = [
  'python', 'javascript', 'typescript', 'react', 'node.js', 'express', 'mongodb',
  'sql', 'postgres', 'mysql', 'java', 'c++', 'docker', 'kubernetes', 'aws',
  'azure', 'git', 'html', 'css', 'tailwind', 'graphql', 'rest api', 'agile',
  'machine learning', 'data analysis', 'communication', 'leadership', 'testing',
];

const JobMatch = () => {
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [match, setMatch] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([api.get('/resume'), api.get('/job')])
      .then(([resumeResponse, jobResponse]) => {
        if (!active) return;
        const resumeList = Array.isArray(resumeResponse.data.data) ? resumeResponse.data.data : [];
        const jobList = Array.isArray(jobResponse.data) ? jobResponse.data : [];
        setResumes(resumeList);
        setJobs(jobList);
        if (resumeList[0]) setSelectedResume(resumeList[0]._id);
      })
      .catch(() => {
        if (active) setError('We couldn’t open your job studio. Please refresh and try again.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const activeResume = useMemo(
    () => resumes.find((resume) => resume._id === selectedResume),
    [resumes, selectedResume],
  );
  const activeJob = useMemo(
    () => jobs.find((job) => job._id === selectedJob),
    [jobs, selectedJob],
  );

  const createJob = async (event) => {
    event.preventDefault();
    if (!jobTitle.trim() || !jobDesc.trim()) {
      setError('Add a title and description to save this role.');
      return;
    }

    setIsWorking(true);
    setError('');
    try {
      const { data } = await api.post('/job', { title: jobTitle.trim(), description: jobDesc.trim() });
      setJobs((current) => [data, ...current]);
      setSelectedJob(data._id);
      setJobTitle('');
      setJobDesc('');
      setShowForm(false);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'We couldn’t save that role. Please try again.');
    } finally {
      setIsWorking(false);
    }
  };

  const runMatch = async () => {
    if (!activeResume || !activeJob) {
      setError('Choose both a resume and a saved role before comparing.');
      return;
    }

    setIsWorking(true);
    setError('');
    setMatch(null);
    try {
      const { data } = await api.post('/job/match', {
        resumeId: activeResume._id,
        jobId: activeJob._id,
      });
      setMatch(data);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'The comparison couldn’t be completed. Please try again.');
    } finally {
      setIsWorking(false);
    }
  };

  const displayScore = Math.max(0, Math.min(100, Number(match?.matchPercentage) || 0));
  const matchedSkills = activeResume?.analysis?.skills?.filter((skill) => (
    `${activeJob?.title || ''} ${activeJob?.description || ''}`.toLowerCase().includes(skill.toLowerCase())
  )) || [];
  const possibleSkills = SKILL_TERMS.filter((skill) => (
    `${activeJob?.title || ''} ${activeJob?.description || ''}`.toLowerCase().includes(skill)
  ));
  const relevantGaps = possibleSkills.filter((skill) => (
    !activeResume?.analysis?.skills?.some((resumeSkill) => resumeSkill.toLowerCase() === skill)
  ));

  return (
    <div className="app-shell">
      <Navigation />
      <main className="page-wrap inner-page">
        <div className="inner-header">
          <div><p className="eyebrow"><span className="eyebrow-dot" /> THE ROLE-READY STUDIO</p><h1 className="display-title inner-title">Find your<br /><span>yes in the job.</span></h1></div>
          <div className="header-side-note">YOUR SKILLS.<br />THEIR WISHLIST.<br />LET’S CONNECT. <span>✳</span></div>
        </div>

        <section className="match-workbench">
          <div className="workbench-heading"><span>THE PERFECT-FIT FINDER</span><span>02 / ROLE MATCH</span></div>
          <div className="match-selectors">
            <label className="match-picker">
              <span className="picker-label"><span>01</span> YOUR RESUME</span>
              <select value={selectedResume} onChange={(event) => { setSelectedResume(event.target.value); setMatch(null); }}>
                <option value="">Choose a resume…</option>
                {resumes.map((resume) => <option key={resume._id} value={resume._id}>{resume.filename}</option>)}
              </select>
              {activeResume && <span className="picker-foot">{activeResume.analysis?.skills?.length || 0} SKILLS SPOTTED IN THIS SCAN</span>}
            </label>

            <div className="match-symbol" aria-hidden="true">✳</div>

            <label className="match-picker picker-pink">
              <span className="picker-label"><span>02</span> THE ROLE</span>
              <select value={selectedJob} onChange={(event) => { setSelectedJob(event.target.value); setMatch(null); }}>
                <option value="">Choose a saved role…</option>
                {jobs.map((job) => <option key={job._id} value={job._id}>{job.title}</option>)}
              </select>
              <span className="picker-foot">{jobs.length} ROLE{jobs.length === 1 ? '' : 'S'} IN YOUR STUDIO</span>
            </label>
          </div>

          <div className="workbench-actions">
            <button type="button" className="button button-outline" onClick={() => { setShowForm(!showForm); setError(''); }}>
              {showForm ? 'CANCEL' : '＋ SAVE A ROLE'}
            </button>
            <button type="button" className="button button-ink" onClick={runMatch} disabled={isLoading || isWorking || !activeResume || !activeJob}>
              {isWorking ? 'MAKING THE INTRO…' : 'CHECK OUR CHEMISTRY'} <span>{isWorking ? '◌' : '↗'}</span>
            </button>
          </div>

          {showForm && (
            <form className="job-form" onSubmit={createJob}>
              <label>THE JOB TITLE<input value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} placeholder="e.g. Product designer, plot twist specialist" required maxLength={120} /></label>
              <label>THE JOB DESCRIPTION<textarea value={jobDesc} onChange={(event) => setJobDesc(event.target.value)} placeholder="Paste the role details here…" rows={6} required maxLength={20000} /></label>
              <button type="submit" className="button button-ink" disabled={isWorking}>{isWorking ? 'SAVING…' : 'SAVE THIS ROLE ↗'}</button>
            </form>
          )}
          {error && <div className="notice notice-error" role="alert">{error}</div>}
          {!isLoading && !resumes.length && (
            <div className="inline-empty"><span>NO RESUME, NO ROMANCE.</span><p>Give us a resume to find your strongest matches.</p><Link className="text-link" to="/upload">ADD YOUR FIRST RESUME ↗</Link></div>
          )}
          {!isLoading && !jobs.length && (
            <div className="inline-empty"><span>THE JOB BOARD IS YOURS.</span><p>Save a job description to get your first match.</p></div>
          )}
        </section>

        {match && (
          <section className="match-result" aria-live="polite">
            <div className="result-score"><span>YOUR ROLE<br />CHEMISTRY</span><strong>{displayScore}<small>%</small></strong><div className="result-score-ring" style={{ '--score': `${displayScore}%` }} /></div>
            <div className="result-details">
              <p className="eyebrow">THE FIRST IMPRESSION IS IN</p>
              <h2>{displayScore >= 70 ? 'Looking like a good thing.' : displayScore >= 40 ? 'There’s something here.' : 'Room for a plot twist.'}</h2>
              <p className="result-subtitle">{activeResume?.filename} <span>×</span> {activeJob?.title}</p>
              {matchedSkills.length > 0 && <div className="result-tags"><span className="tag-caption">IN YOUR CORNER</span>{matchedSkills.slice(0, 8).map((skill) => <span className="skill-tag" key={skill}>{skill}</span>)}</div>}
              {relevantGaps.length > 0 && <div className="result-tags"><span className="tag-caption">WORDS TO WEAVE IN</span>{relevantGaps.slice(0, 8).map((skill) => <span className="skill-tag tag-gap" key={skill}>{skill}</span>)}</div>}
              {match.missingSkills?.length > 0 && <div className="result-tags"><span className="tag-caption">OTHER KEYWORDS TO CONSIDER</span>{match.missingSkills.slice(0, 8).map((skill) => <span className="skill-tag tag-gap" key={skill}>{skill}</span>)}</div>}
            </div>
          </section>
        )}

        <footer className="page-footer"><span>CAREER CANVAS © 2025</span><span>THE RIGHT ROLE HAS YOUR NAME ON IT ✳</span></footer>
      </main>
    </div>
  );
};

export default JobMatch;
