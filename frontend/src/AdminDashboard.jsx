import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' | 'error'

    // Form States
    const [projectForm, setProjectForm] = useState({ title: '', description: '', techStack: '', image: '', demoLink: '', githubLink: '' });
    const [skillForm, setSkillForm] = useState({ name: '', icon: '', level: 50, category: 'frontend' });

    // Edit States
    const [editingProject, setEditingProject] = useState(null);
    const [editingSkill, setEditingSkill] = useState(null);

    useEffect(() => {
        if (!token) {
            window.location.href = '/login';
        } else {
            fetchProjects();
            fetchSkills();
        }
    }, [token]);

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/admin/projects', {
                headers: { 'x-auth-token': token }
            });
            const data = await res.json();
            if (res.ok) setProjects(data);
        } catch (err) { showMessage('Failed to fetch projects', 'error'); }
    };

    const fetchSkills = async () => {
        try {
            const res = await fetch('/api/admin/skills', {
                headers: { 'x-auth-token': token }
            });
            const data = await res.json();
            if (res.ok) setSkills(data);
        } catch (err) { showMessage('Failed to fetch skills', 'error'); }
    };

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        const techStackArray = projectForm.techStack.includes(',')
            ? projectForm.techStack.split(',').map(t => t.trim())
            : (Array.isArray(projectForm.techStack) ? projectForm.techStack : [projectForm.techStack]);

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
                setProjectForm({ title: '', description: '', techStack: '', image: '', demoLink: '', githubLink: '' });
                setEditingProject(null);
                showMessage(editingProject ? 'Project updated!' : 'Project added!');
            } else {
                showMessage('Failed to save project', 'error');
            }
        } catch (err) { console.error(err); }
    };

    const handleSkillSubmit = async (e) => {
        e.preventDefault();
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
                setSkillForm({ name: '', icon: '', level: 50, category: 'frontend' });
                setEditingSkill(null);
                showMessage(editingSkill ? 'Skill updated!' : 'Skill added!');
            } else {
                showMessage('Failed to save skill', 'error');
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
            if (res.ok) {
                fetchProjects();
                showMessage('Project deleted');
            }
        } catch (err) { console.error(err); }
    }

    const handleDeleteSkill = async (id) => {
        if (!window.confirm("Delete this skill?")) return;
        try {
            const res = await fetch(`/api/admin/skills/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                fetchSkills();
                showMessage('Skill deleted');
            }
        } catch (err) { console.error(err); }
    }

    const startEditProject = (project) => {
        setEditingProject(project);
        setProjectForm({
            ...project,
            techStack: project.techStack.join(', ')
        });
        window.scrollTo(0, 0);
    };

    const startEditSkill = (skill) => {
        setEditingSkill(skill);
        setSkillForm(skill);
        window.scrollTo(0, 0);
    };

    const cancelEdit = () => {
        setEditingProject(null);
        setEditingSkill(null);
        setProjectForm({ title: '', description: '', techStack: '', image: '', demoLink: '', githubLink: '' });
        setSkillForm({ name: '', icon: '', level: 50, category: 'frontend' });
    };

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

                {message.text && (
                    <div style={{
                        padding: '1rem',
                        marginBottom: '1rem',
                        borderRadius: '4px',
                        backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce7',
                        color: message.type === 'error' ? '#ef4444' : '#166534'
                    }}>
                        {message.text}
                    </div>
                )}

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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
                                {editingProject && <button onClick={cancelEdit} className="btn secondary" style={{ fontSize: '0.8rem' }}>Cancel</button>}
                            </div>
                            <form onSubmit={handleProjectSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                                <input type="text" placeholder="Title" value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} required style={{ padding: '0.5rem' }} />
                                <input type="text" placeholder="Image URL / Path" value={projectForm.image} onChange={e => setProjectForm({ ...projectForm, image: e.target.value })} style={{ padding: '0.5rem' }} />
                                <textarea placeholder="Description" value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} required style={{ gridColumn: '1 / -1', padding: '0.5rem' }}></textarea>
                                <input type="text" placeholder="Tech Stack (comma separated)" value={projectForm.techStack} onChange={e => setProjectForm({ ...projectForm, techStack: e.target.value })} style={{ gridColumn: '1 / -1', padding: '0.5rem' }} />
                                <input type="text" placeholder="Demo Link" value={projectForm.demoLink} onChange={e => setProjectForm({ ...projectForm, demoLink: e.target.value })} style={{ padding: '0.5rem' }} />
                                <input type="text" placeholder="GitHub Link" value={projectForm.githubLink} onChange={e => setProjectForm({ ...projectForm, githubLink: e.target.value })} style={{ padding: '0.5rem' }} />
                                <button type="submit" className="btn primary" style={{ gridColumn: '1 / -1' }}>{editingProject ? 'Update Project' : 'Add Project'}</button>
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
                                        <div>
                                            <button onClick={() => startEditProject(p)} className="btn secondary" style={{ marginRight: '0.5rem', padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>Edit</button>
                                            <button onClick={() => handleDeleteProject(p._id)} className="btn" style={{ background: '#ef4444', color: 'white', padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'skills' && (
                    <div className="skills-manager">
                        <div className="card" style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</h3>
                                {editingSkill && <button onClick={cancelEdit} className="btn secondary" style={{ fontSize: '0.8rem' }}>Cancel</button>}
                            </div>
                            <form onSubmit={handleSkillSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                                <input type="text" placeholder="Skill Name" value={skillForm.name} onChange={e => setSkillForm({ ...skillForm, name: e.target.value })} required style={{ padding: '0.5rem' }} />
                                <input type="text" placeholder="FontAwesome Icon (e.g., fa-react)" value={skillForm.icon} onChange={e => setSkillForm({ ...skillForm, icon: e.target.value })} required style={{ padding: '0.5rem' }} />
                                <input type="number" placeholder="Level (0-100)" value={skillForm.level} onChange={e => setSkillForm({ ...skillForm, level: e.target.value })} style={{ padding: '0.5rem' }} />
                                <select value={skillForm.category} onChange={e => setSkillForm({ ...skillForm, category: e.target.value })} style={{ padding: '0.5rem' }}>
                                    <option value="frontend">Frontend</option>
                                    <option value="backend">Backend</option>
                                    <option value="tools">Tools</option>
                                </select>
                                <button type="submit" className="btn primary" style={{ gridColumn: '1 / -1' }}>{editingSkill ? 'Update Skill' : 'Add Skill'}</button>
                            </form>
                        </div>

                        <div className="skills-list">
                            <h3>Current Skills</h3>
                            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                                {skills.map(s => (
                                    <div key={s._id} className="card" style={{ textAlign: 'center', position: 'relative' }}>
                                        <i className={`fab ${s.icon} fa-2x`} style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}></i>
                                        <h4>{s.name}</h4>
                                        <p>{s.category}</p>
                                        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                            <button onClick={() => startEditSkill(s)} className="btn secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>Edit</button>
                                            <button onClick={() => handleDeleteSkill(s._id)} className="btn" style={{ background: '#ef4444', color: 'white', padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>Delete</button>
                                        </div>
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
