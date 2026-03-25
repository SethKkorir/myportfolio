import React from 'react';
import { motion } from 'framer-motion';
import { Download, ChevronRight, Github, Linkedin, Mail, Code, GraduationCap, Coffee, Laptop } from 'lucide-react';

const floatingIcons = [
  { Icon: Code,         color: '#6366f1', style: { top: '18%', left: '8%'    } },
  { Icon: GraduationCap, color: '#10b981', style: { top: '22%', right: '10%' } },
  { Icon: Coffee,       color: '#f59e0b', style: { bottom: '28%', left: '10%' } },
  { Icon: Laptop,       color: '#ec4899', style: { bottom: '22%', right: '8%' } },
];

const Hero = () => {
  const [content, setContent] = React.useState({
    greeting: "Hello, I'm",
    name: "Seth Kipchumba Korir",
    tagline: "Applied Computer Science Student at Daystar University & Junior Web Developer with hands-on experience in the MERN stack and REST API development.",
    socials: [
      { id: 1, platform: "GitHub", href: "https://github.com/SethKkorir", icon: "Github" },
      { id: 2, platform: "LinkedIn", href: "https://www.linkedin.com/in/seth-korir-7b9416279/", icon: "Linkedin" }
    ]
  });

  React.useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/admin/portfolio-content');
        if (res.ok) {
          const data = await res.json();
          if (data.hero) {
            setContent(prev => ({
              ...prev,
              greeting: data.hero.greeting || prev.greeting,
              name: data.hero.name || prev.name,
              tagline: data.hero.tagline || prev.tagline,
              socials: data.socials || prev.socials
            }));
          }
        }
      } catch (e) {
        // Fallback to local storage if backend fails
        const localContent = localStorage.getItem('portfolioContent');
        if (localContent) {
          try {
            const parsed = JSON.parse(localContent);
            if (parsed.hero) {
              setContent(prev => ({
                ...prev,
                greeting: parsed.hero.greeting || prev.greeting,
                name: parsed.hero.name || prev.name,
                tagline: parsed.hero.tagline || prev.tagline,
                socials: parsed.socials || prev.socials
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
    if (p.includes('github')) return <Github size={22} />;
    if (p.includes('linkedin')) return <Linkedin size={22} />;
    return <Mail size={22} />;
  };

  return (
    <section id="home" className="hero">
      {floatingIcons.map(({ Icon, color, style }, i) => (
        <motion.div
          key={i}
          className="float-icon"
          style={{ ...style, color }}
          animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Icon size={40} />
        </motion.div>
      ))}

      <div className="container">
        <div className="hero-inner">


          <motion.span
            className="hero-tag"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {content.greeting}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {content.name.split(' ').slice(0, -1).join(' ')}<br />
            <span className="accent">{content.name.split(' ').slice(-1)}</span>
          </motion.h1>

          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
          >
            {content.tagline}
          </motion.p>

        <motion.div
          className="hero-btns"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <a href="/resume" className="btn-primary">
            <Download size={18} /> View Resume
          </a>
          <a href="#contact" className="btn-outline">
            Contact Me <ChevronRight size={18} />
          </a>
        </motion.div>

        <motion.div
          className="hero-socials"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {content.socials?.map(s => (
            <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer">
              {getIcon(s.platform)}
            </a>
          ))}
        </motion.div>
      </div>
    </div>

    <div className="scroll-indicator">
      <div className="scroll-line" />
    </div>
  </section>
  );
};

export default Hero;
