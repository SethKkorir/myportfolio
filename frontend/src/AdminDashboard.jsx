import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Form States
    const [projectForm, setProjectForm] = useState({ title: '', description: '', techStack: '', image: '', demoLink: '', githubLink: '' });
    const [skillForm, setSkillForm] = useState({ name: '', icon: '', level: 50, category: 'frontend' });

    useEffect(() => {
        if (!token) {
            window.location.href = '/login';
        } else {
            fetchProjects();
            fetchSkills();
        }
    }, [token]);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/admin/projects', {
                headers: { 'x-auth-token': token }
            });
            const data = await res.json();
            if (res.ok) setProjects(data);
        } catch (err) { console.error(err); }
    };

    const fetchSkills = async () => {
        try {
            const res = await fetch('/api/admin/skills', {
                headers: { 'x-auth-token': token }
            });
            const data = await res.json();
            if (res.ok) setSkills(data);
        } catch (err) { console.error(err); }
    };

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        const techStackArray = projectForm.techStack.split(',').map(t => t.trim());
        try {
            const res = await fetch('/api/admin/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ ...projectForm, techStack: techStackArray })
            });
            if (res.ok) {
                fetchProjects();
                setProjectForm({ title: '', description: '', techStack: '', image: '', demoLink: '', githubLink: '' });
            }
        } catch (err) { console.error(err); }
    };

    const handleSkillSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/skills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(skillForm)
            });
            if (res.ok) {
                fetchSkills();
                setSkillForm({ name: '', icon: '', level: 50, category: 'frontend' });
            }
        } catch (err) { console.error(err); }
    };

    const handleDeleteProject = async (id) => {
        if (!window.confirm("Delete this project?")) return;
        try {
            const res = await fetch(`/api/admin/projects/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) fetchProjects();
        } catch (err) { console.error(err); }
    }

    const handleDeleteSkill = async (id) => {
        if (!window.confirm("Delete this skill?")) return;
        try {
            const res = await fetch(`/api/admin/skills/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) fetchSkills();
        } catch (err) { console.error(err); }
    }

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <section className="admin-dashboard" style={{ paddingTop: '100px', minHeight: '100vh' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2>Admin Dashboard</h2>
                    <button onClick={logout} className="btn secondary">Logout</button>
                </div>

                <div className="tabs" style={{ marginBottom: '2rem' }}>
                    <button
                        className={`btn ${activeTab === 'projects' ? 'primary' : 'secondary'}`}
                        onClick={() => setActiveTab('projects')}
                        style={{ marginRight: '1rem' }}
                    >
                        Projects
                    </button>
                    <button
                        className={`btn ${activeTab === 'skills' ? 'primary' : 'secondary'}`}
                        onClick={() => setActiveTab('skills')}
                    >
                        Skills
                    </button>
                </div>

                {activeTab === 'projects' && (
                    <div className="projects-manager">
                        <div className="card" style={{ marginBottom: '2rem' }}>
                            <h3>Add New Project</h3>
                            <form onSubmit={handleProjectSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                                <input type="text" placeholder="Title" value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} required style={{ padding: '0.5rem' }} />
                                <input type="text" placeholder="Image URL / Path" value={projectForm.image} onChange={e => setProjectForm({ ...projectForm, image: e.target.value })} style={{ padding: '0.5rem' }} />
                                <textarea placeholder="Description" value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} required style={{ gridColumn: '1 / -1', padding: '0.5rem' }}></textarea>
                                <input type="text" placeholder="Tech Stack (comma separated)" value={projectForm.techStack} onChange={e => setProjectForm({ ...projectForm, techStack: e.target.value })} style={{ gridColumn: '1 / -1', padding: '0.5rem' }} />
                                <input type="text" placeholder="Demo Link" value={projectForm.demoLink} onChange={e => setProjectForm({ ...projectForm, demoLink: e.target.value })} style={{ padding: '0.5rem' }} />
                                <input type="text" placeholder="GitHub Link" value={projectForm.githubLink} onChange={e => setProjectForm({ ...projectForm, githubLink: e.target.value })} style={{ padding: '0.5rem' }} />
                                <button type="submit" className="btn primary" style={{ gridColumn: '1 / -1' }}>Add Project</button>
                            </form>
                        </div>

                        <div className="projects-list">
                            <h3>Current Projects</h3>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {projects.map(p => (
                                    <div key={p._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4>{p.title}</h4>
                                            <small>{p.description.substring(0, 50)}...</small>
                                        </div>
                                        <button onClick={() => handleDeleteProject(p._id)} className="btn" style={{ background: '#ef4444', color: 'white' }}>Delete</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'skills' && (
                    <div className="skills-manager">
                        <div className="card" style={{ marginBottom: '2rem' }}>
                            <h3>Add New Skill</h3>
                            <form onSubmit={handleSkillSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                                <input type="text" placeholder="Skill Name" value={skillForm.name} onChange={e => setSkillForm({ ...skillForm, name: e.target.value })} required style={{ padding: '0.5rem' }} />
                                <input type="text" placeholder="FontAwesome Icon (e.g., fa-react)" value={skillForm.icon} onChange={e => setSkillForm({ ...skillForm, icon: e.target.value })} required style={{ padding: '0.5rem' }} />
                                <input type="number" placeholder="Level (0-100)" value={skillForm.level} onChange={e => setSkillForm({ ...skillForm, level: e.target.value })} style={{ padding: '0.5rem' }} />
                                <select value={skillForm.category} onChange={e => setSkillForm({ ...skillForm, category: e.target.value })} style={{ padding: '0.5rem' }}>
                                    <option value="frontend">Frontend</option>
                                    <option value="backend">Backend</option>
                                    <option value="tools">Tools</option>
                                </select>
                                <button type="submit" className="btn primary" style={{ gridColumn: '1 / -1' }}>Add Skill</button>
                            </form>
                        </div>

                        <div className="skills-list">
                            <h3>Current Skills</h3>
                            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                                {skills.map(s => (
                                    <div key={s._id} className="card" style={{ textAlign: 'center' }}>
                                        <i className={`fab ${s.icon} fa-2x`} style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}></i>
                                        <h4>{s.name}</h4>
                                        <p>{s.category}</p>
                                        <button onClick={() => handleDeleteSkill(s._id)} className="btn" style={{ background: '#ef4444', color: 'white', marginTop: '0.5rem', padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>Delete</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AdminDashboard;
