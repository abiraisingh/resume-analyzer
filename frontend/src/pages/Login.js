import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-poster">
        <Link to="/login" className="brand-lockup"><span className="brand-mark">C.</span><span className="brand-name">CAREER<span>CANVAS</span></span></Link>
        <div className="poster-content">
          <p className="eyebrow"><span className="eyebrow-dot" /> THE CAREER UPGRADE CLUB</p>
          <h1 className="display-title">Your next<br /><span>chapter</span><br />looks good.</h1>
          <div className="poster-note">A BETTER RESUME IS A<br />BETTER WAY IN. <span>✳</span></div>
        </div>
        <span className="poster-edition">ISSUE 01 / THE MAIN CHARACTER EDITION</span>
      </section>
      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <p className="eyebrow">WELCOME BACK TO YOUR STUDIO</p>
          <h2 className="auth-title">Let’s pick<br />up where you left off<span>.</span></h2>
          <p className="auth-subtitle">Your next move is waiting.</p>
          {location.state?.registered && <div className="notice notice-success" role="status">Your studio is ready. Sign in to get started.</div>}
          {error && <div className="notice notice-error" role="alert">{error}</div>}
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>EMAIL ADDRESS<input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
            <label>PASSWORD<input type="password" autoComplete="current-password" placeholder="Your password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
            <button type="submit" className="button button-ink auth-submit" disabled={isLoading}>{isLoading ? 'OPENING YOUR STUDIO…' : 'SIGN ME IN'} <span>↗</span></button>
          </form>
          <p className="auth-switch">New around here? <Link to="/register">Make yourself at home ↗</Link></p>
          <p className="auth-legal">YOUR CAREER STORY IS YOURS. YOUR NEXT CHAPTER IS YOURS TO WRITE.</p>
        </div>
      </section>
    </main>
  );
};

export default Login;
