import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, User, Briefcase, Cpu, Mail, Menu, X, Star } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);

      // Track active section for bottom navigation
      const sections = ['home', 'about', 'projects', 'skills', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/#home', id: 'home' },
    { name: 'About', href: '/#about', id: 'about' },
    { name: 'Projects', href: '/#projects', id: 'projects' },
    { name: 'Skills', href: '/#skills', id: 'skills' },
    { name: 'Resume', href: '/resume', id: 'resume' },
    { name: 'Blog', href: '/#blog', id: 'blog' },
    { name: 'Contact', href: '/#contact', id: 'contact' },
  ];

  const mobileNavItems = [
    { name: 'Home', href: '/#home', id: 'home', Icon: HomeIcon },
    { name: 'About', href: '/#about', id: 'about', Icon: User },
    { name: 'Projects', href: '/#projects', id: 'projects', Icon: Briefcase },
    { name: 'Skills', href: '/#skills', id: 'skills', Icon: Cpu },
    { name: 'Contact', href: '/#contact', id: 'contact', Icon: Mail },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <a href="/" className="logo">SK</a>

          <ul className="nav-links">
            {navLinks.map((l) => (
              <li key={l.name}>
                {l.href.startsWith('/') && !l.href.startsWith('/#') ? (
                  <Link to={l.href} className={location.pathname === l.href ? 'active' : ''}>
                    {l.name}
                  </Link>
                ) : (
                  <a
                    href={l.href}
                    className={activeSection === l.id && location.pathname === '/' ? 'active' : ''}
                  >
                    {l.name}
                  </a>
                )}
              </li>
            ))}
          </ul>

          <div className="nav-right">
            <a href="/#contact" className="btn-primary" style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '50px' }}>
              Let's Connect <span style={{ color: '#0ea5e9', fontSize: '0.75rem' }}>◆</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <header className="mobile-top-bar">
        <a href="/" className="logo" style={{ textDecoration: 'none' }}>SK</a>
        <a href="/#contact" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', textDecoration: 'none', borderRadius: '50px' }}>
          Let's Connect <span style={{ color: '#0ea5e9' }}>◆</span>
        </a>
      </header>

      {/* Mobile Floating Bottom Bar */}
      <nav className="mobile-bottom-bar-nav">
        {mobileNavItems.map((item) => {
          const Icon = item.Icon;
          return (
            <a
              key={item.name}
              href={item.href}
              className={`mobile-bottom-bar-item ${activeSection === item.id && location.pathname === '/' ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </a>
          );
        })}
      </nav>
    </>
  );
};

export default Navbar;
