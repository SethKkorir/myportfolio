import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, LogOut, Plus, Edit2, Trash2, X, 
    Layers, Cpu, Settings, Monitor, Database, Terminal, 
    Cloud, Server, Code2, Wrench, FileText, Download, Briefcase,
    Sun, Moon, ArrowRight, ChevronRight, Send, Github
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
            let data = await res.json();
            if (Array.isArray(data)) data = data[0] || {};
            const { _id, __v, createdAt, updatedAt, ...rest } = data;
            const cleanData = {
                ...rest,
                contact: rest.contact || {},
                experience: (rest.experience || []).map(e => ({ ...e, points: e.points || [] })),
                education: rest.education || [],
                skills: {
                    frontend: rest.skills?.frontend || [],
                    backend: rest.skills?.backend || [],
                    tools: rest.skills?.tools || []
                },
                projects: rest.projects || [],
                referees: rest.referees || []
            };

            const hasContent = cleanData.experience.length > 0 || cleanData.projects.length > 0 || cleanData.education.length > 0;

            if (res.ok && hasContent) {
                setResumeData(cleanData);
                setResumeJSON(JSON.stringify(cleanData, null, 2));
            } else { throw new Error("Incomplete backend data"); }
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
                { degree: "Certificate in ICT", school: "Daystar University", time: "May- 2022 to Nov-2022" },
                { degree: "Kenya Certificate of Secondary Education (KCSE)", school: "Koibeiyon Secondary School", time: "2018 – 2021" }
              ],
              skills: { frontend: ["HTML", "CSS", "JavaScript", "React"], backend: ["Node.js", "Express", "MongoDB", "REST APIs"], tools: ["Git", "Postman", "VS Code", "Poster Design"] },
              projects: [{ name: "Rerendet Coffee – Digital Brand Platform", tech: "HTML | CSS | JavaScript | React.js (Learning) | MERN (In Progress)", desc: "Designed and developed a modern coffee brand website to simulate a real-world business digital presence. Built the initial version using HTML, CSS, and JavaScript, then began transitioning to React.js for component-based development. Currently learning and applying React.js concepts including components, props, and state management. Developing backend functionality using Node.js and Express as part of a MERN stack architecture. Focused on responsive design, performance, and clean UI/UX.", link: "https://rerendet-website-two.vercel.app/" }],
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

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { id: 'projects', label: 'Systems', Icon: Monitor, desc: 'Project Inventory' },
        { id: 'skills', label: 'Matrix', Icon: Cpu, desc: 'Technical Stack' },
        { id: 'resume', label: 'Identity', Icon: FileText, desc: 'Professional Bio' },
        { id: 'coverletter', label: 'Transmissions', Icon: Send, desc: 'Public Comms' },
        { id: 'content', label: 'Environment', Icon: Briefcase, desc: 'CMS Core' },
        { id: 'settings', label: 'Protocol', Icon: Settings, desc: 'Global Config' }
    ];

    return (
        <main className="min-h-screen bg-[#050506] text-[#e1e1e3] font-main relative overflow-hidden flex selection:bg-accent/30">
            {/* Ultra-High Detail Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(99,102,241,0.05)_0%,_transparent_50%)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstripe-dark.png')] opacity-10 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
            
            {/* ── HYPER-SIDEBAR ── */}
            <aside className={`fixed inset-y-0 left-0 w-[300px] border-r border-white/5 bg-[#08080a]/80 backdrop-blur-3xl flex flex-col z-[60] transition-all duration-700 ease-[0.16, 1, 0.3, 1] lg:sticky lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0 ml-0' : '-translate-x-full -ml-[300px] lg:ml-0'}`}>
                
                {/* Brand Identity */}
                <div className="p-10 mb-8">
                    <div className="flex items-center gap-5 group cursor-pointer" onClick={() => setActiveTab('projects')}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-accent/30 blur-2xl rounded-full scale-150 group-hover:bg-accent/50 transition-all duration-500"></div>
                            <div className="w-14 h-14 bg-gradient-to-br from-accent to-[#4338ca] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)] relative border border-white/20 group-hover:rotate-[360deg] transition-transform duration-1000">
                                <LayoutDashboard size={24} className="text-white" />
                            </div>
                        </div>
                        <div className="space-y-0.5">
                            <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none text-white drop-shadow-sm">Seth<span className="text-accent">X</span></h1>
                            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.5em] mt-1">Core Terminal</p>
                        </div>
                    </div>
                </div>

                {/* Vertical Navigation */}
                <nav className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar pt-4">
                    <p className="px-4 mb-4 text-[8px] font-black text-white/10 uppercase tracking-[0.6em]">Navigation Protocol</p>
                    {navItems.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl font-black uppercase transition-all duration-500 group relative overflow-hidden ${
                                activeTab === tab.id 
                                    ? 'bg-accent/5 text-accent border border-accent/20 shadow-[0_10px_30px_rgba(0,0,0,0.2)]' 
                                    : 'text-white/20 hover:bg-white/[0.03] hover:text-white/60 border border-transparent'
                            }`}
                        >
                            {activeTab === tab.id && (
                                <motion.div layoutId="navGlow" className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent -z-10" />
                            )}
                            <tab.Icon size={18} strokeWidth={2.5} className={activeTab === tab.id ? 'opacity-100 scale-110 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'opacity-40 group-hover:opacity-100 transition-all'} />
                            <div className="text-left">
                                <span className="block text-[10px] tracking-[0.3em] leading-none">{tab.label}</span>
                                <span className="block text-[7px] text-white/20 font-medium tracking-[0.1em] mt-1.5 opacity-0 group-hover:opacity-100 transition-all uppercase">{tab.desc}</span>
                            </div>
                        </button>
                    ))}
                </nav>

                {/* Session Controls */}
                <div className="p-8 border-t border-white/5 mt-auto">
                    <button 
                        onClick={logout} 
                        className="w-full flex items-center justify-between px-6 py-5 rounded-2xl bg-[#0d0d0f] border border-white/5 font-black uppercase text-[9px] tracking-[0.3em] text-red-500/40 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all duration-500 group"
                    >
                        <div className="flex items-center gap-4">
                            <LogOut size={16} /> 
                            <span>End Session</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500/20 group-hover:bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]"></div>
                    </button>
                </div>
            </aside>

            {/* Hyper-Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* ── WORKSPACE CORE ── */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                
                {/* Cinematic Header */}
                <header className="h-[100px] border-b border-white/5 bg-[#050506]/40 backdrop-blur-2xl flex justify-between items-center px-10 lg:px-16 z-40 sticky top-0 shrink-0">
                    <div className="flex items-center gap-8">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/40 hover:text-accent transition-all">
                             <LayoutDashboard size={20} />
                        </button>
                        
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                                <div className="h-1 w-1 rounded-full bg-accent animate-ping"></div>
                                <h2 className="text-[8px] font-black uppercase tracking-[0.6em] text-white/20 italic">Node Status: Operational</h2>
                            </div>
                            <h3 className="text-2xl lg:text-3xl font-black tracking-tighter uppercase italic leading-tight text-white/90">
                                {activeTab.replace(/([A-Z])/g, ' $1')}
                            </h3>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-10">
                        {/* System Tickers */}
                        <div className="hidden xl:flex items-center gap-12">
                            <div className="space-y-1">
                                <p className="text-[7px] font-black text-white/10 uppercase tracking-[0.4em]">Latency</p>
                                <p className="text-[10px] font-black text-accent italic">14ms <span className="text-white/20 font-medium">Standard</span></p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[7px] font-black text-white/10 uppercase tracking-[0.4em]">Encryption</p>
                                <p className="text-[10px] font-black text-green-500/60 italic underline decoration-green-500/20 underline-offset-4">AES-256</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 pl-10 border-l border-white/5">
                            <div className="text-right hidden sm:block">
                                <p className="text-[11px] font-black tracking-tight text-white uppercase italic">S. Kipchumba</p>
                                <span className="bg-accent/10 text-accent px-3 py-1 rounded-lg text-[7px] font-black uppercase tracking-[0.2em] mt-2 inline-block">Root Auth</span>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="w-14 h-14 rounded-2xl bg-[#0d0d0f] border border-white/10 flex items-center justify-center p-0.5 shadow-2xl relative overflow-hidden group-hover:border-accent/40 transition-colors">
                                    <div className="w-full h-full bg-gradient-to-br from-white/[0.05] to-transparent flex items-center justify-center text-accent font-black text-sm italic">SK</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Infinite Scroll Surface */}
                <div className="flex-1 overflow-y-auto custom-scrollbar-minimal scroll-smooth selection:bg-accent/10">
                    <div className="p-8 lg:p-20 max-w-[1500px] mx-auto space-y-20 pb-40">
                        
                        <AnimatePresence>
                            {message.text && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    className={`p-6 rounded-[2rem] bg-[#0d0d0f] border backdrop-blur-3xl flex items-center justify-between gap-8 shadow-[0_30px_60px_rgba(0,0,0,0.5)] ${
                                        message.type === 'error' ? 'border-red-500/20 text-red-500/70' : 'border-accent/20 text-accent/70'
                                    }`}
                                >
                                    <div className="flex items-center gap-6 pl-4">
                                        <div className={`w-2 h-2 rounded-full ${message.type === 'error' ? 'bg-red-500 animate-pulse shadow-[0_0_15px_#ef4444]' : 'bg-accent animate-pulse shadow-[0_0_15px_#6366f1]'}`}></div>
                                        <span className="font-black tracking-[0.3em] uppercase text-[10px] italic">{message.text}</span>
                                    </div>
                                    <button onClick={() => setMessage({ text: '', type: '' })} className="hover:rotate-90 transition-transform p-4 bg-white/[0.03] rounded-2xl">
                                        <X size={18} />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="max-w-[1300px]">
                            <AnimatePresence mode="wait">
                                {activeTab === 'projects' && (
                                <motion.div 
                                    key="projects"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-24"
                                >
                                    {/* ── PROJECT DEPLOYMENT INTERFACE ── */}
                                    <div className="bg-[#08080a] border border-white/5 rounded-[3rem] p-10 lg:p-16 relative overflow-hidden group/form shadow-2xl">
                                        <div className="absolute top-0 right-0 p-16 text-accent/[0.03] pointer-events-none group-hover/form:scale-110 group-hover/form:text-accent/[0.07] transition-all duration-1000">
                                            <Monitor size={400} strokeWidth={0.5} />
                                        </div>
                                        
                                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8 relative z-10">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-8 h-[1px] bg-accent"></div>
                                                    <span className="text-[10px] font-black text-accent uppercase tracking-[0.5em] italic">System Input</span>
                                                </div>
                                                <h3 className="text-5xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none text-white">
                                                    {editingProject ? 'Modify' : 'Initialize'} <br/>
                                                    <span className="text-accent underline decoration-accent/20 underline-offset-8">Protocol</span>
                                                </h3>
                                            </div>
                                            {editingProject && (
                                                <button onClick={cancelEdit} className="px-10 py-5 bg-white/[0.02] hover:bg-white/[0.05] text-white/40 hover:text-white transition-all rounded-2xl border border-white/5 font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-4 italic shadow-inner">
                                                    <X size={16} /> Abort Sequence
                                                </button>
                                            )}
                                        </div>

                                        <form onSubmit={handleProjectSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 relative z-10">
                                            <div className="space-y-4 lg:col-span-4">
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] ml-4 italic">Designation (Title)</label>
                                                <input type="text" placeholder="Quantum Nexus Interface..." value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} required className="w-full bg-[#050506] border border-white/5 p-7 rounded-[2rem] outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all font-bold text-white placeholder:text-white/5 shadow-2xl" />
                                            </div>
                                            <div className="space-y-4 lg:col-span-2">
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] ml-4 italic">Classification</label>
                                                <select value={projectForm.category} onChange={e => setProjectForm({ ...projectForm, category: e.target.value })} className="w-full bg-[#050506] border border-white/5 p-7 rounded-[2rem] outline-none focus:border-accent/40 transition-all font-black uppercase text-[12px] tracking-[0.2em] text-accent appearance-none cursor-pointer shadow-2xl">
                                                    <option value="Fullstack">Fullstack Arch</option>
                                                    <option value="Frontend">Frontend Core</option>
                                                    <option value="Backend">Logic Engine</option>
                                                </select>
                                            </div>
                                            <div className="space-y-4 lg:col-span-6">
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] ml-4 italic">Intelligence Briefing (Description)</label>
                                                <textarea rows="5" placeholder="Document the core architectural pillars and system outcomes..." value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} required className="w-full bg-[#050506] border border-white/5 p-8 rounded-[2.5rem] outline-none focus:border-accent/40 transition-all font-medium text-white/70 placeholder:text-white/5 resize-none leading-relaxed shadow-2xl"></textarea>
                                            </div>
                                            <div className="space-y-4 lg:col-span-3">
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] ml-4 italic">Technology Arsenal</label>
                                                <input type="text" placeholder="React, Rust, WebAssembly..." value={projectForm.techStack} onChange={e => setProjectForm({ ...projectForm, techStack: e.target.value })} className="w-full bg-[#050506] border border-white/5 p-7 rounded-[2rem] outline-none focus:border-accent/40 transition-all font-bold text-white placeholder:text-white/5 shadow-2xl" />
                                            </div>
                                            <div className="space-y-4 lg:col-span-3">
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] ml-4 italic">Visual Signature (Image URL)</label>
                                                <input type="text" placeholder="https://cdn.sethx.pro/..." value={projectForm.image} onChange={e => setProjectForm({ ...projectForm, image: e.target.value })} className="w-full bg-[#050506] border border-white/5 p-7 rounded-[2rem] outline-none focus:border-accent/40 transition-all font-bold text-white placeholder:text-white/5 shadow-2xl" />
                                            </div>
                                            <div className="space-y-4 lg:col-span-4">
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] ml-4 italic">Source Repository</label>
                                                <input type="text" placeholder="https://github.com/..." value={projectForm.githubLink} onChange={e => setProjectForm({ ...projectForm, githubLink: e.target.value })} className="w-full bg-[#050506] border border-white/5 p-7 rounded-[2rem] outline-none focus:border-accent/40 transition-all font-bold text-white placeholder:text-white/5 shadow-2xl" />
                                            </div>
                                            <div className="flex items-end lg:col-span-2">
                                                <button 
                                                    type="submit" 
                                                    disabled={isLoading}
                                                    className="w-full h-[84px] bg-gradient-to-r from-accent to-[#4338ca] text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.4em] italic shadow-[0_20px_40px_rgba(99,102,241,0.3)] hover:shadow-[0_25px_60px_rgba(99,102,241,0.5)] hover:-translate-y-2 transition-all duration-500 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4"
                                                >
                                                    {isLoading ? (
                                                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    ) : (
                                                        <>
                                                            {editingProject ? 'Execute Sync' : 'Launch Module'}
                                                            <ChevronRight size={18} />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    {/* ── ACTIVE PROJECT MATRIX ── */}
                                    <div className="space-y-16">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end px-4 gap-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-3 h-[1px] bg-accent/40"></span>
                                                    <h3 className="text-[10px] font-black uppercase tracking-[0.8em] text-white/10 italic">Core Inventory</h3>
                                                </div>
                                                <p className="text-4xl lg:text-5xl font-black tracking-tighter uppercase italic text-white/80">Active <span className="text-accent">Systems</span></p>
                                            </div>
                                            <div className="bg-white/[0.02] border border-white/5 px-8 py-4 rounded-2xl flex items-center gap-8">
                                                <div className="text-center">
                                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Modules</p>
                                                    <p className="text-xl font-black text-white">{projects.length}</p>
                                                </div>
                                                <div className="w-px h-8 bg-white/5"></div>
                                                <div className="text-center">
                                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Status</p>
                                                    <p className="text-sm font-black text-green-500 italic uppercase">Sync'd</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                                            {projects.map((p, idx) => (
                                                <motion.div 
                                                    layout
                                                    key={p._id}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                                                    className="group relative bg-[#08080a] border border-white/5 rounded-[3rem] overflow-hidden hover:border-accent/40 transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-accent/5"
                                                >
                                                    {/* Cinematic Thumbnail */}
                                                    <div className="h-72 relative overflow-hidden">
                                                        <div className="absolute inset-0 bg-accent/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                                        <img 
                                                            src={p.image} 
                                                            alt="" 
                                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-30 group-hover:opacity-100" 
                                                            onError={(e) => {e.target.src='https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'}} 
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/40 to-transparent"></div>
                                                        
                                                        {/* Badge Overlay */}
                                                        <div className="absolute top-10 left-10">
                                                            <div className="px-5 py-2 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 flex items-center gap-3">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_#6366f1]"></div>
                                                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white italic">{p.category}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Data Body */}
                                                    <div className="p-10 -mt-16 relative z-20 space-y-8">
                                                        <div className="space-y-4">
                                                            <h4 className="text-3xl font-black font-heading tracking-tighter text-white group-hover:text-accent transition-colors leading-none truncate italic">
                                                                {p.title}
                                                            </h4>
                                                            <p className="text-white/40 text-[13px] font-medium line-clamp-2 leading-relaxed h-11 italic">
                                                                {p.description}
                                                            </p>
                                                        </div>

                                                        {/* Arsenal Grid */}
                                                        <div className="flex flex-wrap gap-2.5">
                                                            {(Array.isArray(p.techStack) ? p.techStack : p.techStack.split(',')).slice(0, 4).map((tech, tIdx) => (
                                                                <span key={tIdx} className="bg-white/[0.03] border border-white/5 text-white/30 px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] group-hover:border-accent/20 group-hover:text-white/60 transition-all">
                                                                    {tech.trim()}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        {/* Power Actions */}
                                                        <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <button onClick={() => startEditProject(p)} className="w-12 h-12 flex items-center justify-center bg-white/[0.02] text-white/20 hover:bg-accent hover:text-white transition-all rounded-2xl border border-white/5 hover:border-accent hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                                                                    <Edit2 size={16} />
                                                                </button>
                                                                <button onClick={() => handleDeleteProject(p._id)} className="w-12 h-12 flex items-center justify-center bg-white/[0.02] text-white/20 hover:bg-red-500 hover:text-white transition-all rounded-2xl border border-white/5 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                            
                                                            <a href={p.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[9px] font-black text-accent uppercase tracking-[0.3em] hover:tracking-[0.4em] transition-all group/link italic">
                                                                Repo Link <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                                                            </a>
                                                        </div>
                                                    </div>

                                                    {/* Decorative Elements */}
                                                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/5 blur-[60px] pointer-events-none"></div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'skills' && (
                                <motion.div 
                                    key="skills"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-24"
                                >
                                    {/* ── SKILL ARCHIVE INTERFACE ── */}
                                    <div className="bg-[#08080a] border border-white/5 rounded-[3rem] p-10 lg:p-16 relative overflow-hidden group/form shadow-2xl">
                                         <div className="absolute top-0 right-0 p-16 text-accent/[0.03] pointer-events-none group-hover/form:scale-110 group-hover/form:text-accent/[0.07] transition-all duration-1000">
                                            <Cpu size={400} strokeWidth={0.5} />
                                        </div>
                                        
                                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8 relative z-10">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-8 h-[1px] bg-accent"></div>
                                                    <span className="text-[10px] font-black text-accent uppercase tracking-[0.5em] italic">Data Entry</span>
                                                </div>
                                                <h3 className="text-5xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none text-white">
                                                    {editingSkill ? 'Update' : 'Register'} <br/>
                                                    <span className="text-accent underline decoration-accent/20 underline-offset-8">Competency</span>
                                                </h3>
                                            </div>
                                            {editingSkill && (
                                                <button onClick={cancelEdit} className="px-10 py-5 bg-white/[0.02] hover:bg-white/[0.05] text-white/40 hover:text-white transition-all rounded-2xl border border-white/5 font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-4 italic shadow-inner">
                                                    <X size={16} /> Cancel Command
                                                </button>
                                            )}
                                        </div>

                                        <form onSubmit={handleSkillSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-10 relative z-10">
                                            <div className="space-y-4 md:col-span-3">
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] ml-4 italic">Designation (Skill Name)</label>
                                                <input type="text" placeholder="Advanced React Patterns..." value={skillForm.name} onChange={e => setSkillForm({ ...skillForm, name: e.target.value })} required className="w-full bg-[#050506] border border-white/5 p-7 rounded-[2rem] outline-none focus:border-accent/40 transition-all font-bold text-white placeholder:text-white/5 shadow-2xl" />
                                            </div>
                                            <div className="space-y-4 md:col-span-3">
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] ml-4 italic">Categorization</label>
                                                <select value={skillForm.category} onChange={e => setSkillForm({ ...skillForm, category: e.target.value })} className="w-full bg-[#050506] border border-white/5 p-7 rounded-[2rem] outline-none focus:border-accent/40 transition-all font-black uppercase text-[12px] tracking-[0.2em] text-accent appearance-none cursor-pointer shadow-2xl">
                                                    <option value="Frontend">Frontend Core</option>
                                                    <option value="Backend">Backend Logic</option>
                                                    <option value="Database">Data Architecture</option>
                                                    <option value="Tools">Global Tooling</option>
                                                </select>
                                            </div>
                                            <div className="space-y-6 md:col-span-4">
                                                <div className="flex justify-between items-center px-4">
                                                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] italic">Proficiency Level</label>
                                                    <span className="text-accent font-black text-xs italic tracking-widest">{skillForm.level}% Optimal</span>
                                                </div>
                                                <div className="px-4">
                                                    <input type="range" min="0" max="100" value={skillForm.level} onChange={e => setSkillForm({ ...skillForm, level: e.target.value })} className="w-full h-1.5 bg-[#050506] rounded-full appearance-none cursor-pointer accent-accent border border-white/5 shadow-inner" />
                                                </div>
                                            </div>
                                            <div className="flex items-end md:col-span-2">
                                                <button 
                                                    type="submit" 
                                                    disabled={isLoading}
                                                    className="w-full h-[84px] bg-gradient-to-r from-accent to-[#4338ca] text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.4em] italic shadow-[0_20px_40px_rgba(99,102,241,0.3)] hover:shadow-[0_25px_60px_rgba(99,102,241,0.5)] hover:-translate-y-2 transition-all duration-500 active:scale-[0.98] flex items-center justify-center gap-4"
                                                >
                                                    {isLoading ? (
                                                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    ) : (
                                                        <>
                                                            {editingSkill ? 'Sync Stats' : 'Commit Skill'}
                                                            <ChevronRight size={18} />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    {/* ── SKILL MATRIX GRID ── */}
                                    <div className="space-y-12">
                                        <div className="flex items-center gap-3 px-4">
                                            <span className="w-3 h-[1px] bg-accent/40"></span>
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.8em] text-white/10 italic">Competency Matrix</h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                                            {skills.map((s, idx) => (
                                                <motion.div 
                                                    layout
                                                    key={s._id}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="group relative bg-[#08080a] border border-white/5 rounded-[2.5rem] p-8 hover:border-accent/40 transition-all duration-700 shadow-2xl"
                                                >
                                                    <div className="flex justify-between items-start mb-8">
                                                        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-accent/40 group-hover:text-accent group-hover:bg-accent/5 transition-all">
                                                            <Cpu size={20} />
                                                        </div>
                                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => startEditSkill(s)} className="p-3 bg-white/[0.03] hover:bg-accent hover:text-white rounded-xl transition-all border border-white/5">
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button onClick={() => handleDeleteSkill(s._id)} className="p-3 bg-white/[0.03] hover:bg-red-500 hover:text-white rounded-xl transition-all border border-white/5">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div className="space-y-1">
                                                            <p className="text-[8px] font-black text-white/10 uppercase tracking-widest italic">{s.category}</p>
                                                            <h4 className="text-xl font-black text-white italic group-hover:text-accent transition-colors truncate">{s.name}</h4>
                                                        </div>

                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/20">
                                                                <span>Efficiency</span>
                                                                <span className="text-accent">{s.level}%</span>
                                                            </div>
                                                            <div className="h-1 bg-[#050506] rounded-full overflow-hidden border border-white/5 shadow-inner">
                                                                <motion.div 
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${s.level}%` }}
                                                                    className="h-full bg-gradient-to-r from-accent/50 to-accent shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                                                />
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
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-24"
                                >
                                    <div className="bg-[#08080a] border border-white/5 rounded-[3rem] p-10 lg:p-16 relative overflow-hidden group/form shadow-2xl">
                                         <div className="absolute top-0 right-0 p-16 text-accent/[0.03] pointer-events-none group-hover/form:scale-110 group-hover/form:text-accent/[0.07] transition-all duration-1000">
                                            <Wrench size={400} strokeWidth={0.5} />
                                        </div>
                                        
                                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8 relative z-10">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-8 h-[1px] bg-accent"></div>
                                                    <span className="text-[10px] font-black text-accent uppercase tracking-[0.5em] italic">Career Protocol</span>
                                                </div>
                                                <h3 className="text-5xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none text-white">
                                                    Resume <br/>
                                                    <span className="text-accent underline decoration-accent/20 underline-offset-8">Terminal</span>
                                                </h3>
                                            </div>
                                            <button 
                                                onClick={handleResumeSubmit} 
                                                className="px-12 py-6 bg-gradient-to-r from-accent to-[#4338ca] text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.4em] italic shadow-[0_20px_40px_rgba(99,102,241,0.3)] hover:shadow-[0_25px_60px_rgba(99,102,241,0.5)] hover:-translate-y-2 transition-all duration-500 active:scale-[0.98] flex items-center gap-4 relative z-10"
                                            >
                                                {isLoading ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                ) : (
                                                    <>Write to Disk <Send size={18} /></>
                                                )}
                                            </button>
                                        </div>

                                        {/* ── BASIC ID ── */}
                                        <div className="relative z-10 space-y-24">
                                            <div className="space-y-12">
                                                <div className="flex items-center gap-4 px-4">
                                                    <div className="h-px flex-1 bg-gradient-to-r from-accent/40 to-transparent"></div>
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.8em] text-accent italic">Identification</h4>
                                                    <div className="h-px flex-1 bg-gradient-to-l from-accent/40 to-transparent"></div>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                    <div className="space-y-4">
                                                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] ml-4 italic">Operative Name</label>
                                                        <input type="text" value={resumeData.name} onChange={e => updateResumeSection('name', e.target.value)} className="w-full bg-[#050506] border border-white/5 p-7 rounded-[2rem] outline-none focus:border-accent/40 transition-all font-bold text-white shadow-2xl" />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] ml-4 italic">Operational Title</label>
                                                        <input type="text" value={resumeData.title} onChange={e => updateResumeSection('title', e.target.value)} className="w-full bg-[#050506] border border-white/5 p-7 rounded-[2rem] outline-none focus:border-accent/40 transition-all font-bold text-white shadow-2xl" />
                                                    </div>
                                                    <div className="md:col-span-2 space-y-4">
                                                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] ml-4 italic">Executive Summary</label>
                                                        <textarea rows="4" value={resumeData.summary} onChange={e => updateResumeSection('summary', e.target.value)} className="w-full bg-[#050506] border border-white/5 p-8 rounded-[2.5rem] outline-none focus:border-accent/40 transition-all font-bold text-white/70 resize-none leading-relaxed shadow-2xl"></textarea>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ── OPERATIONAL HISTORY ── */}
                                            <div className="space-y-12">
                                                <div className="flex justify-between items-center px-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-3 h-[1px] bg-accent/40"></span>
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.8em] text-accent italic">Operational History</h4>
                                                    </div>
                                                    <button onClick={() => addListItem('experience', { role: '', org: '', time: '', points: [] })} className="w-12 h-12 flex items-center justify-center bg-white/[0.02] text-accent hover:bg-accent hover:text-white transition-all rounded-2xl border border-white/5 hover:border-accent hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                                                        <Plus size={18} />
                                                    </button>
                                                </div>

                                                <div className="space-y-10">
                                                    {resumeData.experience.map((exp, idx) => (
                                                        <div key={idx} className="bg-[#050506] border border-white/5 p-10 rounded-[3rem] relative overflow-hidden group/exp shadow-2xl">
                                                            <button onClick={() => removeListItem('experience', idx)} className="absolute top-8 right-8 text-white/10 hover:text-red-500 transition-colors z-20">
                                                                <Trash2 size={18} />
                                                            </button>
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                                                                <div className="space-y-4">
                                                                    <label className="text-[8px] font-black text-white/20 uppercase tracking-widest italic ml-2">Designation</label>
                                                                    <input type="text" value={exp.role} onChange={e => updateListItem('experience', idx, 'role', e.target.value)} className="w-full bg-white/[0.02] border border-white/5 p-5 rounded-2xl text-sm font-black text-white italic" />
                                                                </div>
                                                                <div className="space-y-4">
                                                                    <label className="text-[8px] font-black text-white/20 uppercase tracking-widest italic ml-2">Entity</label>
                                                                    <input type="text" value={exp.org} onChange={e => updateListItem('experience', idx, 'org', e.target.value)} className="w-full bg-white/[0.02] border border-white/5 p-5 rounded-2xl text-sm text-accent font-bold" />
                                                                </div>
                                                                <div className="space-y-4">
                                                                    <label className="text-[8px] font-black text-white/20 uppercase tracking-widest italic ml-2">Timeline</label>
                                                                    <input type="text" value={exp.time} onChange={e => updateListItem('experience', idx, 'time', e.target.value)} className="w-full bg-white/[0.02] border border-white/5 p-5 rounded-2xl text-xs text-white/40" />
                                                                </div>
                                                                <div className="md:col-span-3 space-y-4">
                                                                    <label className="text-[8px] font-black text-white/20 uppercase tracking-widest italic ml-2">Mission Log (Bullet points: one per line)</label>
                                                                    <textarea rows="4" value={exp.points.join('\n')} onChange={e => updateListItem('experience', idx, 'points', e.target.value.split('\n'))} className="w-full bg-white/[0.02] border border-white/5 p-7 rounded-[2.5rem] text-sm leading-relaxed text-white/60"></textarea>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* ── ACADEMIC ARCHIVE ── */}
                                            <div className="space-y-12">
                                                <div className="flex justify-between items-center px-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-3 h-[1px] bg-accent/40"></span>
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.8em] text-accent italic">Academic Archive</h4>
                                                    </div>
                                                    <button onClick={() => addListItem('education', { degree: '', school: '', time: '' })} className="w-12 h-12 flex items-center justify-center bg-white/[0.02] text-accent hover:bg-accent hover:text-white transition-all rounded-2xl border border-white/5 hover:border-accent hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                                                        <Plus size={18} />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                    {resumeData.education.map((edu, idx) => (
                                                        <div key={idx} className="bg-[#050506] border border-white/5 p-8 rounded-[2.5rem] relative group/edu shadow-2xl">
                                                            <button onClick={() => removeListItem('education', idx)} className="absolute top-6 right-6 text-white/10 hover:text-red-500 transition-colors">
                                                                <Trash2 size={16} />
                                                            </button>
                                                            <div className="space-y-6">
                                                                <input type="text" placeholder="Degree Protocol" value={edu.degree} onChange={e => updateListItem('education', idx, 'degree', e.target.value)} className="w-full bg-transparent border-none p-0 text-sm font-black text-white italic focus:ring-0" />
                                                                <input type="text" placeholder="Institution" value={edu.school} onChange={e => updateListItem('education', idx, 'school', e.target.value)} className="w-full bg-transparent border-none p-0 text-sm text-accent focus:ring-0" />
                                                                <input type="text" placeholder="Timeline" value={edu.time} onChange={e => updateListItem('education', idx, 'time', e.target.value)} className="w-full bg-transparent border-none p-0 text-[10px] text-white/30 tracking-[0.2em] focus:ring-0" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* ── PROFICIENCY MATRIX ── */}
                                            <div className="space-y-12">
                                                <div className="flex items-center gap-3 px-4">
                                                    <span className="w-3 h-[1px] bg-accent/40"></span>
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.8em] text-accent italic">Proficiency Matrix</h4>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                                    {['frontend', 'backend', 'tools'].map(cat => (
                                                        <div key={cat} className="space-y-6 group/cat">
                                                            <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] ml-4 italic group-hover/cat:text-accent transition-colors">{cat} Tier</label>
                                                            <textarea 
                                                                rows="5" 
                                                                value={resumeData.skills[cat].join(', ')} 
                                                                onChange={e => updateSkillItem(cat, e.target.value)}
                                                                className="w-full bg-[#050506] border border-white/5 p-8 rounded-[2.5rem] text-[11px] font-mono text-white/60 focus:border-accent/40 outline-none leading-relaxed transition-all shadow-2xl"
                                                                placeholder="ID:// Protocol..."
                                                            ></textarea>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* ── PROJECT ARCHIVE ── */}
                                            <div className="space-y-12">
                                                <div className="flex justify-between items-center px-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-3 h-[1px] bg-accent/40"></span>
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.8em] text-accent italic">Project Archive</h4>
                                                    </div>
                                                    <button onClick={() => addListItem('projects', { name: '', tech: '', desc: '', link: '' })} className="w-12 h-12 flex items-center justify-center bg-white/[0.02] text-accent hover:bg-accent hover:text-white transition-all rounded-2xl border border-white/5 hover:border-accent hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                                                        <Plus size={18} />
                                                    </button>
                                                </div>

                                                <div className="space-y-10">
                                                    {resumeData.projects?.map((proj, idx) => (
                                                        <div key={idx} className="bg-[#050506] border border-white/5 p-10 rounded-[3rem] relative overflow-hidden group/proj shadow-2xl">
                                                            <button onClick={() => removeListItem('projects', idx)} className="absolute top-8 right-8 text-white/10 hover:text-red-500 transition-colors z-20">
                                                                <Trash2 size={18} />
                                                            </button>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                                                                <div className="space-y-4">
                                                                    <label className="text-[8px] font-black text-white/20 uppercase tracking-widest italic ml-2">Designation</label>
                                                                    <input type="text" value={proj.name} onChange={e => updateListItem('projects', idx, 'name', e.target.value)} className="w-full bg-white/[0.02] border border-white/5 p-5 rounded-2xl text-sm font-black text-white italic" />
                                                                </div>
                                                                <div className="space-y-4">
                                                                    <label className="text-[8px] font-black text-white/20 uppercase tracking-widest italic ml-2">Stack Protocol</label>
                                                                    <input type="text" value={proj.tech} onChange={e => updateListItem('projects', idx, 'tech', e.target.value)} className="w-full bg-white/[0.02] border border-white/5 p-5 rounded-2xl text-[10px] font-mono text-accent" />
                                                                </div>
                                                                <div className="md:col-span-2 space-y-4">
                                                                    <label className="text-[8px] font-black text-white/20 uppercase tracking-widest italic ml-2">Mission Parameters</label>
                                                                    <textarea rows="2" value={proj.desc} onChange={e => updateListItem('projects', idx, 'desc', e.target.value)} className="w-full bg-white/[0.02] border border-white/5 p-7 rounded-[2.5rem] text-sm text-white/60"></textarea>
                                                                </div>
                                                                <div className="md:col-span-2 space-y-4">
                                                                    <label className="text-[8px] font-black text-white/20 uppercase tracking-widest italic ml-2">External Endpoint</label>
                                                                    <input type="text" value={proj.link} onChange={e => updateListItem('projects', idx, 'link', e.target.value)} className="w-full bg-transparent border-none p-0 text-[10px] text-white/30 italic truncate focus:ring-0" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* ── SIGNAL VERIFIERS ── */}
                                            <div className="space-y-12">
                                                <div className="flex justify-between items-center px-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-3 h-[1px] bg-accent/40"></span>
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.8em] text-accent italic">Signal Verifiers</h4>
                                                    </div>
                                                    <button onClick={() => addListItem('referees', { name: '', role: '', org: '', contact: '' })} className="w-12 h-12 flex items-center justify-center bg-white/[0.02] text-accent hover:bg-accent hover:text-white transition-all rounded-2xl border border-white/5 hover:border-accent hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                                                        <Plus size={18} />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                    {resumeData.referees?.map((ref, idx) => (
                                                        <div key={idx} className="bg-[#050506] border border-white/5 p-8 rounded-[2.5rem] relative group/ref shadow-2xl">
                                                            <button onClick={() => removeListItem('referees', idx)} className="absolute top-6 right-6 text-white/10 hover:text-red-500 transition-colors">
                                                                <Trash2 size={16} />
                                                            </button>
                                                            <div className="space-y-6 relative z-10">
                                                                <input type="text" placeholder="Verifier ID" value={ref.name} onChange={e => updateListItem('referees', idx, 'name', e.target.value)} className="w-full bg-transparent border-none p-0 text-sm font-black text-accent italic focus:ring-0" />
                                                                <input type="text" placeholder="Designation" value={ref.role} onChange={e => updateListItem('referees', idx, 'role', e.target.value)} className="w-full bg-transparent border-none p-0 text-xs text-white focus:ring-0" />
                                                                <div className="space-y-4 pt-4 border-t border-white/5">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-accent/20"></div>
                                                                        <input type="text" placeholder="Entity" value={ref.org} onChange={e => updateListItem('referees', idx, 'org', e.target.value)} className="flex-1 bg-transparent border-none p-0 text-[10px] text-white/40 focus:ring-0" />
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-accent/20"></div>
                                                                        <input type="text" placeholder="Contact Fragment" value={ref.contact} onChange={e => updateListItem('referees', idx, 'contact', e.target.value)} className="flex-1 bg-transparent border-none p-0 text-[10px] font-mono text-white/20 focus:ring-0" />
                                                                    </div>
                                                                </div>
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
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-24"
                                >
                                    <div className="bg-[#08080a] border border-white/5 rounded-[3rem] p-10 lg:p-16 relative overflow-hidden group/form shadow-2xl">
                                         <div className="absolute top-0 right-0 p-16 text-accent/[0.03] pointer-events-none group-hover/form:scale-110 group-hover/form:text-accent/[0.07] transition-all duration-1000">
                                            <FileText size={400} strokeWidth={0.5} />
                                        </div>
                                        
                                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8 relative z-10">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-8 h-[1px] bg-accent"></div>
                                                    <span className="text-[10px] font-black text-accent uppercase tracking-[0.5em] italic">Communication</span>
                                                </div>
                                                <h3 className="text-5xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none text-white">
                                                    Cover <br/>
                                                    <span className="text-accent underline decoration-accent/20 underline-offset-8">Letter</span>
                                                </h3>
                                            </div>
                                        </div>
                                        
                                        <div className="relative z-10 flex flex-col gap-10">
                                            <div className="space-y-4">
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] ml-4 italic">Message Payload</label>
                                                <textarea 
                                                    rows="18" 
                                                    value={coverLetter} 
                                                    onChange={e => setCoverLetter(e.target.value)} 
                                                    required 
                                                    className="w-full bg-[#050506] border border-white/5 p-8 rounded-[2.5rem] outline-none focus:border-accent/40 transition-all font-mono text-[11px] text-white/70 leading-relaxed shadow-2xl resize-y"
                                                    placeholder="Initialize transmission..."
                                                ></textarea>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <button onClick={saveCoverLetter} className="py-6 bg-white/[0.02] border border-white/5 text-white/40 hover:text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.4em] italic transition-all hover:bg-white/5">
                                                    Save Buffer
                                                </button>
                                                <button onClick={downloadCoverLetterPDF} className="py-6 bg-gradient-to-r from-accent to-[#4338ca] text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.4em] italic shadow-[0_20px_40px_rgba(99,102,241,0.3)] hover:shadow-[0_25px_60px_rgba(99,102,241,0.5)] hover:-translate-y-2 transition-all duration-500 active:scale-[0.98] flex items-center justify-center gap-3">
                                                    <Download size={14} /> Extract PDF
                                                </button>
                                                <button onClick={downloadCoverLetterWord} className="py-6 bg-white/[0.02] border border-white/5 text-accent hover:bg-accent hover:text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.4em] italic shadow-[0_0_20px_rgba(99,102,241,0.1)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.3)] hover:-translate-y-2 transition-all duration-500 active:scale-[0.98] flex items-center justify-center gap-3">
                                                    <Download size={14} /> Extract DOCX
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
                                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8 relative z-10">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-8 h-[1px] bg-accent"></div>
                                                    <span className="text-[10px] font-black text-accent uppercase tracking-[0.5em] italic">Environmental Config</span>
                                                </div>
                                                <h3 className="text-5xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none text-white">
                                                    Global <br/>
                                                    <span className="text-accent underline decoration-accent/20 underline-offset-8">Manifest</span>
                                                </h3>
                                            </div>
                                            <button 
                                                onClick={savePortfolioContent} 
                                                className="px-12 py-6 bg-gradient-to-r from-accent to-[#4338ca] text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.4em] italic shadow-[0_20px_40px_rgba(99,102,241,0.3)] hover:shadow-[0_25px_60px_rgba(99,102,241,0.5)] hover:-translate-y-2 transition-all duration-500 active:scale-[0.98] flex items-center gap-4 relative z-10"
                                            >
                                                {isLoading ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                ) : (
                                                    <>Broadcast Changes <Send size={18} /></>
                                                )}
                                            </button>
                                        </div>
                                        
                                        <div className="relative z-10 space-y-12">
                                            {/* ── HERO PROTOCOL ── */}
                                            <div className="space-y-12">
                                                <div className="flex items-center gap-4 px-4">
                                                    <div className="h-px flex-1 bg-gradient-to-r from-accent/40 to-transparent"></div>
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.8em] text-accent italic">Hero Protocol</h4>
                                                    <div className="h-px flex-1 bg-gradient-to-l from-accent/40 to-transparent"></div>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-6 gap-10">
                                                    <div className="space-y-4 md:col-span-2">
                                                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] ml-4 italic">Salutation</label>
                                                        <input type="text" value={portfolioContent.hero.greeting} onChange={e => updateContent('hero', 'greeting', e.target.value)} className="w-full bg-[#050506] border border-white/5 p-7 rounded-[2rem] outline-none focus:border-accent/40 transition-all font-bold text-white shadow-2xl" />
                                                    </div>
                                                    <div className="space-y-4 md:col-span-4">
                                                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] ml-4 italic">Primary Alias</label>
                                                        <input type="text" value={portfolioContent.hero.name} onChange={e => updateContent('hero', 'name', e.target.value)} className="w-full bg-[#050506] border border-white/5 p-7 rounded-[2rem] outline-none focus:border-accent/40 transition-all font-bold text-white shadow-2xl" />
                                                    </div>
                                                    <div className="space-y-4 md:col-span-6">
                                                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] ml-4 italic">Strategic Tagline</label>
                                                        <textarea rows="3" value={portfolioContent.hero.tagline} onChange={e => updateContent('hero', 'tagline', e.target.value)} className="w-full bg-[#050506] border border-white/5 p-8 rounded-[2.5rem] outline-none focus:border-accent/40 transition-all font-bold text-white/70 resize-none leading-relaxed shadow-2xl"></textarea>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ── ABOUT MATRIX ── */}
                                            <div className="space-y-12">
                                                <div className="flex justify-between items-center px-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-3 h-[1px] bg-accent/40"></span>
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.8em] text-accent italic">About Matrix</h4>
                                                    </div>
                                                    <button onClick={() => addPortfolioItem('aboutCards')} className="w-12 h-12 flex items-center justify-center bg-white/[0.02] text-accent hover:bg-accent hover:text-white transition-all rounded-2xl border border-white/5 hover:border-accent hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                                                        <Plus size={18} />
                                                    </button>
                                                </div>

                                                <div className="space-y-10">
                                                    <div className="space-y-4 px-4">
                                                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] ml-4 italic">System Briefing</label>
                                                        <textarea rows="6" value={portfolioContent.about.text} onChange={e => updateContent('about', 'text', e.target.value)} className="w-full bg-[#050506] border border-white/5 p-8 rounded-[3rem] outline-none focus:border-accent/40 transition-all font-medium text-white/60 leading-relaxed shadow-2xl"></textarea>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
                                                        {portfolioContent.about.cards?.map((card, idx) => (
                                                            <div key={card.id} className="bg-[#050506] border border-white/5 p-10 rounded-[3rem] relative overflow-hidden group/card hover:border-accent/30 transition-all duration-500 shadow-2xl">
                                                                <div className="absolute top-0 right-0 p-10 text-accent/[0.02] pointer-events-none group-hover/card:scale-110 transition-transform duration-700">
                                                                    <LayoutDashboard size={150} />
                                                                </div>
                                                                <button onClick={() => removePortfolioItem('aboutCards', card.id)} className="absolute top-8 right-8 text-white/10 hover:text-red-500 transition-colors z-20">
                                                                    <Trash2 size={18} />
                                                                </button>
                                                                
                                                                <div className="space-y-8 relative z-10">
                                                                    <div className="grid grid-cols-2 gap-8">
                                                                        <div className="space-y-3">
                                                                            <label className="text-[8px] font-black text-white/20 uppercase tracking-widest italic ml-2">Icon ID</label>
                                                                            <input type="text" value={card.icon} onChange={e => updatePortfolioItem('aboutCards', card.id, 'icon', e.target.value)} className="w-full bg-white/[0.02] border border-white/5 p-4 rounded-xl text-xs font-bold text-accent" />
                                                                        </div>
                                                                        <div className="space-y-3">
                                                                            <label className="text-[8px] font-black text-white/20 uppercase tracking-widest italic ml-2">Accent</label>
                                                                            <input type="color" value={card.color} onChange={e => updatePortfolioItem('aboutCards', card.id, 'color', e.target.value)} className="w-full h-12 bg-transparent border-none p-0 cursor-pointer" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-3">
                                                                        <label className="text-[8px] font-black text-white/20 uppercase tracking-widest italic ml-2">Designation</label>
                                                                        <input type="text" value={card.title} onChange={e => updatePortfolioItem('aboutCards', card.id, 'title', e.target.value)} className="w-full bg-white/[0.02] border border-white/5 p-5 rounded-2xl text-sm font-black text-white italic" />
                                                                    </div>
                                                                    <div className="space-y-3">
                                                                        <label className="text-[8px] font-black text-white/20 uppercase tracking-widest italic ml-2">Operational Data</label>
                                                                        <textarea rows="3" value={card.desc} onChange={e => updatePortfolioItem('aboutCards', card.id, 'desc', e.target.value)} className="w-full bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] text-xs leading-relaxed text-white/40"></textarea>
                                                                    </div>
                                                                    <label className="flex items-center gap-4 cursor-pointer group/check">
                                                                        <div className={`w-10 h-6 rounded-full transition-all flex items-center px-1 ${card.span ? 'bg-accent' : 'bg-white/5'}`}>
                                                                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${card.span ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                                                        </div>
                                                                        <input type="checkbox" checked={card.span} onChange={e => updatePortfolioItem('aboutCards', card.id, 'span', e.target.checked)} className="hidden" />
                                                                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest group-hover/check:text-white/60">Span 2 Columns</span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ── TESTIMONIAL REPOSITORY ── */}
                                            <div className="space-y-12">
                                                <div className="flex justify-between items-center px-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-3 h-[1px] bg-accent/40"></span>
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.8em] text-accent italic">Testimonial Repository</h4>
                                                    </div>
                                                    <button onClick={() => addPortfolioItem('testimonials')} className="w-12 h-12 flex items-center justify-center bg-white/[0.02] text-accent hover:bg-accent hover:text-white transition-all rounded-2xl border border-white/5 hover:border-accent hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                                                        <Plus size={18} />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                    {portfolioContent.testimonials?.map((t) => (
                                                        <div key={t.id} className="bg-[#050506] border border-white/5 p-10 rounded-[3rem] relative overflow-hidden group/t shadow-2xl">
                                                            <button onClick={() => removePortfolioItem('testimonials', t.id)} className="absolute top-8 right-8 text-white/10 hover:text-red-500 transition-colors">
                                                                <Trash2 size={18} />
                                                            </button>
                                                            <div className="space-y-8 relative z-10">
                                                                <div className="grid grid-cols-2 gap-8">
                                                                    <div className="space-y-3">
                                                                        <label className="text-[8px] font-black text-white/20 uppercase tracking-widest italic ml-2">Source Name</label>
                                                                        <input type="text" value={t.name} onChange={e => updatePortfolioItem('testimonials', t.id, 'name', e.target.value)} className="w-full bg-white/[0.02] border border-white/5 p-4 rounded-xl text-xs font-black text-white italic" />
                                                                    </div>
                                                                    <div className="space-y-3">
                                                                        <label className="text-[8px] font-black text-white/20 uppercase tracking-widest italic ml-2">Role / Unit</label>
                                                                        <input type="text" value={t.role} onChange={e => updatePortfolioItem('testimonials', t.id, 'role', e.target.value)} className="w-full bg-white/[0.02] border border-white/5 p-4 rounded-xl text-xs text-white/40" />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    <label className="text-[8px] font-black text-white/20 uppercase tracking-widest italic ml-2">Transmission Data</label>
                                                                    <textarea rows="3" value={t.text} onChange={e => updatePortfolioItem('testimonials', t.id, 'text', e.target.value)} className="w-full bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] text-[13px] leading-relaxed text-white/60 italic"></textarea>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {(!portfolioContent.testimonials || portfolioContent.testimonials.length === 0) && (
                                                        <div className="md:col-span-2 py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] text-white/10 text-[10px] font-black uppercase tracking-[0.5em] italic">
                                                            Neutral: No Testimonials Available
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* ── CONTACT & SOCIALS ── */}
                                            <div className="pt-24 border-t border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-16">
                                                <div className="space-y-12">
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.8em] text-accent italic px-4">Direct Comms</h4>
                                                    <div className="space-y-8">
                                                        <div className="space-y-3">
                                                            <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] ml-4 italic">Main Endpoint (Email)</label>
                                                            <input type="email" value={portfolioContent.contact?.email} onChange={e => updateContent('contact', 'email', e.target.value)} className="w-full bg-[#050506] border border-white/5 p-7 rounded-[2rem] outline-none focus:border-accent/40 transition-all font-bold text-white shadow-2xl" />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-8">
                                                            <div className="space-y-3">
                                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] ml-4 italic">Signal ID (Phone)</label>
                                                                <input type="text" value={portfolioContent.contact?.phone} onChange={e => updateContent('contact', 'phone', e.target.value)} className="w-full bg-[#050506] border border-white/5 p-7 rounded-[2rem] outline-none focus:border-accent/40 transition-all font-bold text-white shadow-2xl" />
                                                            </div>
                                                            <div className="space-y-3">
                                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] ml-4 italic">Geocode (Location)</label>
                                                                <input type="text" value={portfolioContent.contact?.location} onChange={e => updateContent('contact', 'location', e.target.value)} className="w-full bg-[#050506] border border-white/5 p-7 rounded-[2rem] outline-none focus:border-accent/40 transition-all font-bold text-white shadow-2xl" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-12">
                                                    <div className="flex justify-between items-center px-4">
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.8em] text-accent italic">Social Nodes</h4>
                                                        <button onClick={() => addPortfolioItem('socials')} className="w-10 h-10 flex items-center justify-center bg-white/[0.02] text-accent hover:bg-accent hover:text-white transition-all rounded-xl border border-white/5">
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-6">
                                                        {portfolioContent.socials?.map((s) => (
                                                            <div key={s.id} className="bg-[#050506] border border-white/5 p-6 rounded-[2rem] flex items-center gap-6 group/s hover:border-accent/30 transition-all shadow-xl">
                                                                <div className="w-12 h-12 rounded-2xl bg-white/[0.02] flex items-center justify-center text-accent/40 group-hover/s:text-accent transition-colors">
                                                                    <Github size={20} />
                                                                </div>
                                                                <div className="flex-1 grid grid-cols-2 gap-4">
                                                                    <input type="text" placeholder="Platform" value={s.platform} onChange={e => updatePortfolioItem('socials', s.id, 'platform', e.target.value)} className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest focus:ring-0 text-white italic" />
                                                                    <input type="text" placeholder="URL Endpoint" value={s.href} onChange={e => updatePortfolioItem('socials', s.id, 'href', e.target.value)} className="bg-transparent border-none text-[10px] text-white/30 focus:ring-0 truncate" />
                                                                </div>
                                                                <button onClick={() => removePortfolioItem('socials', s.id)} className="p-3 text-white/10 hover:text-red-500 transition-colors">
                                                                    <Trash2 size={16} />
                                                                </button>
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
        </div>
    </main>
);
};

export default AdminDashboard;
