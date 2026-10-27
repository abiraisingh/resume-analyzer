import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { label: 'Overview', path: '/' },
  { label: 'New scan', path: '/upload' },
  { label: 'Job studio', path: '/match' },
  { label: 'Archive', path: '/history' },
];

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <Link to="/" className="brand-lockup" aria-label="Career Canvas home">
        <span className="brand-mark">C.</span>
        <span className="brand-name">CAREER<span>CANVAS</span></span>
      </Link>

      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? 'CLOSE −' : 'MENU +'}
      </button>

      <nav className={`topbar-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
        {links.map(({ label, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' is-active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className={`topbar-account${menuOpen ? ' is-open' : ''}`}>
        <span className="account-avatar" aria-hidden="true">
          {(user?.username || user?.email || 'C').charAt(0).toUpperCase()}
        </span>
        <span className="account-name">{user?.username || user?.email || 'Your studio'}</span>
        <button className="signout-button" type="button" onClick={signOut}>Sign out ↗</button>
      </div>
    </header>
  );
};

export default Navigation;
