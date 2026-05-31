import React from 'react';
import { motion } from 'framer-motion';
import { User, ArrowRight } from 'lucide-react';

const About = () => {
  const [aboutData, setAboutData] = React.useState({
    text: "A highly motivated Applied Computer Science student at Daystar University, skilled in the MERN stack, APIs and version control. Passionate about building accessible, user-friendly technology.",
    subText: "My technical journey is driven by solving complex problems with clean and modular code. Working with modern architectures allows me to bridge the gap between robust backend operations and highly interactive user experiences.",
    profilePhoto: ""
  });

  React.useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch('/api/admin/portfolio-content');
        if (res.ok) {
          const data = await res.json();
          if (data.about) {
            setAboutData({
              text: data.about.text || aboutData.text,
              subText: data.about.subText || aboutData.subText,
              profilePhoto: data.hero?.profilePhoto || ""
            });
          }
        }
      } catch (err) {
        // Fallback to local storage if backend fails
        const localContent = localStorage.getItem('portfolioContent');
        if (localContent) {
          try {
            const parsed = JSON.parse(localContent);
            if (parsed.about) {
              setAboutData(prev => ({
                ...prev,
                text: parsed.about.text || prev.text,
                subText: parsed.about.subText || prev.subText,
                profilePhoto: parsed.hero?.profilePhoto || ""
              }));
            }
          } catch(e) {}
        }
      }
    };
    fetchAbout();
  }, []);

  return (
    <section id="about" style={{ padding: '100px 0' }}>
      <div className="container">
        <div className="about-grid-split">
          
          {/* Left Column - Story Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1.5rem' }}
          >

            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, margin: 0, textAlign: 'left' }}>
              About <span style={{ color: 'var(--accent-blue)' }}>Me</span>
            </h2>

            <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)', textAlign: 'justify' }}>
              {aboutData.text}
            </p>

            {aboutData.subText && (
              <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-muted)', textAlign: 'justify' }}>
                {aboutData.subText}
              </p>
            )}

            <a href="/resume" className="btn-outline" style={{ borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>
              Read More About Me <ArrowRight size={16} />
            </a>
          </motion.div>

          {/* Right Column - Glowing Photo Frame */}
          <motion.div
            className="photo-frame-container"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="photo-frame" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="glow-spot glow-spot-left"></div>
              <div className="glow-spot glow-spot-right"></div>
              
              {aboutData.profilePhoto ? (
                <img 
                  src={aboutData.profilePhoto} 
                  alt="Seth Korir" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1.5rem' }} 
                />
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: 'rgba(99, 102, 241, 0.15)', width: '40%', height: '40%' }}>
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
