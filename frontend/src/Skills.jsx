import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Code2, Server, Database, Layers, Sparkles } from 'lucide-react';

const DEFAULT_SKILLS = [
  { name: 'HTML / CSS', level: 95, category: 'Frontend' },
  { name: 'JavaScript (ES6+)', level: 90, category: 'Frontend' },
  { name: 'React.js', level: 85, category: 'Frontend' },
  { name: 'Node.js / Express', level: 80, category: 'Backend' },
  { name: 'REST API Design', level: 85, category: 'Backend' },
  { name: 'MongoDB', level: 75, category: 'Database' },
  { name: 'Git & GitHub', level: 90, category: 'Tools' },
  { name: 'Postman', level: 85, category: 'Tools' },
  { name: 'npm', level: 80, category: 'Tools' },
];

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch('/api/admin/skills');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSkills(data);
        } else {
          setSkills(DEFAULT_SKILLS);
        }
      } catch (err) {
        console.error("Failed to fetch skills, using defaults:", err);
        setSkills(DEFAULT_SKILLS);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const skillGroups = [
    { name: 'Frontend', Icon: Code2, color: '#6366f1' },
    { name: 'Backend',  Icon: Server, color: '#10b981' },
    { name: 'Database', Icon: Database, color: '#f59e0b' },
    { name: 'Tools',    Icon: Layers,   color: '#ec4899' }
  ];

  return (
    <section id="skills" className="relative py-24">
      <div className="container px-6">
        <motion.div
          className="section-head mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-accent uppercase tracking-widest font-black text-xs mb-4 inline-block px-4 py-1.5 bg-accent/10 rounded-full border border-accent/20">
            Technical Stack
          </span>
          <h2 className="text-5xl md:text-7xl font-black font-heading text-text-primary tracking-tight mb-6">
            Core <span className="gradient-text">Competencies</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-secondary leading-relaxed font-bold">
            Leveraging modern engineering practices and a rigorous academic background at Daystar University to build scalable digital solutions.
          </p>
        </motion.div>

        <div className="skills-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="skill-group glass p-8 rounded-3xl border border-white/5 animate-pulse min-h-[300px]">
                <div className="w-12 h-12 bg-white/5 rounded-2xl mb-6"></div>
                <div className="w-32 h-6 bg-white/5 rounded-lg mb-8"></div>
                <div className="space-y-4">
                  <div className="w-full h-2 bg-white/5 rounded-full"></div>
                  <div className="w-full h-2 bg-white/5 rounded-full"></div>
                </div>
              </div>
            ))
          ) : (
            skillGroups.map((group, i) => (
              <motion.div
                key={group.name}
                className="skill-group glass p-8 rounded-3xl border border-white/5 hover:border-accent/40 transition-all duration-500 group relative overflow-hidden"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-all">
                  <group.Icon size={120} strokeWidth={0.5} style={{ color: group.color }} />
                </div>

                <div className="relative z-10">
                  <div 
                    className="skill-group-icon w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-glow transition-transform group-hover:rotate-12 group-hover:scale-110"
                    style={{ background: `${group.color}20`, color: group.color, border: `1px solid ${group.color}30` }}
                  >
                    <group.Icon size={28} strokeWidth={2.5} />
                  </div>
                  
                  <h3 className="text-2xl font-black font-heading text-text-primary mb-8 tracking-tighter flex items-center gap-2">
                    {group.name}
                    <Sparkles size={16} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>

                  <div className="skill-list space-y-8">
                    {skills
                      .filter(s => s.category?.toLowerCase() === group.name.toLowerCase())
                      .map((s, idx) => (
                        <div key={s._id || idx} className="skill-row">
                          <div className="skill-row-top flex justify-between items-center mb-3">
                            <span className="text-xs font-black uppercase tracking-widest text-text-muted group-hover:text-text-primary transition-colors">
                              {s.name}
                            </span>
                            <span className="text-[10px] font-black text-accent">{s.level}%</span>
                          </div>
                          <div className="skill-bar-bg h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1.5px]">
                            <motion.div
                              className="skill-bar-fill h-full rounded-full"
                              style={{ 
                                background: `linear-gradient(90deg, ${group.color}dd, ${group.color})`, 
                                boxShadow: `0 0 10px ${group.color}40` 
                              }}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${s.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.5, ease: "circOut", delay: 0.2 + (idx * 0.1) }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Skills;
