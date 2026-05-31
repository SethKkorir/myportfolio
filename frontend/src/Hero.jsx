import React from 'react';
import { motion } from 'framer-motion';
import { Download, ChevronRight, Github, Linkedin, Mail, Twitter, Code, Database, Cpu, Globe, Folder, Clock, Layout, Users } from 'lucide-react';

const Hero = () => {
  const [content, setContent] = React.useState({
    greeting: "Hello, I'm",
    name: "Seth Kipchumba Korir",
    title: "Full Stack Developer",
    tagline: "Applied Computer Science Student at Daystar University & Junior Web Developer with hands-on experience in the MERN stack and REST API development.",
    profilePhoto: "",
    socials: [
      { id: 1, platform: "GitHub", href: "https://github.com/SethKkorir" },
      { id: 2, platform: "LinkedIn", href: "https://www.linkedin.com/in/seth-korir-7b9416279/" },
      { id: 3, platform: "Twitter", href: "https://x.com/Kipchumba_sk" }
    ]
  });

  const [stats, setStats] = React.useState({
    projects: "0+",
    experience: "0+",
    technologies: "0+",
    clients: "0+"
  });

  React.useEffect(() => {
    const fetchContent = async () => {
      try {
        // 1. Fetch main portfolio content for socials & testimonials
        const res = await fetch('/api/admin/portfolio-content');
        if (res.ok) {
          const data = await res.json();
          if (data.hero) {
            setContent(prev => ({
              ...prev,
              greeting: data.hero.greeting || prev.greeting,
              name: data.hero.name || prev.name,
              title: data.hero.title || prev.title,
              tagline: data.hero.tagline || prev.tagline,
              profilePhoto: data.hero.profilePhoto || prev.profilePhoto,
              socials: data.socials || prev.socials
            }));
          }
          if (Array.isArray(data.testimonials)) {
            setStats(prev => ({
              ...prev,
              clients: `${data.testimonials.length}+`
            }));
          }
        }

        // 2. Fetch projects count dynamically for stats
        const projRes = await fetch('/api/admin/projects');
        if (projRes.ok) {
          const projs = await projRes.json();
          if (Array.isArray(projs)) {
            setStats(prev => ({
              ...prev,
              projects: `${projs.length}+`
            }));
          }
        }

        // 3. Fetch skills count dynamically for stats
        const skillRes = await fetch('/api/admin/skills');
        if (skillRes.ok) {
          const skillsList = await skillRes.json();
          if (Array.isArray(skillsList)) {
            setStats(prev => ({
              ...prev,
              technologies: `${skillsList.length}+`
            }));
          }
        }

        // 4. Fetch resume years/entries dynamically for stats
        const resumeRes = await fetch('/api/admin/resume');
        if (resumeRes.ok) {
          let resumeData = await resumeRes.json();
          if (Array.isArray(resumeData)) resumeData = resumeData[0] || {};
          if (Array.isArray(resumeData.experience)) {
            const expYears = Math.max(1, resumeData.experience.length);
            setStats(prev => ({
              ...prev,
              experience: `${expYears}+`
            }));
          }
        }
      } catch (e) {
        // Fallback
        const localContent = localStorage.getItem('portfolioContent');
        if (localContent) {
          try {
            const parsed = JSON.parse(localContent);
            if (parsed.hero) {
              setContent(prev => ({
                ...prev,
                greeting: parsed.hero.greeting || prev.greeting,
                name: parsed.hero.name || prev.name,
                title: parsed.hero.title || prev.title,
                tagline: parsed.hero.tagline || prev.tagline,
                socials: parsed.socials || prev.socials
              }));
            }
            if (Array.isArray(parsed.testimonials)) {
              setStats(prev => ({
                ...prev,
                clients: `${parsed.testimonials.length}+`
              }));
            }
          } catch(err) {}
        }
        
        const cachedSkills = localStorage.getItem('localSkills');
        if (cachedSkills) {
          try {
            const parsed = JSON.parse(cachedSkills);
            if (Array.isArray(parsed)) {
              setStats(prev => ({
                ...prev,
                technologies: `${parsed.length}+`
              }));
            }
          } catch(err) {}
        }

        const cachedProjects = localStorage.getItem('localProjects');
        if (cachedProjects) {
          try {
            const parsed = JSON.parse(cachedProjects);
            if (Array.isArray(parsed)) {
              setStats(prev => ({
                ...prev,
                projects: `${parsed.length}+`
              }));
            }
          } catch(err) {}
        }

        const cachedResume = localStorage.getItem('resumeJSON');
        if (cachedResume) {
          try {
            const parsed = JSON.parse(cachedResume);
            if (Array.isArray(parsed.experience)) {
              setStats(prev => ({
                ...prev,
                experience: `${Math.max(1, parsed.experience.length)}+`
              }));
            }
          } catch(err) {}
        }
      }
    };
    fetchContent();
  }, []);

  const getIcon = (platform) => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return <Github size={20} />;
    if (p.includes('linkedin')) return <Linkedin size={20} />;
    if (p.includes('twitter') || p.includes('x.com')) return <Twitter size={20} />;
    return <Mail size={20} />;
  };

  // Helper to split name
  const nameParts = content.name.split(' ');
  const firstName = nameParts.slice(0, -1).join(' ') || "Seth";
  const lastName = nameParts.slice(-1).join(' ') || "Korir";

  return (
    <section id="home" className="hero" style={{ padding: '140px 0 60px' }}>
      <div className="container">
        <div className="hero-grid">
          
          {/* Left Column */}
          <motion.div 
            className="hero-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >

            <h1 style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)', fontWeight: 900, lineHeight: 1.15, margin: 0 }}>
              {firstName} <span style={{ color: 'var(--accent-blue)' }}>{lastName}</span>
              <br />
              <span className="gradient-text" style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' }}>{content.title || "Full Stack Developer"}</span>
            </h1>

            <p className="hero-sub" style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              {content.tagline}
            </p>

            <div className="hero-btns" style={{ display: 'flex', gap: '1rem', margin: 0 }}>
              <a href="#projects" className="btn-primary btn-gradient" style={{ borderRadius: '50px' }}>
                View Projects
              </a>
              <a href="/resume" className="btn-outline" style={{ borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Download size={16} /> Download Resume
              </a>
            </div>

            <div className="hero-socials" style={{ display: 'flex', gap: '1.25rem', marginTop: '0.5rem' }}>
              {content.socials?.map((s, idx) => (
                <a key={s.id || s._id || `social-${idx}`} href={s.href} target="_blank" rel="noopener noreferrer" style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {getIcon(s.platform)}
                </a>
              ))}
              <a key="mail-contact" href="#contact" style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Mail size={20} />
              </a>
            </div>
          </motion.div>

          {/* Right Column - Orbit System */}
          <motion.div 
            className="hero-right"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="purple-glow"></div>
            
            <div className="orbit-container">
              {/* Central Profile Circle with Silhouette or Image */}
              <div className="profile-circle" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {content.profilePhoto ? (
                  <img 
                    src={content.profilePhoto} 
                    alt={content.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <svg className="profile-silhouette" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'rgba(99, 102, 241, 0.25)', width: '80%', height: '80%', margin: '10%' }}>
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>

              {/* Orbit Ring 1 (Inner) */}
              <div className="orbit-ring orbit-ring-1">
                <div className="orbit-icon" style={{ top: 0, left: '50%', transform: 'translate(-50%, -50%)', color: '#6366f1' }}>
                  <Cpu size={18} />
                </div>
                <div className="orbit-icon" style={{ bottom: 0, left: '50%', transform: 'translate(-50%, 50%)', color: '#10b981' }}>
                  <Database size={18} />
                </div>
              </div>

              {/* Orbit Ring 2 (Outer) */}
              <div className="orbit-ring orbit-ring-2">
                <div className="orbit-icon" style={{ top: '50%', left: 0, transform: 'translate(-50%, -50%)', color: '#f59e0b' }}>
                  <Globe size={18} />
                </div>
                <div className="orbit-icon" style={{ top: '50%', right: 0, transform: 'translate(50%, -50%)', color: '#ec4899' }}>
                  <Code size={18} />
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Spanning Statistics Row */}
        <motion.div 
          className="stats-grid-row"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="stat-card-premium">
            <div className="stat-icon-wrapper"><Folder size={20} /></div>
            <div className="stat-info-wrapper">
              <span className="stat-number">{stats.projects}</span>
              <span className="stat-label">Projects Completed</span>
            </div>
          </div>
          <div className="stat-card-premium">
            <div className="stat-icon-wrapper"><Clock size={20} /></div>
            <div className="stat-info-wrapper">
              <span className="stat-number">{stats.experience}</span>
              <span className="stat-label">Years of Experience</span>
            </div>
          </div>
          <div className="stat-card-premium">
            <div className="stat-icon-wrapper"><Cpu size={20} /></div>
            <div className="stat-info-wrapper">
              <span className="stat-number">{stats.technologies}</span>
              <span className="stat-label">Technologies Mastered</span>
            </div>
          </div>
          <div className="stat-card-premium">
            <div className="stat-icon-wrapper"><Users size={20} /></div>
            <div className="stat-info-wrapper">
              <span className="stat-number">{stats.clients}</span>
              <span className="stat-label">Happy Clients</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
