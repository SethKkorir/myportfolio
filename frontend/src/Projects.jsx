import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Sparkles, FolderGit, Filter, Search } from 'lucide-react';

const DEFAULT_PROJECTS = [
    {
        title: 'Rerendet Coffee Platform',
        description: 'A full-stack coffee platform built to deliver a seamless digital experience, combining product showcase, brand storytelling, and smooth user interaction.',
        category: 'Fullstack',
        techStack: ['MongoDB', 'Express', 'React', 'Node.js'],
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800',
        githubLink: 'https://github.com/SethKkorir/rerendet_website',
        demoLink: 'https://rerendet-website-two.vercel.app/'
    }
];

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <section id="projects" className="relative">
            <div className="container">
                <div className="section-head mb-16">
                    <h2 className="gradient-text">Project</h2>
                    <p>A selection of high-impact digital products crafted with precision and purpose.</p>
                </div>

                <div className="flex justify-center">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
                                <p className="text-text-muted font-bold animate-pulse">Synchronizing Repositories...</p>
                            </div>
                        ) : filteredProjects.length === 1 ? (
                            filteredProjects.map((p, i) => (
                                <motion.div
                                    key={p._id || i}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="project-card max-w-[340px] w-full group overflow-hidden bg-bg-secondary/30 glass rounded-[1rem] border border-white/5 shadow-2xl transition-all duration-500 mx-auto"
                                >
                                    <div className="project-img-wrap aspect-video relative overflow-hidden">
                                        <img 
                                            src={p.image || '/assets/placeholder.jpg'} 
                                            alt={p.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800' }}
                                        />
                                        <div className="project-overlay absolute inset-0 bg-bg-main/60 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm">
                                            <a href={p.githubLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center hover:scale-110 transition-transform shadow-glow">
                                                <Github size={18} />
                                            </a>
                                            <a href={p.demoLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white text-bg-main flex items-center justify-center hover:scale-110 transition-transform">
                                                <ExternalLink size={18} />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="p-6 text-center">
                                        <div className="space-y-3">
                                            <div className="flex justify-center items-center">
                                                <span className="bg-accent/10 border border-accent/20 px-3 py-0.5 rounded-full text-[7px] font-black uppercase text-accent tracking-widest flex items-center gap-1">
                                                    <Sparkles size={8} /> Live
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-black font-heading tracking-tight text-text-primary group-hover:text-accent transition-colors">
                                                {p.title}
                                            </h3>
                                            <p className="text-text-secondary text-[13px] line-clamp-2 leading-relaxed opacity-75">
                                                {p.description}
                                            </p>
                                            <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                                                {(p.techStack || []).map(t => (
                                                    <span key={t} className="px-2.5 py-1 bg-white/[0.03] border border-white/5 rounded-lg text-[9px] font-bold text-text-muted">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex gap-2 pt-4">
                                                <a href={p.demoLink} target="_blank" rel="noopener noreferrer" className="flex-1 btn-modern btn-primary py-3 px-4 flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[8px] shadow-glow active:scale-[0.97]">
                                                    <ExternalLink size={14} /> Demo
                                                </a>
                                                <a href={p.githubLink} target="_blank" rel="noopener noreferrer" className="flex-1 btn-modern bg-white/5 border border-white/10 py-3 px-4 flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[8px] hover:bg-white/10 active:scale-[0.97]">
                                                    <Github size={14} /> Code
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : filteredProjects.length > 1 ? (
                            <div className="projects-grid">
                                {filteredProjects.map((p, i) => (
                                    <motion.div
                                        layout
                                        key={p._id || i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.4 }}
                                        className="project-card group"
                                    >
                                        <div className="project-img-wrap aspect-video relative overflow-hidden bg-bg-secondary">
                                            <img 
                                                src={p.image || '/assets/placeholder.jpg'} 
                                                alt={p.title} 
                                                className="project-img w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800' }}
                                            />
                                            <div className="project-overlay absolute inset-0 bg-bg-main/80 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm">
                                                <a href={p.githubLink} target="_blank" rel="noopener noreferrer" className="project-link-btn w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center hover:scale-110 transition-transform">
                                                    <Github size={22} />
                                                </a>
                                                <a href={p.demoLink} target="_blank" rel="noopener noreferrer" className="project-link-btn w-12 h-12 rounded-full bg-white text-bg-main flex items-center justify-center hover:scale-110 transition-transform">
                                                    <ExternalLink size={22} />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="project-body p-6 flex flex-col gap-4">
                                            <div className="flex justify-between items-start">
                                                <h3 className="project-title text-2xl font-black font-heading tracking-tighter text-text-primary group-hover:text-accent transition-colors">{p.title}</h3>
                                                <div className="project-badge bg-accent/10 border border-accent/20 px-3 py-1 rounded-full text-[10px] font-black uppercase text-accent tracking-widest flex items-center gap-2">
                                                    <Sparkles size={10} /> Live
                                                </div>
                                            </div>
                                            <p className="project-desc text-text-secondary line-clamp-3 leading-relaxed font-medium">{p.description}</p>
                                            <div className="project-tags flex flex-wrap gap-2 mt-auto">
                                                {(p.techStack || []).map(t => (
                                                    <span key={t} className="project-tag px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-xs font-bold text-text-muted transition-colors hover:border-accent hover:text-accent">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="col-span-full text-center py-20 bg-bg-secondary/30 rounded-3xl border border-white/5 border-dashed">
                                <p className="text-text-muted font-bold lg text-lg">No projects match the current criteria.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-12 text-center no-print">
                    <a href="https://github.com/SethKkorir?tab=repositories" target="_blank" rel="noopener noreferrer" className="btn-modern btn-outline inline-flex items-center gap-3 py-4 px-8 font-black uppercase tracking-widest text-sm hover:translate-y-[-4px]">
                        <FolderGit size={20} /> View More on GitHub
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Projects;
