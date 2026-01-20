import React from 'react';
import { motion } from 'framer-motion';

const Skills = () => {
    const [skills, setSkills] = React.useState([]);

    React.useEffect(() => {
        fetch('/api/admin/skills')
            .then(res => res.json())
            .then(data => setSkills(data))
            .catch(err => console.error('Error fetching skills:', err));
    }, []);

    return (
        <section id="skills" className="skills">
            <div className="container">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    Technical Skills
                </motion.h2>
                <div className="skills-grid">
                    {skills.map((skill, index) => (
                        <motion.div
                            className="skill-item"
                            key={skill._id || index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <i className={`fab ${skill.icon || 'fa-code'} skill-icon`}></i>
                            <div className="skill-info">
                                <h3>{skill.name}</h3>
                                <div className="skill-bar-container">
                                    <motion.div
                                        className="skill-bar"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${skill.level}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                                    />
                                </div>
                                <p className="skill-percentage">{skill.level}%</p>
                            </div>
                        </motion.div>
                    ))}
                    {skills.length === 0 && <p style={{ textAlign: 'center', width: '100%', color: 'var(--text-light)' }}>Loading skills or none found...</p>}
                </div>
            </div>
        </section>
    );
};

export default Skills;
