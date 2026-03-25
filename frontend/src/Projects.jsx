import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Filter, FolderGit } from 'lucide-react';

const DEFAULT_PROJECTS = [
    {
        title: 'Rerendet Coffee – Digital Brand Platform',
        description: 'Designed and developed a modern coffee brand website to simulate a real-world business digital presence. Built the initial version using HTML, CSS, and JavaScript, then began transitioning to React.js for component-based development. Currently learning and applying React.js concepts including components, props, and state management. Developing backend functionality using Node.js and Express as part of a MERN stack architecture. Focused on responsive design, performance, and clean UI/UX.',
        category: 'Ongoing',
        techStack: ['HTML', 'CSS', 'JavaScript', 'React.js (Learning)', 'MERN (In Progress)'],
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800',
        githubLink: 'https://github.com/SethKkorir/rerendet_website',
        demoLink: 'https://rerendet-website-two.vercel.app/'
    }
];

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [activeFilter, setActiveFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    const categories = ['All', 'Fullstack', 'Frontend', 'Backend', 'Ongoing'];

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/admin/projects');
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setProjects(data);
                    setFilteredProjects(data);
                } else {
                    setProjects(DEFAULT_PROJECTS);
                    setFilteredProjects(DEFAULT_PROJECTS);
                }
            } catch (err) {
                console.error("Failed to fetch projects, using defaults:", err);
                setProjects(DEFAULT_PROJECTS);
                setFilteredProjects(DEFAULT_PROJECTS);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const filterProjects = (cat) => {
        setActiveFilter(cat);
        if (cat === 'All') {
            setFilteredProjects(projects);
        } else {
            setFilteredProjects(projects.filter(p => p.category === cat));
        }
    };

    return (
        <section id="projects" className="projects relative overflow-hidden">
            <div className="ambient-top"></div>
            <div className="ambient-bottom"></div>
            
            <div className="container relative z-10">
                <div className="section-head">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="hero-tag inline-flex items-center gap-2 mb-4"
                    >
                        <FolderGit size={14} />
                        <span>Project Showroom</span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Crafting <span className="accent">Systems</span> <br/>
                        & Experiences
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        A selection of high-impact digital products crafted with architectural precision and a focus on user-centric performance.
                    </motion.p>
                </div>

                {/* Filter Bar */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-3 mb-16"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => filterProjects(cat)}
                            className={`px-6 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 border ${
                                activeFilter === cat 
                                    ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-[0_10px_20px_var(--accent-glow)]' 
                                    : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                <div className="relative min-h-[400px]">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                <div className="w-12 h-12 border-4 border-[var(--text-muted)] border-t-[var(--accent)] rounded-full animate-spin"></div>
                                <div className="text-[var(--text-muted)] font-bold text-sm tracking-widest uppercase">
                                    Loading Repositories...
                                </div>
                            </div>
                        ) : (
                            <motion.div 
                                className="projects-grid"
                                layout
                            >
                                {filteredProjects.map((p, idx) => (
                                    <motion.div
                                        key={p._id || idx}
                                        layout
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                                        className="project-card flex flex-col h-full"
                                    >
                                        <div className="project-img-wrap block shrink-0">
                                            <img 
                                                src={p.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800'} 
                                                alt={p.title} 
                                                className="project-img" 
                                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800' }}
                                            />
                                            <div className="project-overlay">
                                                {p.githubLink && (
                                                    <a href={p.githubLink} target="_blank" rel="noopener noreferrer" className="project-link-btn" aria-label="Github repo">
                                                        <Github size={20} />
                                                    </a>
                                                )}
                                                {p.demoLink && (
                                                    <a href={p.demoLink} target="_blank" rel="noopener noreferrer" className="project-link-btn" aria-label="Live demo">
                                                        <ExternalLink size={20} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <div className="project-body flex flex-col flex-1">
                                            <div className="mb-2">
                                                <span className="project-badge">
                                                    {p.category}
                                                </span>
                                            </div>
                                            <h3 className="project-title line-clamp-1">{p.title}</h3>
                                            <p className="project-desc flex-1">
                                                {p.description}
                                            </p>
                                            
                                            <div className="project-tags mt-4">
                                                {(Array.isArray(p.techStack) ? p.techStack : (p.techStack || '').split(',')).map((t, i) => (
                                                    <span key={i} className="project-tag">
                                                        {t.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!loading && filteredProjects.length === 0 && (
                        <div className="py-20 text-center space-y-4">
                            <p className="text-[var(--text-muted)] text-lg font-bold">No projects found in this category.</p>
                            <button onClick={() => filterProjects('All')} className="text-[var(--accent)] font-bold hover:underline">Return to All</button>
                        </div>
                    )}
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 text-center"
                >
                    <a 
                        href="https://github.com/SethKkorir?tab=repositories" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-outline"
                    >
                        <Github size={18} /> 
                        View GitHub Archive
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;
