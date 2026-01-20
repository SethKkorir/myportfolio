import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Experience from './Experience';
import Skills from './Skills';
import Projects from './Projects';
import Blog from './Blog';
import Contact from './Contact';
import Footer from './Footer';

const Home = () => {
    useEffect(() => {
        // Basic Intersection Observer for fade-in animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('section h2, .card, .timeline-item, .project-card, .blog-card').forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Navbar />
            <Hero />
            <About />
            <Experience />
            <Skills />
            <Projects />
            <Blog />
            <Contact />
            <Footer />
        </>
    );
};

export default Home;
