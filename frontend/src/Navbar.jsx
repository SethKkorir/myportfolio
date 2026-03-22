import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, FileText } from 'lucide-react';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const navLinks = [
    { name: 'Home',       href: '/#home' },
    { name: 'About',      href: '/#about' },
    { name: 'Experience', href: '/#experience' },
    { name: 'Projects',   href: '/#projects' },
    { name: 'Contact',    href: '/#contact' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <a href="/" className="logo">SK<span>.</span></a>

          <ul className="nav-links">
            {navLinks.map(l => (
              <li key={l.name}><a href={l.href}>{l.name}</a></li>
            ))}
          </ul>

          <div className="nav-right">
            {/* Resume CTA */}
            <Link
              to="/resume"
              className="btn-primary"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
            >
              <FileText size={16} /> Resume
            </Link>

            <button className="theme-btn" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button className="hamburger" onClick={() => setIsOpen(o => !o)} aria-label="Toggle menu">
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-nav open"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <ul>
              {navLinks.map(l => (
                <li key={l.name}>
                  <a href={l.href} onClick={() => setIsOpen(false)}>{l.name}</a>
                </li>
              ))}
              <li><Link to="/resume" onClick={() => setIsOpen(false)}><FileText size={18} /> Resume</Link></li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
