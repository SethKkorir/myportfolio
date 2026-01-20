import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    // Floating icons configuration with more scattered positions and varied animations
    const floatingIcons = [
        { icon: "fa-robot", color: "#60a5fa", style: { top: "15%", left: "10%" }, duration: 6, yOffset: 30 },
        { icon: "fa-code", color: "#a78bfa", style: { top: "20%", right: "15%" }, duration: 5, yOffset: -30 },
        { icon: "fa-github", color: "#333", style: { bottom: "15%", left: "15%" }, duration: 7, yOffset: 40 },
        { icon: "fa-mug-hot", color: "#d97706", style: { bottom: "20%", right: "10%" }, duration: 5.5, yOffset: -40 },
        { icon: "fa-react", color: "#61dafb", style: { top: "40%", left: "5%" }, duration: 8, yOffset: 25 },
        { icon: "fa-node", color: "#68a063", style: { top: "30%", right: "5%" }, duration: 6.5, yOffset: -25 },
        { icon: "fa-database", color: "#4db33d", style: { bottom: "40%", right: "8%" }, duration: 7.5, yOffset: 35 },
        { icon: "fa-cloud", color: "#3b82f6", style: { bottom: "30%", left: "5%" }, duration: 6, yOffset: -35 }
    ];

    return (
        <section id="home" className="hero">
            {/* Animated Background Icons */}
            {floatingIcons.map((item, index) => (
                <motion.div
                    key={index}
                    className="floating-icon"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: 0.4, // Reduced slightly for balance
                        scale: 1,
                        y: [0, item.yOffset, 0],
                        x: [0, item.yOffset / 2, 0], // Add X movement
                        rotate: [0, 10, -10, 0]
                    }}
                    transition={{
                        duration: item.duration,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                    }}
                    style={{
                        position: 'absolute',
                        ...item.style,
                        color: item.color,
                        fontSize: '3rem',
                        zIndex: 0,
                        pointerEvents: 'none'
                    }}
                >
                    <i className={`fas ${item.icon}`}></i>
                </motion.div>
            ))}

            <div className="container">
                <div className="hero-content">
                    <motion.div
                        className="profile-pic"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img src="/assets/prof.png" alt="Seth Kipchumba" />
                    </motion.div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        Seth Kipchumba Korir
                    </motion.h1>

                    <motion.p
                        className="subtitle"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        Applied Computer Science Student & Junior Web Developer
                    </motion.p>

                    <motion.div
                        className="cta-buttons"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <a href="/assets/CV.docx" className="btn primary" id="download-cv" download>
                            <i className="fas fa-download"></i> Download CV
                        </a>
                        <a href="#contact" className="btn secondary">Contact Me</a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
