import React from 'react';
import { motion } from 'framer-motion';
import { Code, Server, Database, GraduationCap, Laptop, Cpu, Globe, Rocket } from 'lucide-react';

const icons = {
  Code, Server, Database, GraduationCap, Laptop, Cpu, Globe, Rocket
};

const DEFAULT_CARDS = [
  {
    icon: 'Code',
    title: 'Frontend Development',
    desc: 'Building clean, responsive and interactive UIs using HTML, CSS, JavaScript and React — focused on accessibility and user experience.',
    span: true,
    color: '#6366f1',
  },
  {
    icon: 'Server',
    title: 'Backend Development',
    desc: 'Building RESTful APIs and server-side logic using Node.js and Express, integrated with MongoDB.',
    span: false,
    color: '#10b981',
  },
  {
    icon: 'Database',
    title: 'Database & APIs',
    desc: 'Designing data schemas with MongoDB and documenting APIs using Postman.',
    span: false,
    color: '#f59e0b',
  },
  {
    icon: 'GraduationCap',
    title: 'Always Learning',
    desc: 'Currently deepening my knowledge in Applied Computer Science at Daystar University — bridging academic theory with real-world projects.',
    span: true,
    color: '#ec4899'
  },
];

const About = () => {
  const [aboutText, setAboutText] = React.useState("A highly motivated Applied Computer Science student at Daystar University, skilled in the MERN stack, APIs and version control. Passionate about building accessible, user-friendly technology.");
  const [aboutCards, setAboutCards] = React.useState(DEFAULT_CARDS);

  React.useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch('/api/admin/portfolio-content');
        if (res.ok) {
          const data = await res.json();
          if (data.about) {
            if (data.about.text) setAboutText(data.about.text);
            if (data.about.cards && data.about.cards.length > 0) setAboutCards(data.about.cards);
          }
        }
      } catch (err) {
        // Fallback to local storage if backend fails
        const localContent = localStorage.getItem('portfolioContent');
        if (localContent) {
          try {
            const parsed = JSON.parse(localContent);
            if (parsed.about) {
                if (parsed.about.text) setAboutText(parsed.about.text);
                if (parsed.about.cards) setAboutCards(parsed.about.cards);
            }
          } catch(e) {}
        }
      }
    };
    fetchAbout();
  }, []);

  const getIcon = (iconName) => {
      const IconComp = icons[iconName] || Code;
      return <IconComp size={22} />;
  }

  return (
    <section id="about">
      <div className="container">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="gradient-text">About Me</h2>
          <p>{aboutText}</p>
        </motion.div>

      <div className="bento-grid">
        {aboutCards.map((card, i) => (
          <motion.div
            key={i}
            className={`bento-card ${card.span ? 'span-2' : ''}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="bento-card-icon" style={{ color: card.color, background: `${card.color}15`, border: `1px solid ${card.color}30` }}>
              {getIcon(card.icon)}
            </div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
  );
};

export default About;
