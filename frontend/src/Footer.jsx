import React from 'react';
import { Github, Linkedin, Twitter, Instagram, Mail, ArrowUp, Heart } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <a href="#home" className="footer-logo">SK.</a>
            <p className="footer-desc">
              Crafting high-performance digital products from the heart of Kenya.
              Built with precision, powered by coffee and curiosity.
            </p>
          </div>

          <div className="footer-col">
            <h4>Navigate</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#skills">Skills</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Connect</h4>
            <ul>
              <li><a href="https://github.com/SethKkorir" target="_blank">GitHub</a></li>
              <li><a href="https://www.linkedin.com/in/seth-korir-7b9416279/" target="_blank">LinkedIn</a></li>
              <li><a href="https://x.com/Kipchumba_sk" target="_blank">Twitter</a></li>
              <li><a href="mailto:zsethkipchumba179@gmail.com">Email Me</a></li>
              <li><a href="https://medium.com/@kipzseth" target="_blank">Medium</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">
            &copy; {year} Seth Kipchumba Korir
          </div>
          <button
            className="scroll-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            title="Back to top"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
