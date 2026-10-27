import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Those passwords don’t match yet.');
      return;
    }
    if (password.length < 6) {
      setError('Your password needs at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await register(username, email, password);
      navigate('/login', { state: { registered: true } });
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Account creation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-poster register-poster">
        <Link to="/register" className="brand-lockup"><span className="brand-mark">C.</span><span className="brand-name">CAREER<span>CANVAS</span></span></Link>
        <div className="poster-content">
          <p className="eyebrow"><span className="eyebrow-dot" /> PLOT TWIST: YOU’RE THE TALENT</p>
          <h1 className="display-title">This is<br /><span>your</span><br />good thing.</h1>
          <div className="poster-note">BIG CAREER ENERGY.<br />SMALL FIRST STEP. <span>✳</span></div>
        </div>
        <span className="poster-edition">ISSUE 01 / THE MAIN CHARACTER EDITION</span>
      </section>
      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <p className="eyebrow">YOUR FRESH START LOOKS GOOD</p>
          <h2 className="auth-title">Make room<br />for what’s next<span>.</span></h2>
          <p className="auth-subtitle">Create your free studio. Your future self says thanks.</p>
          {error && <div className="notice notice-error" role="alert">{error}</div>}
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>YOUR NAME<input type="text" autoComplete="username" placeholder="How should we call you?" value={username} onChange={(event) => setUsername(event.target.value)} required maxLength={50} /></label>
            <label>EMAIL ADDRESS<input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
            <div className="auth-input-grid">
              <label>PASSWORD<input type="password" autoComplete="new-password" placeholder="At least 6 characters" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required /></label>
              <label>ONE MORE TIME<input type="password" autoComplete="new-password" placeholder="Confirm password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={6} required /></label>
            </div>
            <button type="submit" className="button button-ink auth-submit" disabled={isLoading}>{isLoading ? 'SETTING UP YOUR STUDIO…' : 'LET’S MAKE IT OFFICIAL'} <span>↗</span></button>
          </form>
          <p className="auth-switch">Already have a studio? <Link to="/login">Sign right in ↗</Link></p>
          <p className="auth-legal">YOUR CAREER STORY IS YOURS. YOUR NEXT CHAPTER IS YOURS TO WRITE.</p>
        </div>
      </section>
    </main>
  );
};

export default Register;
