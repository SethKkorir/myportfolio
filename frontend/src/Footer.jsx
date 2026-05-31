import React from 'react';
import { Github, Linkedin, Twitter, Instagram, Mail, ArrowUp, Heart } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();
  const [socials, setSocials] = React.useState([
    { platform: "GitHub", href: "https://github.com/SethKkorir" },
    { platform: "LinkedIn", href: "https://www.linkedin.com/in/seth-korir-7b9416279/" },
    { platform: "Twitter", href: "https://x.com/Kipchumba_sk" }
  ]);

  React.useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/admin/portfolio-content');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.socials) && data.socials.length > 0) {
            setSocials(data.socials);
          }
        }
      } catch (err) {}
    };
    fetchContent();
  }, []);

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
              {socials.map((s, idx) => (
                <li key={idx}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.platform}
                  </a>
                </li>
              ))}
              <li><a href="mailto:zsethkipchumba179@gmail.com">Email Me</a></li>
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
