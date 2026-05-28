import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, FolderGit, ArrowRight, Image as ImageIcon } from 'lucide-react';

const DEFAULT_PROJECTS = [
    {
        title: 'Rerendet Coffee – Digital Brand Platform',
        description: 'Designed and developed a modern coffee brand website to simulate a real-world business digital presence. Built the initial version using HTML, CSS, and JavaScript, then began transitioning to React.js for component-based development. Focused on responsive design, performance, and clean UI/UX.',
        category: 'Ongoing',
        techStack: ['HTML', 'CSS', 'JavaScript', 'React.js (Learning)', 'MERN (In Progress)'],
        githubLink: 'https://github.com/SethKkorir/rerendet_website',
        demoLink: 'https://rerendet-website-two.vercel.app/'
    },
    {
        title: 'E-Commerce Admin Dashboard',
        description: 'A full-featured analytics dashboard designed for managing products, tracking customer messages, and dynamically customizing front-facing components.',
        category: 'Fullstack',
        techStack: ['React', 'Node.js', 'Express', 'MongoDB'],
        githubLink: 'https://github.com/SethKkorir',
        demoLink: '#'
    }
];

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/admin/projects');
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setProjects(data);
                } else {
                    setProjects(DEFAULT_PROJECTS);
                }
            } catch (err) {
                console.error("Failed to fetch projects, using defaults:", err);
                setProjects(DEFAULT_PROJECTS);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    return (
        <section id="projects" className="projects relative overflow-hidden" style={{ padding: '100px 0' }}>
            <div className="container relative z-10">
                
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                        <div className="hero-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textTransform: 'none' }}>
                            <FolderGit size={14} style={{ color: 'var(--accent)' }} />
                            <span>FEATURED WORK</span>
                        </div>
                        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', fontWeight: 900, margin: 0, color: 'white' }}>
                          Projects
                        </h2>
                    </div>

                    <a 
                        href="https://github.com/SethKkorir?tab=repositories" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-outline"
                        style={{ borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '0.6rem 1.4rem', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                        View All Projects <ArrowRight size={16} />
                    </a>
                </div>

                {/* Grid */}
                <div className="relative min-h-[300px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center gap-4" style={{ minHeight: '300px' }}>
                            <div className="w-10 h-10 border-2 border-t-2 border-[rgba(255,255,255,0.1)] border-t-[var(--accent)] rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="projects-grid">
                            {projects.map((p, idx) => (
                                <motion.div
                                    key={p._id || idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                                    className="project-card flex flex-col h-full"
                                    style={{ background: 'rgba(9, 9, 20, 0.6)', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '1.25rem', overflow: 'hidden' }}
                                >
                                    {/* Media Box / Placeholder image vector */}
                                    <div className="project-placeholder-media">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '44px', height: '44px', color: 'rgba(255, 255, 255, 0.15)' }}>
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                    </div>

                                    {/* Body */}
                                    <div className="project-body flex flex-col flex-1" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                        <div>
                                            <span className="category-badge">
                                                {p.category}
                                            </span>
                                        </div>
                                        
                                        <h3 className="project-title line-clamp-1" style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'white' }}>
                                          {p.title}
                                        </h3>
                                        
                                        <p className="project-desc flex-1" style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
                                            {p.description}
                                        </p>
                                        
                                        {/* Action Links */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1rem' }}>
                                            {p.githubLink && (
                                                <a href={p.githubLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', transition: 'var(--transition)' }} className="hover:text-white">
                                                    <Github size={20} />
                                                </a>
                                            )}
                                            {p.demoLink && (
                                                <a href={p.demoLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', transition: 'var(--transition)' }} className="hover:text-white">
                                                    <ExternalLink size={20} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
};

export default Projects;
