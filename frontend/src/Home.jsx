import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Experience from './Experience';
import Skills from './Skills';

import Projects from './Projects';
import Blog from './Blog';
import Contact from './Contact';
import Footer from './Footer';

const Home = () => (
  <>
    <div className="ambient-top" />
    <div className="ambient-bottom" />
    <Navbar />
    <main>
      <Hero />
      <About />
      <Experience />
      <Skills />

      <Projects />
      <Blog />
      <Contact />
    </main>
    <Footer />
  </>
);

export default Home;
