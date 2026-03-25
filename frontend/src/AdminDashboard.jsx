import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, LogOut, Plus, Edit2, Trash2, X, 
    Layers, Cpu, Settings, Monitor, Database, Terminal, 
    Cloud, Server, Code2, Wrench, FileText, Download, Briefcase,
    Sun, Moon
} from 'lucide-react';
import jsPDF from 'jspdf';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('projects');
    const [theme, setTheme] = useState(localStorage.getItem('admin-theme') || 'dark');
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [resumeData, setResumeData] = useState({
        name: '', title: '', summary: '',
        contact: { email: '', phone: '', location: '', github: '', linkedin: '' },
        experience: [], education: [], skills: { frontend: [], backend: [], tools: [] },
        projects: [], referees: []
    });
    const [resumeJSON, setResumeJSON] = useState('');
    const [token] = useState(localStorage.getItem('token'));
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('admin-theme', theme);
    }, [theme]);

    // Form States
    const [projectForm, setProjectForm] = useState({ 
        title: '', description: '', techStack: '', image: '', demoLink: '', githubLink: '', category: 'Fullstack' 
    });
    const [skillForm, setSkillForm] = useState({ name: '', level: 50, category: 'Frontend' });

    // Edit States
    const [editingProject, setEditingProject] = useState(null);
    const [editingSkill, setEditingSkill] = useState(null);

    // New Features: Cover Letter & Portfolio Content
    const [coverLetter, setCoverLetter] = useState(localStorage.getItem('coverLetter') || 'Dear Hiring Manager,\n\nI am writing to express my interest in the [Position Name] position at [Company Name]. With my background in Applied Computer Science and hands-on experience in MERN stack development, I am confident that I would be a valuable asset to your team.');
    const [portfolioContent, setPortfolioContent] = useState(() => {
        const cached = localStorage.getItem('portfolioContent');
        if (cached) {
            try { return JSON.parse(cached); } catch(e) {}
        }
        return {
            hero: {
                greeting: "Hello, I'm",
                name: "Seth Kipchumba Korir",
                tagline: "Building high-performance, scalable web systems with precision and purpose."
            },
            about: {
                text: "Motivated and detail-oriented computer science student with hands-on experience in full-stack web development using the MERN stack.",
                cards: [
                    { id: 1, icon: 'Code', title: 'Frontend Development', desc: 'Building clean, responsive and interactive UIs...', span: true, color: '#6366f1' },
                    { id: 2, icon: 'Server', title: 'Backend Development', desc: 'Building RESTful APIs and server-side logic...', span: false, color: '#10b981' }
                ]
            },

            testimonials: [
                { id: 1, name: "Dr. James Wilson", role: "Product Head", text: "Seth's attention to detail and ability to solve complex backend problems is outstanding." }
            ],
            contact: {
                phone: "+254 748 497 623",
                email: "zsethkipchumba179@gmail.com",
                location: "Bomet, Kenya 20400"
            },
            socials: [
                { id: 1, platform: "GitHub", href: "https://github.com/SethKkorir", icon: "Github" },
                { id: 2, platform: "LinkedIn", href: "https://www.linkedin.com/in/seth-korir-7b9416279/", icon: "Linkedin" }
            ]
        };
    });

    const updateContent = (section, field, value) => {
        setPortfolioContent(prev => ({
            ...prev,
            [section]: (prev[section] && !Array.isArray(prev[section]) && typeof prev[section] === 'object')
                ? { ...prev[section], [field]: value } 
                : value
        }));
    };

    const addPortfolioItem = (section) => {
        const newItem = section === 'testimonials' ? { id: Date.now(), name: '', role: '', text: '' } : 
                        section === 'socials' ? { id: Date.now(), platform: '', href: '', icon: 'Github' } : 
                        section === 'aboutCards' ? { id: Date.now(), icon: 'Code', title: '', desc: '', span: false, color: '#6366f1' } : {};

        setPortfolioContent(prev => ({
            ...prev,
            [section]: [...(prev[section] || []), newItem]
        }));
    };

    const updatePortfolioItem = (section, id, field, value) => {
        setPortfolioContent(prev => {
            if (section === 'aboutCards') {
                return { ...prev, about: { ...prev.about, cards: prev.about.cards.map(item => item.id === id ? { ...item, [field]: value } : item) }};
            }
            return {
                ...prev,
                [section]: prev[section].map(item => item.id === id ? { ...item, [field]: value } : item)
            };
        });
    };

    const removePortfolioItem = (section, id) => {
        setPortfolioContent(prev => {
            if (section === 'aboutCards') {
                return { ...prev, about: { ...prev.about, cards: prev.about.cards.filter(item => item.id !== id) }};
            }
            return {
                ...prev,
                [section]: prev[section].filter(item => item.id !== id)
            };
        });
    };

    useEffect(() => {
        if (!token) {
            window.location.href = '/login';
        } else {
            fetchProjects();
            fetchSkills();
            fetchResume();
            fetchPortfolioContent();
            fetchCoverLetter();
        }
    }, [token]);

    const fetchPortfolioContent = async () => {
        try {
            const res = await fetch('/api/admin/portfolio-content');
            if (res.ok) {
                const data = await res.json();
                setPortfolioContent(data);
            }
        } catch (err) { console.error('Error fetching content:', err); }
    };

    const fetchCoverLetter = async () => {
        try {
            const res = await fetch('/api/admin/cover-letter', {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const data = await res.json();
                setCoverLetter(data.content || '');
            }
        } catch (err) { console.error('Error fetching cover letter:', err); }
    };

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    };

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/admin/projects');
            const data = await res.json();
            if (res.ok) {
                setProjects(data);
                localStorage.setItem('localProjects', JSON.stringify(data));
            }
        } catch (err) { 
            const cached = localStorage.getItem('localProjects');
            if (cached) setProjects(JSON.parse(cached));
            showMessage('Simulated Backend (Projects)', 'success'); 
        }
    };

    const fetchSkills = async () => {
        try {
            const res = await fetch('/api/admin/skills');
            const data = await res.json();
            if (res.ok) {
                setSkills(data);
                localStorage.setItem('localSkills', JSON.stringify(data));
            }
        } catch (err) { 
            const cached = localStorage.getItem('localSkills');
            if (cached) setSkills(JSON.parse(cached));
            showMessage('Simulated Backend (Skills)', 'success'); 
        }
    };

    const fetchResume = async () => {
        try {
            const res = await fetch('/api/admin/resume');
            const data = await res.json();
            const { _id, __v, createdAt, updatedAt, ...cleanData } = data;
            if (res.ok) {
                setResumeData(cleanData);
                setResumeJSON(JSON.stringify(cleanData, null, 2));
            }
        } catch (err) { 
            const cached = localStorage.getItem('resumeJSON');
            const initial = cached ? JSON.parse(cached) : {
              name: "Seth Kipchumba Korir",
              title: "Junior Web Developer & Applied Computer Science Student",
              summary: "A highly motivated and detail-oriented student pursuing a Bachelor’s degree in Applied Computer Science at Daystar University. Skilled in web development with a strong foundation in the MERN stack (MongoDB, Express, Node.js), APIs, and version control using Git. Passionate about creating accessible and user-friendly technologies, I am eager to contribute to innovative projects, collaborate with diverse teams, and further develop my technical expertise.",
              contact: {
                email: "zsethkipchumba179@gmail.com",
                phone: "+254748497623",
                location: "Bomet, Nairobi, 20400",
                github: "github.com/SethKkorir",
                linkedin: "linkedin.com/in/Seth-Kipchumba-Korir"
              },
              experience: [{
                role: "Attachment Trainee",
                org: "Techsavanna Company Limited (Software solutions)",
                time: "2024",
                points: [
                  "Gained hands-on experience in developing REST APIs and integrating them into web applications.",
                  "Collaborated with a team of developers to design, develop, and test backend systems.",
                  "Enhanced skills in team collaboration, version control (Git), and API documentation using tools like Postman.",
                  "Contributed to the development of scalable and efficient backend solutions."
                ]
              }],
              education: [
                { degree: "Bachelor of Applied Computer Science", school: "Daystar University", time: "2024 – Present" },
                { degree: "Diploma in ICT", school: "Daystar University", time: "2023 – 2024" },
                { degree: "Certificate in ICT", school: "Daystar University", time: "2022" },
                { degree: "Kenya Certificate of Secondary Education (KCSE)", school: "Koibeiyon Secondary School", time: "2018 – 2021" }
              ],
              skills: { frontend: ["HTML", "CSS", "JavaScript", "React"], backend: ["Node.js", "Express", "MongoDB", "REST APIs"], tools: ["Git", "Postman", "VS Code", "Poster Design"] },
              projects: [{ name: "Rerendet Coffee Platform", tech: "React · Node.js · Express · MongoDB", desc: "Full-stack MERN application for showcasing coffee products, managing orders, and delivering a seamless digital customer experience.", link: "#" }],
              referees: [{ name: "Zipporah Mwololo", role: "Head of Department, School of Science, Health, and Engineering", org: "Daystar University", contact: "Phone: +254716372466 | Email: zmwololo@daystar.ac.ke" }]
            };
            setResumeData(initial);
            setResumeJSON(JSON.stringify(initial, null, 2));
            showMessage('Simulated Backend (Resume)', 'success');
        }
    };

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const techStackArray = typeof projectForm.techStack === 'string' 
            ? projectForm.techStack.split(',').map(t => t.trim())
            : projectForm.techStack;

        const url = editingProject ? `/api/admin/projects/${editingProject._id}` : '/api/admin/projects';
        const method = editingProject ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ ...projectForm, techStack: techStackArray })
            });
            if (res.ok) {
                fetchProjects();
                setProjectForm({ title: '', description: '', techStack: '', image: '', demoLink: '', githubLink: '', category: 'Fullstack' });
                setEditingProject(null);
                showMessage(editingProject ? 'Project reconfigured' : 'Project launched');
            } else {
                showMessage('Protocol failure', 'error');
            }
        } catch (err) { 
            showMessage('Network interference', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSkillSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const url = editingSkill ? `/api/admin/skills/${editingSkill._id}` : '/api/admin/skills';
        const method = editingSkill ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(skillForm)
            });
            if (res.ok) {
                fetchSkills();
                setSkillForm({ name: '', level: 50, category: 'Frontend' });
                setEditingSkill(null);
                showMessage(editingSkill ? 'Core skill refined' : 'New skill integrated');
            } else {
                showMessage('Integration failed', 'error');
            }
        } catch (err) { 
            showMessage('Network interference', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResumeSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        try {
            localStorage.setItem('resumeJSON', JSON.stringify(resumeData)); // Sync for offline preview
            
            const res = await fetch('/api/admin/resume', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify(resumeData)
            });
            if (res.ok) {
                showMessage('Resume core updated successfully');
            } else {
                showMessage('Resume saved locally (Backend unreachable)');
            }
        } catch (err) {
            showMessage('Network interference', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Resume Form Helpers
    const updateResumeSection = (section, value) => {
        setResumeData(prev => ({ ...prev, [section]: value }));
    };

    const addListItem = (section, defaultObj) => {
        setResumeData(prev => ({ ...prev, [section]: [...prev[section], defaultObj] }));
    };

    const removeListItem = (section, index) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    const updateListItem = (section, index, field, value) => {
        const newList = [...resumeData[section]];
        newList[index][field] = value;
        setResumeData(prev => ({ ...prev, [section]: newList }));
    };

    const updateSkillItem = (category, value) => {
        const skillsArray = typeof value === 'string' ? value.split(',').map(s => s.trim()) : value;
        setResumeData(prev => ({
            ...prev,
            skills: { ...prev.skills, [category]: skillsArray }
        }));
    };

    const handleDeleteProject = async (id) => {
        if (!window.confirm("Permanently decommission this project?")) return;
        try {
            const res = await fetch(`/api/admin/projects/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                fetchProjects();
                showMessage('Metadata purged');
            }
        } catch (err) { showMessage('Decommissioning failed', 'error'); }
    };

    const handleDeleteSkill = async (id) => {
        if (!window.confirm("Purge this skill from records?")) return;
        try {
            const res = await fetch(`/api/admin/skills/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                fetchSkills();
                showMessage('Database cleared');
            }
        } catch (err) { showMessage('Purge failed', 'error'); }
    };

    const startEditProject = (p) => {
        setEditingProject(p);
        setProjectForm({
            ...p,
            techStack: Array.isArray(p.techStack) ? p.techStack.join(', ') : p.techStack
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const startEditSkill = (s) => {
        setEditingSkill(s);
        setSkillForm(s);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingProject(null);
        setEditingSkill(null);
        setProjectForm({ title: '', description: '', techStack: '', image: '', demoLink: '', githubLink: '', category: 'Fullstack' });
        setSkillForm({ name: '', level: 50, category: 'Frontend' });
    };

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const downloadCoverLetterPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        const splitText = doc.splitTextToSize(coverLetter, 180);
        doc.text(splitText, 15, 20);
        doc.save('Seth_Korir_CoverLetter.pdf');
        showMessage('Cover Letter PDF generated');
    };

    const downloadCoverLetterWord = () => {
        const content = `<html><body><pre style="font-family: Arial; font-size: 12pt; white-space: pre-wrap;">${coverLetter}</pre></body></html>`;
        const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Seth_Korir_CoverLetter.doc';
        link.click();
        showMessage('Cover Letter Word document generated');
    };

    const saveCoverLetter = async () => {
        try {
            const res = await fetch('/api/admin/cover-letter', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': token 
                },
                body: JSON.stringify({ content: coverLetter })
            });
            if (res.ok) {
                showMessage('Cover Letter saved to database');
            } else {
                throw new Error('Save failed');
            }
        } catch (err) {
            showMessage('Error saving cover letter', 'error');
        }
    };

    const savePortfolioContent = async () => {
        try {
            const res = await fetch('/api/admin/portfolio-content', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': token 
                },
                body: JSON.stringify(portfolioContent)
            });
            if (res.ok) {
                showMessage('Portfolio content synchronized with backend');
            } else {
                throw new Error('Sync failed');
            }
        } catch (err) {
            showMessage('Sync error', 'error');
        }
    };

    return (
        <main className="min-h-screen bg-bg-main relative selection:bg-accent/30 text-text-primary overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-secondary/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="flex min-h-screen relative z-10">
                
                {/* ── PREMIUM SIDEBAR ── */}
                <aside className="w-80 glass border-r border-theme flex flex-col p-8 sticky top-0 h-screen">
                    <div className="flex items-center gap-4 mb-16 px-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-secondary rounded-2xl flex items-center justify-center shadow-glow">
                            <LayoutDashboard className="text-white" size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black font-heading tracking-tighter">
                                Admin<span className="text-accent">Panel</span>
                            </h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">v2.1.0 Premium</p>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-3">
                        {[
                            { id: 'projects', label: 'Projects', Icon: Layers },
                            { id: 'skills', label: 'Skills', Icon: Cpu },
                            { id: 'resume', label: 'Resume/PDF', Icon: Wrench },
                            { id: 'coverletter', label: 'Cover Letter', Icon: FileText },
                            { id: 'content', label: 'Portfolio', Icon: Briefcase },
                            { id: 'settings', label: 'Settings', Icon: Settings }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-4 p-5 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all duration-500 group relative ${
                                    activeTab === tab.id 
                                        ? 'bg-accent text-white shadow-glow translate-x-3' 
                                        : 'text-text-muted hover-bg-theme hover:text-text-primary'
                                }`}
                            >
                                <tab.Icon size={18} strokeWidth={2.5} className={activeTab === tab.id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div layoutId="activeTab" className="absolute left-[-2px] w-1.5 h-6 bg-white rounded-full" />
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="pt-8 border-t border-theme">
                        <button 
                            onClick={logout} 
                            className="w-full flex items-center gap-4 p-5 rounded-2xl font-black uppercase text-[11px] tracking-widest text-red-500/70 hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-red-500/20"
                        >
                            <LogOut size={18} /> Log Out
                        </button>
                    </div>
                </aside>

                {/* ── MAIN WORKSPACE ── */}
                <div className="flex-1 overflow-y-auto px-12 py-10">
                    
                    {/* Workspace Header */}
                    <header className="flex justify-between items-center mb-12">
                        <div className="space-y-1">
                            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-text-muted">Workbench</h2>
                            <p className="text-3xl font-black tracking-tighter capitalize">{activeTab.replace(/([A-Z])/g, ' $1')}</p>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            {/* Theme Toggle */}
                            <button 
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="w-14 h-14 rounded-2xl glass border border-theme flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent/40 transition-all shadow-premium group"
                            >
                                {theme === 'dark' ? (
                                    <Sun size={20} className="group-hover:rotate-45 transition-transform" />
                                ) : (
                                    <Moon size={20} className="group-hover:-rotate-12 transition-transform" />
                                )}
                            </button>
                            
                            <div className="h-10 w-px border-theme border-r"></div>
                            
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden md:block">
                                    <p className="text-xs font-black uppercase tracking-widest">Seth Korir</p>
                                    <p className="text-[10px] text-accent font-black tracking-widest uppercase">System Admin</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/20 to-accent-secondary/20 border border-white/10 flex items-center justify-center font-black text-accent overflow-hidden">
                                     <img src="/assets/prof.png" alt="Admin" className="w-full h-full object-cover opacity-80" />
                                </div>
                            </div>
                        </div>
                    </header>

                    <AnimatePresence>
                        {message.text && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`p-6 rounded-3xl glass mb-10 border flex items-center gap-5 shadow-premium ${
                                    message.type === 'error' ? 'border-red-500/20 text-red-400' : 'border-emerald-500/20 text-emerald-400'
                                }`}
                            >
                                <div className={`w-3 h-3 rounded-full ${message.type === 'error' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]'}`}></div>
                                <span className="font-black tracking-[0.2em] uppercase text-[10px]">{message.text}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="max-w-6xl">
                        <AnimatePresence mode="wait">
                            {activeTab === 'projects' && (
                                <motion.div 
                                    key="projects"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    className="space-y-12"
                                >
                                    {/* Project Form */}
                                    <div className="glass p-10 rounded-[2.5rem] border border-theme relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-12 text-accent/5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                                            <Monitor size={200} strokeWidth={0.5} />
                                        </div>
                                        <div className="flex justify-between items-center mb-10 relative z-10">
                                            <h3 className="text-3xl font-black font-heading tracking-tighter uppercase italic">
                                                {editingProject ? 'Edit Project' : 'Add New Project'}
                                            </h3>
                                            {editingProject && (
                                                <button onClick={cancelEdit} className="text-text-muted hover:text-white transition-colors flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                                                    <X size={14} /> Cancel
                                                </button>
                                            )}
                                        </div>
                                        <form onSubmit={handleProjectSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Project Title</label>
                                                <input type="text" placeholder="Visitor Intelligence..." value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} required className="w-full bg-theme-secondary border border-theme p-4 rounded-xl outline-none focus:border-accent transition-all font-bold placeholder:text-text-muted/40" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Category</label>
                                                <select value={projectForm.category} onChange={e => setProjectForm({ ...projectForm, category: e.target.value })} className="w-full bg-theme-secondary border border-theme p-4 rounded-xl outline-none focus:border-accent transition-all font-bold appearance-none">
                                                    <option value="Fullstack">Fullstack System</option>
                                                    <option value="Frontend">Frontend UI</option>
                                                    <option value="Backend">Backend Logic</option>
                                                </select>
                                            </div>
                                            <div className="space-y-3 md:col-span-2">
                                                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Description</label>
                                                <textarea rows="4" placeholder="Detail the architecture and outcomes..." value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} required className="w-full bg-theme-secondary border border-theme p-4 rounded-xl outline-none focus:border-accent transition-all font-medium resize-none placeholder:text-text-muted/40"></textarea>
                                            </div>
                                            <div className="space-y-3 md:col-span-2">
                                                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Tech Stack (Comma Separated)</label>
                                                <input type="text" placeholder="React, Express, MongoDB, Tailwind..." value={projectForm.techStack} onChange={e => setProjectForm({ ...projectForm, techStack: e.target.value })} className="w-full bg-theme-secondary border border-theme p-4 rounded-xl outline-none focus:border-accent transition-all font-bold placeholder:text-text-muted/40" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Image URL</label>
                                                <input type="text" placeholder="https://..." value={projectForm.image} onChange={e => setProjectForm({ ...projectForm, image: e.target.value })} className="w-full bg-theme-secondary border border-theme p-4 rounded-xl outline-none focus:border-accent transition-all font-bold placeholder:text-text-muted/40" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">GitHub Link</label>
                                                <input type="text" placeholder="https://github.com/..." value={projectForm.githubLink} onChange={e => setProjectForm({ ...projectForm, githubLink: e.target.value })} className="w-full bg-theme-secondary border border-theme p-4 rounded-xl outline-none focus:border-accent transition-all font-bold placeholder:text-text-muted/40" />
                                            </div>
                                            <button 
                                                type="submit" 
                                                disabled={isLoading}
                                                className="md:col-span-2 btn-modern btn-primary py-6 text-sm font-black tracking-[0.2em] uppercase mt-2 shadow-glow active:scale-[0.98] disabled:opacity-50"
                                            >
                                                {isLoading ? 'Saving...' : (editingProject ? 'Save Changes' : 'Add Project')}
                                            </button>
                                        </form>
                                    </div>

                                    {/* Inventory List */}
                                    <div className="space-y-6">
                                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-text-muted px-4 flex items-center gap-3">
                                            <Monitor size={14} className="text-accent" />
                                            All Projects
                                        </h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            {projects.map(p => (
                                                <motion.div 
                                                    layout
                                                    key={p._id} 
                                                    className="glass p-6 rounded-3xl border border-theme flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-white/10 transition-all"
                                                >
                                                    <div className="flex gap-6 items-center w-full">
                                                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-theme-secondary border border-theme shrink-0 shadow-lg">
                                                            <img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => {e.target.src='https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=200'}} />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <h4 className="text-xl font-black font-heading tracking-tight">{p.title}</h4>
                                                            <p className="text-accent font-bold uppercase text-[10px] tracking-widest">{p.category}</p>
                                                            <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest line-clamp-1 opacity-60">
                                                                {Array.isArray(p.techStack) ? p.techStack.join(' • ') : p.techStack}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 w-full md:w-auto">
                                                        <button onClick={() => startEditProject(p)} className="flex-1 md:flex-none p-4 bg-theme-secondary text-accent hover:bg-accent hover:text-white transition-all rounded-2xl border border-theme">
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button onClick={() => handleDeleteProject(p._id)} className="flex-1 md:flex-none p-4 bg-theme-secondary text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-2xl border border-theme">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'skills' && (
                                <motion.div 
                                    key="skills"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    className="space-y-12"
                                >
                                    <div className="glass p-10 rounded-[2.5rem] border border-theme relative overflow-hidden group">
                                         <div className="absolute top-0 right-0 p-12 text-accent/5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                                            <Cpu size={200} strokeWidth={0.5} />
                                        </div>
                                        <div className="flex justify-between items-center mb-10 relative z-10">
                                            <h3 className="text-3xl font-black font-heading tracking-tighter uppercase italic">
                                                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                                            </h3>
                                            {editingSkill && (
                                                <button onClick={cancelEdit} className="text-text-muted hover:text-white transition-colors flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                                                    <X size={14} /> Cancel
                                                </button>
                                            )}
                                        </div>
                                        <form onSubmit={handleSkillSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Skill Name</label>
                                                <input type="text" placeholder="React / Node..." value={skillForm.name} onChange={e => setSkillForm({ ...skillForm, name: e.target.value })} required className="w-full bg-theme-secondary border border-theme p-4 rounded-xl outline-none focus:border-accent transition-all font-bold placeholder:text-white/10" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Category</label>
                                                <select value={skillForm.category} onChange={e => setSkillForm({ ...skillForm, category: e.target.value })} className="w-full bg-theme-secondary border border-theme p-4 rounded-xl outline-none focus:border-accent transition-all font-bold appearance-none">
                                                    <option value="Frontend">Frontend Engineering</option>
                                                    <option value="Backend">Backend Systems</option>
                                                    <option value="Database">Data Architecture</option>
                                                    <option value="Tools">Tooling & Workflow</option>
                                                </select>
                                            </div>
                                            <div className="space-y-3 md:col-span-2">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Proficiency</label>
                                                    <span className="text-xs font-black text-accent">{skillForm.level}%</span>
                                                </div>
                                                <input type="range" min="0" max="100" value={skillForm.level} onChange={e => setSkillForm({ ...skillForm, level: e.target.value })} className="w-full accent-accent h-12 cursor-pointer" />
                                            </div>
                                            <button type="submit" disabled={isLoading} className="md:col-span-2 btn-modern btn-primary py-6 text-sm font-black tracking-[0.2em] uppercase mt-2 shadow-glow active:scale-[0.98] disabled:opacity-50">
                                                {isLoading ? 'Saving...' : (editingSkill ? 'Save Changes' : 'Add Skill')}
                                            </button>
                                        </form>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-text-muted px-4 flex items-center gap-3">
                                            <Terminal size={14} className="text-accent" />
                                            Skill Matrix
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {skills.map(s => (
                                                <motion.div 
                                                    layout
                                                    key={s._id} 
                                                    className="glass p-8 rounded-3xl border border-theme relative group hover:border-accent/40 shadow-xl transition-all duration-500"
                                                >
                                                    <div className="flex flex-col gap-6">
                                                        <div className="flex justify-between items-start">
                                                            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20 group-hover:rotate-12 transition-transform">
                                                                {s.category === 'Frontend' ? <Code2 size={20} /> : 
                                                                 s.category === 'Backend' ? <Server size={20} /> :
                                                                 s.category === 'Database' ? <Database size={20} /> : <Terminal size={20} />}
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <button onClick={() => startEditSkill(s)} className="p-2 text-text-muted hover:text-accent transition-colors"><Edit2 size={16} /></button>
                                                                <button onClick={() => handleDeleteSkill(s._id)} className="p-2 text-text-muted hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-black font-heading tracking-tight">{s.name}</h4>
                                                            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1 mb-4">{s.category}</p>
                                                            <div className="w-full bg-theme-secondary h-1.5 rounded-full overflow-hidden p-[1px]">
                                                                <div className="h-full bg-accent shadow-glow rounded-full" style={{ width: `${s.level}%` }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            
                            {activeTab === 'resume' && (
                                <motion.div 
                                    key="resume"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    className="space-y-12"
                                >
                                    <div className="glass p-10 rounded-[2.5rem] border border-theme relative overflow-hidden group">
                                         <div className="absolute top-0 right-0 p-12 text-accent/5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                                            <Wrench size={200} strokeWidth={0.5} />
                                        </div>
                                        <div className="flex justify-between items-center mb-8 relative z-10">
                                            <h3 className="text-3xl font-black font-heading tracking-tighter uppercase italic">
                                                Resume CMS
                                            </h3>
                                            <button onClick={handleResumeSubmit} className="btn-modern btn-primary px-10 py-4 text-xs font-black uppercase tracking-widest shadow-glow">
                                                {isLoading ? 'Saving...' : 'Deploy Changes'}
                                            </button>
                                        </div>

                                        {/* ── Section: Basic Info ── */}
                                        <div className="space-y-10 relative z-10">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Full Name</label>
                                                    <input type="text" value={resumeData.name} onChange={e => updateResumeSection('name', e.target.value)} className="w-full bg-theme-secondary border border-theme p-4 rounded-xl outline-none focus:border-accent transition-all font-bold" />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Job Title</label>
                                                    <input type="text" value={resumeData.title} onChange={updateResumeSection.bind(null, 'title')} className="w-full bg-theme-secondary border border-theme p-4 rounded-xl outline-none focus:border-accent transition-all font-bold" />
                                                </div>
                                                <div className="md:col-span-2 space-y-3">
                                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Professional Summary</label>
                                                    <textarea rows="4" value={resumeData.summary} onChange={e => updateResumeSection('summary', e.target.value)} className="w-full bg-theme-secondary border border-theme p-4 rounded-3xl outline-none focus:border-accent transition-all leading-relaxed"></textarea>
                                                </div>
                                            </div>

                                            {/* ── Dynamic Section: Experience ── */}
                                            <div className="pt-10 border-t border-theme">
                                                <div className="flex justify-between items-center mb-8">
                                                    <h4 className="text-xl font-black uppercase italic tracking-tighter">Work Experience</h4>
                                                    <button onClick={() => addListItem('experience', { role: '', org: '', time: '', points: [] })} className="p-3 bg-accent/20 text-accent rounded-xl hover:bg-accent hover:text-white transition-all">
                                                        <Plus size={18} />
                                                    </button>
                                                </div>
                                                <div className="space-y-8">
                                                    {resumeData.experience.map((exp, idx) => (
                                                        <div key={idx} className="glass p-8 rounded-3xl border border-theme relative group/item">
                                                            <button onClick={() => removeListItem('experience', idx)} className="absolute top-4 right-4 text-text-muted/40 hover:text-red-500 transition-colors">
                                                                <Trash2 size={16} />
                                                            </button>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                <div className="space-y-2">
                                                                    <label className="text-[9px] font-black text-text-muted uppercase">Role</label>
                                                                    <input type="text" value={exp.role} onChange={e => updateListItem('experience', idx, 'role', e.target.value)} className="w-full bg-theme-secondary border border-theme p-3 rounded-lg text-sm" />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[9px] font-black text-text-muted uppercase">Organization</label>
                                                                    <input type="text" value={exp.org} onChange={e => updateListItem('experience', idx, 'org', e.target.value)} className="w-full bg-theme-secondary border border-theme p-3 rounded-lg text-sm" />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[9px] font-black text-text-muted uppercase">Time Period</label>
                                                                    <input type="text" value={exp.time} onChange={e => updateListItem('experience', idx, 'time', e.target.value)} className="w-full bg-theme-secondary border border-theme p-3 rounded-lg text-sm" />
                                                                </div>
                                                                <div className="md:col-span-3 space-y-2">
                                                                    <label className="text-[9px] font-black text-text-muted uppercase">Bullet Points (One per line)</label>
                                                                    <textarea rows="3" value={exp.points.join('\n')} onChange={e => updateListItem('experience', idx, 'points', e.target.value.split('\n'))} className="w-full bg-theme-secondary border border-theme p-3 rounded-lg text-sm"></textarea>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* ── Dynamic Section: Education ── */}
                                            <div className="pt-10 border-t border-theme">
                                                <div className="flex justify-between items-center mb-8">
                                                    <h4 className="text-xl font-black uppercase italic tracking-tighter">Education History</h4>
                                                    <button onClick={() => addListItem('education', { degree: '', school: '', time: '' })} className="p-3 bg-purple-500/20 text-purple-400 rounded-xl hover:bg-purple-500 hover:text-white transition-all">
                                                        <Plus size={18} />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {resumeData.education.map((edu, idx) => (
                                                        <div key={idx} className="glass p-6 rounded-3xl border border-theme relative">
                                                            <button onClick={() => removeListItem('education', idx)} className="absolute top-4 right-4 text-white/20 hover:text-red-500 transition-colors">
                                                                <Trash2 size={16} />
                                                            </button>
                                                            <div className="space-y-4">
                                                                <input type="text" placeholder="Degree" value={edu.degree} onChange={e => updateListItem('education', idx, 'degree', e.target.value)} className="w-full bg-theme-secondary p-2 rounded border-none text-sm font-bold" />
                                                                <input type="text" placeholder="Institution" value={edu.school} onChange={e => updateListItem('education', idx, 'school', e.target.value)} className="w-full bg-theme-secondary p-2 rounded border-none text-xs" />
                                                                <input type="text" placeholder="Year" value={edu.time} onChange={e => updateListItem('education', idx, 'time', e.target.value)} className="w-full bg-theme-secondary p-2 rounded border-none text-[10px]" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* ── Section: Skills ── */}
                                            <div className="pt-10 border-t border-theme">
                                                <h4 className="text-xl font-black uppercase italic tracking-tighter mb-8">Technical Proficiencies</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                    {['frontend', 'backend', 'tools'].map(cat => (
                                                        <div key={cat} className="space-y-3 font-mono">
                                                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">{cat}</label>
                                                            <textarea 
                                                                rows="4" 
                                                                value={resumeData.skills[cat].join(', ')} 
                                                                onChange={e => updateSkillItem(cat, e.target.value)}
                                                                className="w-full bg-theme-secondary border border-theme p-4 rounded-xl text-xs text-green-400 focus:border-accent outline-none"
                                                                placeholder="Skill, Skill, Skill..."
                                                            ></textarea>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* ── Dynamic Section: Projects ── */}
                                            <div className="pt-10 border-t border-theme">
                                                <div className="flex justify-between items-center mb-8">
                                                    <h4 className="text-xl font-black uppercase italic tracking-tighter">Featured Projects</h4>
                                                    <button onClick={() => addListItem('projects', { name: '', tech: '', desc: '', link: '' })} className="p-3 bg-pink-500/20 text-pink-400 rounded-xl hover:bg-pink-500 hover:text-white transition-all">
                                                        <Plus size={18} />
                                                    </button>
                                                </div>
                                                <div className="space-y-8">
                                                    {resumeData.projects?.map((proj, idx) => (
                                                        <div key={idx} className="glass p-8 rounded-3xl border border-theme relative group/item">
                                                            <button onClick={() => removeListItem('projects', idx)} className="absolute top-4 right-4 text-text-muted/40 hover:text-red-500 transition-colors">
                                                                <Trash2 size={16} />
                                                            </button>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                <div className="space-y-2">
                                                                    <label className="text-[9px] font-black text-text-muted uppercase">Project Name</label>
                                                                    <input type="text" value={proj.name} onChange={e => updateListItem('projects', idx, 'name', e.target.value)} className="w-full bg-theme-secondary border border-theme p-3 rounded-lg text-sm font-bold" />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[9px] font-black text-text-muted uppercase">Technologies (e.g. React · Node.js)</label>
                                                                    <input type="text" value={proj.tech} onChange={e => updateListItem('projects', idx, 'tech', e.target.value)} className="w-full bg-theme-secondary border border-theme p-3 rounded-lg text-xs font-mono" />
                                                                </div>
                                                                <div className="md:col-span-2 space-y-2">
                                                                    <label className="text-[9px] font-black text-text-muted uppercase">Description</label>
                                                                    <textarea rows="2" value={proj.desc} onChange={e => updateListItem('projects', idx, 'desc', e.target.value)} className="w-full bg-theme-secondary border border-theme p-3 rounded-lg text-sm"></textarea>
                                                                </div>
                                                                <div className="md:col-span-2 space-y-2">
                                                                    <label className="text-[9px] font-black text-text-muted uppercase">Link</label>
                                                                    <input type="text" value={proj.link} onChange={e => updateListItem('projects', idx, 'link', e.target.value)} className="w-full bg-theme-secondary border border-theme p-3 rounded-lg text-[10px]" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* ── Dynamic Section: Referees ── */}
                                            <div className="pt-10 border-t border-theme">
                                                <div className="flex justify-between items-center mb-8">
                                                    <h4 className="text-xl font-black uppercase italic tracking-tighter">References</h4>
                                                    <button onClick={() => addListItem('referees', { name: '', role: '', org: '', contact: '' })} className="p-3 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition-all">
                                                        <Plus size={18} />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {resumeData.referees?.map((ref, idx) => (
                                                        <div key={idx} className="glass p-6 rounded-3xl border border-theme relative bg-theme-secondary/20">
                                                            <button onClick={() => removeListItem('referees', idx)} className="absolute top-4 right-4 text-text-muted/40 hover:text-red-500 transition-colors">
                                                                <Trash2 size={16} />
                                                            </button>
                                                            <div className="space-y-4">
                                                                <input type="text" placeholder="Name" value={ref.name} onChange={e => updateListItem('referees', idx, 'name', e.target.value)} className="w-full bg-theme-secondary p-2 rounded text-sm font-black text-accent" />
                                                                <input type="text" placeholder="Role" value={ref.role} onChange={e => updateListItem('referees', idx, 'role', e.target.value)} className="w-full bg-theme-secondary p-2 rounded text-xs" />
                                                                <input type="text" placeholder="Organization" value={ref.org} onChange={e => updateListItem('referees', idx, 'org', e.target.value)} className="w-full bg-theme-secondary p-2 rounded text-xs opacity-60" />
                                                                <input type="text" placeholder="Contact Detail" value={ref.contact} onChange={e => updateListItem('referees', idx, 'contact', e.target.value)} className="w-full bg-theme-secondary p-2 rounded text-[10px] italic" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            
                            {activeTab === 'coverletter' && (
                                <motion.div 
                                    key="coverletter"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    className="space-y-12"
                                >
                                    <div className="glass p-10 rounded-[2.5rem] border border-theme relative overflow-hidden group">
                                         <div className="absolute top-0 right-0 p-12 text-accent/5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                                            <FileText size={200} strokeWidth={0.5} />
                                        </div>
                                        <div className="flex justify-between items-center mb-6 relative z-10">
                                            <h3 className="text-3xl font-black font-heading tracking-tighter uppercase italic">
                                                Cover Letter
                                            </h3>
                                        </div>
                                        <p className="text-text-muted text-sm mb-6 relative z-10">
                                            Draft your cover letter here. You can download it as a professional PDF or Word document instantly.
                                        </p>
                                        
                                        <div className="relative z-10 flex flex-col gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Writer Content</label>
                                                <textarea 
                                                    rows="18" 
                                                    value={coverLetter} 
                                                    onChange={e => setCoverLetter(e.target.value)} 
                                                    required 
                                                    className="w-full bg-theme-secondary border border-theme p-8 rounded-3xl outline-none focus:border-accent transition-all text-text-primary text-sm leading-relaxed placeholder:text-text-muted/40"
                                                ></textarea>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <button onClick={saveCoverLetter} className="btn-modern bg-theme-secondary border border-theme text-xs font-black uppercase tracking-widest py-5 hover:bg-white/10">
                                                    Save Progress
                                                </button>
                                                <button onClick={downloadCoverLetterPDF} className="btn-modern btn-primary text-xs font-black uppercase tracking-widest py-5 flex items-center justify-center gap-3 shadow-glow">
                                                    <Download size={16} /> PDF Export
                                                </button>
                                                <button onClick={downloadCoverLetterWord} className="btn-modern bg-accent/20 border border-accent/20 text-accent text-xs font-black uppercase tracking-widest py-5 flex items-center justify-center gap-3 hover:bg-accent hover:text-white transition-all">
                                                    <Download size={16} /> Word Export
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'content' && (
                                <motion.div 
                                    key="content"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    className="space-y-12"
                                >
                                    <div className="glass p-10 rounded-[2.5rem] border border-theme relative overflow-hidden group">
                                         <div className="absolute top-0 right-0 p-12 text-accent/5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                                            <Briefcase size={200} strokeWidth={0.5} />
                                        </div>
                                        <div className="flex justify-between items-center mb-10 relative z-10">
                                            <h3 className="text-3xl font-black font-heading tracking-tighter uppercase italic">
                                                Portfolio Content
                                            </h3>
                                            <button onClick={savePortfolioContent} className="btn-modern btn-primary px-10 py-4 text-xs font-black uppercase tracking-widest shadow-glow">
                                                Update Website
                                            </button>
                                        </div>
                                        
                                        <div className="relative z-10 space-y-12">
                                            {/* Hero Section Edit */}
                                            <div className="space-y-8">
                                                <h4 className="text-sm font-black uppercase tracking-[0.3em] text-accent flex items-center gap-3">
                                                    <span className="w-8 h-px bg-accent/30"></span>
                                                    Hero Section
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Greeting</label>
                                                        <input type="text" value={portfolioContent.hero.greeting} onChange={e => updateContent('hero', 'greeting', e.target.value)} className="w-full bg-theme-secondary border border-theme p-4 rounded-xl outline-none focus:border-accent transition-all font-bold" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Display Name</label>
                                                        <input type="text" value={portfolioContent.hero.name} onChange={e => updateContent('hero', 'name', e.target.value)} className="w-full bg-theme-secondary border border-theme p-4 rounded-xl outline-none focus:border-accent transition-all font-bold" />
                                                    </div>
                                                    <div className="md:col-span-2 space-y-3">
                                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Hero Tagline</label>
                                                        <textarea rows="2" value={portfolioContent.hero.tagline} onChange={e => updateContent('hero', 'tagline', e.target.value)} className="w-full bg-theme-secondary border border-theme p-4 rounded-xl outline-none focus:border-accent transition-all font-bold resize-none"></textarea>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* About Section Edit */}
                                            <div className="space-y-8 pt-8 border-t border-theme">
                                                <h4 className="text-sm font-black uppercase tracking-[0.3em] text-accent flex items-center gap-3">
                                                    <span className="w-8 h-px bg-accent/30"></span>
                                                    About Section
                                                </h4>
                                                <div className="space-y-6">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Brief Introduction</label>
                                                        <button onClick={() => addPortfolioItem('aboutCards')} className="p-3 bg-accent/20 text-accent rounded-xl hover:bg-accent hover:text-white transition-all">
                                                            <Plus size={18} />
                                                        </button>
                                                    </div>
                                                    <textarea rows="4" value={portfolioContent.about.text} onChange={e => updateContent('about', 'text', e.target.value)} className="w-full bg-theme-secondary border border-theme p-6 rounded-2xl outline-none focus:border-accent transition-all leading-relaxed"></textarea>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                                    {portfolioContent.about.cards?.map((card) => (
                                                        <div key={card.id} className="bg-theme-secondary/50 border border-theme p-6 rounded-[2rem] relative">
                                                            <button onClick={() => removePortfolioItem('aboutCards', card.id)} className="absolute top-4 right-4 text-red-500/50 hover:text-red-500 transition-colors">
                                                                <Trash2 size={16} />
                                                            </button>
                                                            <div className="space-y-4">
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="space-y-1">
                                                                        <label className="text-[8px] font-black text-text-muted uppercase tracking-wider">Icon (Lucide)</label>
                                                                        <input type="text" value={card.icon} onChange={e => updatePortfolioItem('aboutCards', card.id, 'icon', e.target.value)} className="w-full bg-theme-secondary/30 border border-theme p-2 rounded-lg text-xs" />
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <label className="text-[8px] font-black text-text-muted uppercase tracking-wider">Accent Color</label>
                                                                        <input type="color" value={card.color} onChange={e => updatePortfolioItem('aboutCards', card.id, 'color', e.target.value)} className="w-full h-8 bg-transparent border-none p-0 cursor-pointer" />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[8px] font-black text-text-muted uppercase tracking-wider">Title</label>
                                                                    <input type="text" value={card.title} onChange={e => updatePortfolioItem('aboutCards', card.id, 'title', e.target.value)} className="w-full bg-theme-secondary/30 border border-theme p-2 rounded-lg text-xs font-bold" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[8px] font-black text-text-muted uppercase tracking-wider">Description</label>
                                                                    <textarea rows="2" value={card.desc} onChange={e => updatePortfolioItem('aboutCards', card.id, 'desc', e.target.value)} className="w-full bg-theme-secondary/30 border border-theme p-3 rounded-xl text-xs"></textarea>
                                                                </div>
                                                                <label className="flex items-center gap-2 cursor-pointer">
                                                                    <input type="checkbox" checked={card.span} onChange={e => updatePortfolioItem('aboutCards', card.id, 'span', e.target.checked)} className="accent-accent" />
                                                                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Span 2 Columns</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                            </div>

                                            {/* Testimonials / References Section Edit */}
                                            <div className="space-y-8 pt-8 border-t border-theme">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="text-sm font-black uppercase tracking-[0.3em] text-accent flex items-center gap-3">
                                                        <span className="w-8 h-px bg-accent/30"></span>
                                                        References & Testimonials
                                                    </h4>
                                                    <button onClick={() => addPortfolioItem('testimonials')} className="p-3 bg-accent/20 text-accent rounded-xl hover:bg-accent hover:text-white transition-all shadow-sm">
                                                        <Plus size={18} />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {portfolioContent.testimonials?.map((t) => (
                                                        <div key={t.id} className="bg-theme-secondary/50 border border-theme p-6 rounded-[2rem] relative group/item">
                                                            <button onClick={() => removePortfolioItem('testimonials', t.id)} className="absolute top-4 right-4 text-text-muted hover:text-red-500 transition-colors">
                                                                <Trash2 size={16} />
                                                            </button>
                                                            <div className="space-y-4">
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="space-y-1">
                                                                        <label className="text-[8px] font-black text-text-muted uppercase tracking-wider">Ref Name</label>
                                                                        <input type="text" value={t.name} onChange={e => updatePortfolioItem('testimonials', t.id, 'name', e.target.value)} className="w-full bg-theme-secondary/30 border border-theme p-2 rounded-lg text-xs font-bold" />
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <label className="text-[8px] font-black text-text-muted uppercase tracking-wider">Role / Org</label>
                                                                        <input type="text" value={t.role} onChange={e => updatePortfolioItem('testimonials', t.id, 'role', e.target.value)} className="w-full bg-theme-secondary/30 border border-theme p-2 rounded-lg text-xs" />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[8px] font-black text-text-muted uppercase tracking-wider">Testimonial Text</label>
                                                                    <textarea rows="3" value={t.text} onChange={e => updatePortfolioItem('testimonials', t.id, 'text', e.target.value)} className="w-full bg-theme-secondary/30 border border-theme p-3 rounded-xl text-xs leading-relaxed italic"></textarea>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {(!portfolioContent.testimonials || portfolioContent.testimonials.length === 0) && (
                                                        <div className="md:col-span-2 py-10 text-center border-2 border-dashed border-theme rounded-[2.5rem] text-text-muted text-sm font-bold uppercase tracking-widest">
                                                            No testimonials added yet
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Contact & Socials Section Edit */}
                                            <div className="pt-12 border-t border-theme grid grid-cols-1 lg:grid-cols-2 gap-12">
                                                {/* Contact Details */}
                                                <div className="space-y-8">
                                                    <h4 className="text-sm font-black uppercase tracking-[0.3em] text-accent flex items-center gap-3">
                                                        <span className="w-8 h-px bg-accent/30"></span>
                                                        Contact Details
                                                    </h4>
                                                    <div className="space-y-6">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Email Address</label>
                                                            <input type="email" value={portfolioContent.contact?.email} onChange={e => updateContent('contact', 'email', e.target.value)} className="w-full bg-theme-secondary border border-theme p-4 rounded-xl outline-none focus:border-accent transition-all font-bold" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Phone Number</label>
                                                            <input type="text" value={portfolioContent.contact?.phone} onChange={e => updateContent('contact', 'phone', e.target.value)} className="w-full bg-theme-secondary border border-theme p-4 rounded-xl outline-none focus:border-accent transition-all font-bold" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Location / Address</label>
                                                            <input type="text" value={portfolioContent.contact?.location} onChange={e => updateContent('contact', 'location', e.target.value)} className="w-full bg-theme-secondary border border-theme p-4 rounded-xl outline-none focus:border-accent transition-all font-bold" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Social Presence */}
                                                <div className="space-y-8">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="text-sm font-black uppercase tracking-[0.3em] text-accent flex items-center gap-3">
                                                            <span className="w-8 h-px bg-accent/30"></span>
                                                            Social Presence
                                                        </h4>
                                                        <button onClick={() => addPortfolioItem('socials')} className="p-3 bg-accent/20 text-accent rounded-xl hover:bg-accent hover:text-white transition-all">
                                                            <Plus size={18} />
                                                        </button>
                                                    </div>
                                                    <div className="space-y-4">
                                                        {portfolioContent.socials?.map((s) => (
                                                            <div key={s.id} className="bg-theme-secondary/50 border border-theme p-4 rounded-2xl flex items-center gap-4 relative group/item">
                                                                <button onClick={() => removePortfolioItem('socials', s.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all shadow-lg scale-75">
                                                                    <Trash2 size={12} />
                                                                </button>
                                                                <input type="text" placeholder="Platform" value={s.platform} onChange={e => updatePortfolioItem('socials', s.id, 'platform', e.target.value)} className="w-1/3 bg-theme-secondary/30 border border-theme p-2 rounded-lg text-xs font-black uppercase tracking-widest placeholder:text-text-muted/40" />
                                                                <input type="text" placeholder="URL" value={s.href} onChange={e => updatePortfolioItem('socials', s.id, 'href', e.target.value)} className="flex-1 bg-theme-secondary/30 border border-theme p-2 rounded-lg text-xs placeholder:text-text-muted/40" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'settings' && (
                                <motion.div 
                                    key="settings"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    className="glass p-20 text-center space-y-8 rounded-[3rem] border border-theme"
                                >
                                    <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto border border-accent/20">
                                        <Settings size={48} className="text-accent animate-spin-slow" strokeWidth={1.5} />
                                    </div>
                                    <div className="max-w-md mx-auto space-y-4">
                                        <h3 className="text-3xl font-black font-heading tracking-tight">System Configuration</h3>
                                        <p className="text-text-muted font-medium leading-relaxed">
                                            Advanced telemetry and global platform variables will be available in the next lifecycle update. Currently monitoring core operations.
                                        </p>
                                    </div>
                                    <div className="flex justify-center gap-4">
                                        <div className="px-6 py-3 bg-theme-secondary rounded-2xl border border-theme text-[10px] font-black uppercase tracking-widest text-text-muted">v2.1.0-alpha</div>
                                        <div className="px-6 py-3 bg-green-500/10 rounded-2xl border border-green-500/20 text-[10px] font-black uppercase tracking-widest text-green-400">Connection Standard</div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AdminDashboard;
