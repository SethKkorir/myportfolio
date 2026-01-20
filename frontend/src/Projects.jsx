import React from 'react';
import { motion } from 'framer-motion';

const Projects = () => {
    const [projects, setProjects] = React.useState([]);

    React.useEffect(() => {
        fetch('/api/admin/projects')
            .then(res => res.json())
            .then(data => setProjects(data))
            .catch(err => console.error('Error fetching projects:', err));
    }, []);

    return (
        <section id="projects" className="projects">
            <div className="container">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    Projects
                </motion.h2>
                <div className="projects-grid">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project._id || index}
                            className="project-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            whileHover={{ y: -10 }}
                        >
                            {project.image && (
                                <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                                    <img src={project.image} alt={project.title} title="Click to view live demo" />
                                </a>
                            )}
                            <div className="project-content">
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>
                                {project.techStack && project.techStack.length > 0 && (
                                    <div className="tech-stack" style={{ marginBottom: '1rem' }}>
                                        {project.techStack.map((tech, i) => (
                                            <span key={i} style={{ display: 'inline-block', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary-color)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', marginRight: '0.5rem', marginBottom: '0.5rem' }}>{tech}</span>
                                        ))}
                                    </div>
                                )}
                                <div className="project-links">
                                    {project.githubLink && (
                                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn icon-btn">
                                            <i className="fab fa-github"></i> GitHub
                                        </a>
                                    )}
                                    {project.demoLink && (
                                        <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="btn icon-btn">
                                            <i className="fas fa-external-link-alt"></i> Live Demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {projects.length === 0 && <p style={{ textAlign: 'center', width: '100%', color: 'var(--text-light)' }}>Loading projects or none found...</p>}
                </div>
            </div>
        </section>
    );
};

export default Projects;
