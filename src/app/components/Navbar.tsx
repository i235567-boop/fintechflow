import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const links = [
    { path: '/', label: 'Wallet' },
    { path: '/transactions', label: 'Transactions' },
    { path: '/apply-loan', label: 'Apply Loan' },
    { path: '/loan-status', label: 'Loan Status' },
    { path: '/emi-calculator', label: 'EMI Calculator' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-logo">💰</span>
        <span className="brand-name">FintechFlow</span>
      </div>

      <div className="navbar-links">
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </nav>
  );
}
