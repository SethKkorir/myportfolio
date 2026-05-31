import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Calendar, CheckCircle2, MapPin } from 'lucide-react';

const DEFAULT_ITEMS = [
  {
    type: 'work',
    title: 'Attachment Trainee',
    org: 'Techsavanna Company Limited',
    time: '2024',
    location: 'Kenya',
    details: [
      'Developed and integrated REST APIs into web applications',
      'Collaborated with developers to design and test backend systems',
      'Used Git for version control and Postman for API documentation',
      'Contributed to scalable backend solutions in an agile team',
    ],
  },
  {
    type: 'edu',
    title: 'Bachelor of Applied Computer Science',
    org: 'Daystar University',
    time: '2025 – Present',
    location: 'Nairobi, Kenya',
    details: [
      'MERN Stack Development',
      'Software Architecture',
      'Algorithms & Data Structures',
    ],
  },
  {
    type: 'edu',
    title: 'Diploma in ICT',
    org: 'Daystar University',
    time: '2023 – 2024',
    location: 'Nairobi, Kenya',
    details: [
      'Network Administration',
      'Database Management',
      'System Analysis',
    ],
  },
  {
    type: 'edu',
    title: 'Certificate in ICT',
    org: 'Daystar University',
    time: 'May 2022 – Nov 2022',
    location: 'Nairobi, Kenya',
    details: [
      'IT Fundamentals',
      'Web Development Basics',
    ],
  },
];

const typeConfig = {
  work: { color: '#6366f1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)', label: 'Experience', Icon: Briefcase },
  edu:  { color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', label: 'Education',  Icon: GraduationCap },
};

const Experience = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await fetch('/api/admin/resume');
        if (res.ok) {
          let data = await res.json();
          if (Array.isArray(data)) data = data[0] || {};
          
          const dynamicItems = [];
          
          // Map Work Experience
          if (Array.isArray(data.experience) && data.experience.length > 0) {
            data.experience.forEach(exp => {
              dynamicItems.push({
                type: 'work',
                title: exp.role || 'Operational Role',
                org: exp.org || 'Entity',
                time: exp.time || 'Timeline',
                location: 'Kenya',
                details: Array.isArray(exp.points) ? exp.points.filter(p => p.trim() !== '') : [],
              });
            });
          }
          
          // Map Education
          if (Array.isArray(data.education) && data.education.length > 0) {
            data.education.forEach(edu => {
              dynamicItems.push({
                type: 'edu',
                title: edu.degree || 'Academic Program',
                org: edu.school || 'Institution',
                time: edu.time || 'Timeline',
                location: 'Nairobi, Kenya',
                details: [],
              });
            });
          }
          
          if (dynamicItems.length > 0) {
            // Sort by time or structural index. Let's keep original order (work first then edu, or reverse chronological)
            setItems(dynamicItems);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch experience, using defaults:", err);
      }
      
      // Fallback to local storage
      const cachedResume = localStorage.getItem('resumeJSON');
      if (cachedResume) {
        try {
          const data = JSON.parse(cachedResume);
          const dynamicItems = [];
          if (Array.isArray(data.experience)) {
            data.experience.forEach(exp => {
              dynamicItems.push({
                type: 'work',
                title: exp.role,
                org: exp.org,
                time: exp.time,
                location: 'Kenya',
                details: Array.isArray(exp.points) ? exp.points.filter(p => p.trim() !== '') : [],
              });
            });
          }
          if (Array.isArray(data.education)) {
            data.education.forEach(edu => {
              dynamicItems.push({
                type: 'edu',
                title: edu.degree,
                org: edu.school,
                time: edu.time,
                location: 'Nairobi, Kenya',
                details: [],
              });
            });
          }
          if (dynamicItems.length > 0) {
            setItems(dynamicItems);
            setLoading(false);
            return;
          }
        } catch(e) {}
      }
      
      setItems(DEFAULT_ITEMS);
      setLoading(false);
    };
    fetchExperience();
  }, []);

  return (
    <section id="experience" style={{ padding: '100px 0' }}>
      <div className="container">
        <motion.div
          className="section-head mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-7xl font-black font-heading text-text-primary tracking-tight mb-6">
            Experience & <span className="gradient-text">Education</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-secondary leading-relaxed font-bold">
            My journey from foundational ICT studies to building high-performance full-stack web applications.
          </p>
        </motion.div>

        {/* Legend */}
        <motion.div
          style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '4rem', flexWrap: 'wrap' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {Object.entries(typeConfig).map(([key, cfg]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, fontSize: '0.85rem', color: cfg.color }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }} />
              {cfg.label}
            </div>
          ))}
        </motion.div>

        <div className="timeline">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="tl-item animate-pulse opacity-40">
                <div className="tl-blank" />
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '1.5rem' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', bg: '#6366f1' }} />
                </div>
                <div className="tl-right">
                  <div className="glass p-8 rounded-3xl min-h-[150px] w-full bg-white/5" />
                </div>
              </div>
            ))
          ) : (
            items.map((item, i) => {
              const cfg = typeConfig[item.type];
              const isLeft = i % 2 === 0;

              const card = (
                <motion.div
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  style={{
                    background: cfg.bg,
                    border: `1px solid ${cfg.border}`,
                    borderRadius: '1.5rem',
                    padding: '1.75rem 2rem',
                    backdropFilter: 'blur(12px)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  whileHover={{ y: -4, boxShadow: `0 20px 40px rgba(0,0,0,0.25)` }}
                >
                  {/* Top accent line */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    height: '3px',
                    background: `linear-gradient(90deg, ${cfg.color}, transparent)`,
                  }} />

                  {/* Type badge */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.3rem 0.85rem', borderRadius: '50px',
                    background: `${cfg.color}20`, border: `1px solid ${cfg.color}40`,
                    fontSize: '0.7rem', fontWeight: 800,
                    color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.1em',
                    marginBottom: '1rem',
                  }}>
                    <cfg.Icon size={13} />
                    {cfg.label}
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: '1.25rem', fontWeight: 800,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '-0.02em',
                    marginBottom: '0.4rem',
                    lineHeight: 1.3,
                  }}>
                    {item.title}
                  </h3>

                  {/* Org */}
                  <p style={{ color: cfg.color, fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                    {item.org}
                  </p>

                  {/* Meta row */}
                  <div style={{
                    display: 'flex', gap: '1.25rem', alignItems: 'center',
                    fontSize: '0.78rem', color: 'var(--text-muted)',
                    fontWeight: 600, marginBottom: '1.25rem',
                    flexWrap: 'wrap',
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={13} /> {item.time}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={13} /> {item.location}
                    </span>
                  </div>

                  {/* Details */}
                  {item.details.length > 0 && (
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {item.details.map((d, j) => (
                        <li key={j} style={{
                          display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
                          color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6,
                        }}>
                          <CheckCircle2 size={15} style={{ color: cfg.color, flexShrink: 0, marginTop: '0.15rem' }} />
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              );

              return (
                <div key={i} className="tl-item">
                  {isLeft ? <div className="tl-left">{card}</div> : <div className="tl-blank" />}

                  {/* Dot */}
                  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '1.5rem' }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      background: cfg.color,
                      border: `4px solid var(--bg-main)`,
                      boxShadow: `0 0 0 3px ${cfg.color}50, 0 0 20px ${cfg.color}60`,
                      position: 'relative', zIndex: 1,
                    }} />
                  </div>

                  {!isLeft ? <div className="tl-right">{card}</div> : <div className="tl-blank" />}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Experience;
