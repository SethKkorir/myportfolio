import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [theme, setTheme] = useState('light');

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        // Also update icon logic if needed, but CSS handles themes well
    };

    return (
        <nav className="navbar">
            <div className="container">
                <a href="/" className="logo">SK</a>
                <div
                    className="nav-toggle"
                    id="navToggle"
                    onClick={toggleNav}
                >
                    <motion.span animate={{ rotate: isNavOpen ? 45 : 0, y: isNavOpen ? 8 : 0 }} />
                    <motion.span animate={{ opacity: isNavOpen ? 0 : 1 }} />
                    <motion.span animate={{ rotate: isNavOpen ? -45 : 0, y: isNavOpen ? -8 : 0 }} />
                </div>
                <ul className={`nav-menu ${isNavOpen ? 'active' : ''}`}>
                    {['Home', 'About', 'Experience', 'Skills', 'Projects', 'Blog', 'Contact'].map((item) => (
                        <li key={item}>
                            <a href={`#${item.toLowerCase()}`} onClick={() => setIsNavOpen(false)}>
                                {item}
                            </a>
                        </li>
                    ))}
                </ul>
                <button
                    id="theme-toggle"
                    className="theme-toggle"
                    onClick={toggleTheme}
                >
                    <motion.i
                        key={theme}
                        initial={{ rotate: -180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}
                    />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
