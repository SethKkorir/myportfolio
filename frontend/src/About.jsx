import React from 'react';
import { motion } from 'framer-motion';
import { Code, Server, Database, GraduationCap } from 'lucide-react';

const cards = [
  {
    Icon: Code,
    title: 'Frontend Development',
    desc: 'Building clean, responsive and interactive UIs using HTML, CSS, JavaScript and React — focused on accessibility and user experience.',
    tags: ['React', 'JavaScript', 'CSS'],
    span: true,
    color: '#6366f1',
  },
  {
    Icon: Server,
    title: 'Backend Development',
    desc: 'Building RESTful APIs and server-side logic using Node.js and Express, integrated with MongoDB.',
    tags: [],
    span: false,
    color: '#10b981',
  },
  {
    Icon: Database,
    title: 'Database & APIs',
    desc: 'Designing data schemas with MongoDB and documenting APIs using Postman.',
    tags: [],
    span: false,
    color: '#f59e0b',
  },
  {
    Icon: GraduationCap,
    title: 'Always Learning',
    desc: 'Currently deepening my knowledge in Applied Computer Science at Daystar University — bridging academic theory with real-world projects.',
    tags: [],
    span: true,
    color: '#ec4899',
    stats: [
      { num: '2026', lbl: 'Graduation' },
      { num: 'MERN', lbl: 'Stack Focus' },
    ],
  },
];

const About = () => {
  const [aboutText, setAboutText] = React.useState("A highly motivated Applied Computer Science student at Daystar University, skilled in the MERN stack, APIs and version control. Passionate about building accessible, user-friendly technology.");

  React.useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch('/api/admin/portfolio-content');
        if (res.ok) {
          const data = await res.json();
          if (data.about?.content) {
            setAboutText(data.about.content);
            return;
          }
        }
      } catch (err) {}

      // Fallback
      const localContent = localStorage.getItem('portfolioContent');
      if (localContent) {
        try {
          const parsed = JSON.parse(localContent);
          if (parsed.about?.content) setAboutText(parsed.about.content);
        } catch(e) {}
      }
    };
    fetchAbout();
  }, []);

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
        {cards.map((card, i) => (
          <motion.div
            key={i}
            className={`bento-card ${card.span ? 'span-2' : ''}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="bento-card-icon" style={{ color: card.color, background: `${card.color}15`, border: `1px solid ${card.color}30` }}>
              <card.Icon size={22} />
            </div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
            {card.tags?.length > 0 && (
              <div className="tag-row">
                {card.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            )}
            {card.stats && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
                {card.stats.map(s => (
                  <div key={s.lbl} className="stat-box" style={{ flex: 1 }}>
                    <div className="num">{s.num}</div>
                    <div className="lbl">{s.lbl}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
  );
};

export default About;
