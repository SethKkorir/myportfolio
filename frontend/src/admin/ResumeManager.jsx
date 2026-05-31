import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Save, Plus, Trash2, ChevronRight, Briefcase, GraduationCap, Users, Award, Code, Sparkles, Loader2, Edit3 } from 'lucide-react';

const ResumeManager = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [resumeData, setResumeData] = useState({
    name: "Seth Kipchumba Korir",
    title: "",
    summary: "",
    contact: { email: "", phone: "", location: "", github: "", linkedin: "" },
    experience: [],
    education: [],
    skills: { frontend: [], backend: [], tools: [] },
    projects: [],
    referees: []
  });

  const [alert, setAlert] = useState({ type: '', text: '' });

  // Input states for dynamic builders
  const [newExp, setNewExp] = useState({ role: '', org: '', time: '', pointsInput: '' });
  const [newEdu, setNewEdu] = useState({ degree: '', school: '', time: '' });
  const [newCvProj, setNewCvProj] = useState({ name: '', tech: '', desc: '', link: '' });
  const [newRef, setNewRef] = useState({ name: '', role: '', org: '', contact: '' });

  // Editing state trackers for saved items
  const [editingExpIdx, setEditingExpIdx] = useState(null);
  const [editingEduIdx, setEditingEduIdx] = useState(null);
  const [editingCvProjIdx, setEditingCvProjIdx] = useState(null);
  const [editingRefIdx, setEditingRefIdx] = useState(null);

  // Skills input states (string chips)
  const [feSkills, setFeSkills] = useState('');
  const [beSkills, setBeSkills] = useState('');
  const [tlSkills, setTlSkills] = useState('');

  const fetchResume = async () => {
    try {
      const res = await fetch('/api/admin/resume');
      if (res.ok) {
        let data = await res.json();
        if (Array.isArray(data)) data = data[0] || {};
        
        const loaded = {
          _id: data._id,
          name: data.name || "Seth Kipchumba Korir",
          title: data.title || "",
          summary: data.summary || "",
          contact: data.contact || { email: "", phone: "", location: "", github: "", linkedin: "" },
          experience: data.experience || [],
          education: data.education || [],
          skills: {
            frontend: data.skills?.frontend || [],
            backend: data.skills?.backend || [],
            tools: data.skills?.tools || []
          },
          projects: data.projects || [],
          referees: data.referees || []
        };
        
        setResumeData(loaded);

        // Pre-populate skills strings
        setFeSkills(loaded.skills.frontend.join(', '));
        setBeSkills(loaded.skills.backend.join(', '));
        setTlSkills(loaded.skills.tools.join(', '));
      }
    } catch (err) {
      showAlert('error', 'Failed to retrieve CV data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert({ type: '', text: '' }), 4000);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    const formattedSkills = {
      frontend: feSkills.split(',').map(s => s.trim()).filter(s => s !== ''),
      backend: beSkills.split(',').map(s => s.trim()).filter(s => s !== ''),
      tools: tlSkills.split(',').map(s => s.trim()).filter(s => s !== '')
    };

    const payload = {
      ...resumeData,
      skills: formattedSkills
    };

    try {
      const res = await fetch('/api/admin/resume', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await res.json();
        showAlert('success', 'CV Resume data updated successfully!');
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Failed to save resume');
      }
    } catch (err) {
      showAlert('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const addExperience = () => {
    if (!newExp.role || !newExp.org) return;
    const points = newExp.pointsInput.split('\n').map(p => p.trim()).filter(p => p !== '');
    
    if (editingExpIdx !== null) {
      const updated = [...resumeData.experience];
      updated[editingExpIdx] = { role: newExp.role, org: newExp.org, time: newExp.time, points };
      setResumeData({ ...resumeData, experience: updated });
      setEditingExpIdx(null);
      showAlert('success', 'Experience slot updated! Press "Update CV Document" to save.');
    } else {
      setResumeData({
        ...resumeData,
        experience: [...resumeData.experience, { role: newExp.role, org: newExp.org, time: newExp.time, points }]
      });
      showAlert('success', 'Experience slot added! Press "Update CV Document" to save.');
    }
    setNewExp({ role: '', org: '', time: '', pointsInput: '' });
  };

  const startEditExperience = (idx) => {
    const exp = resumeData.experience[idx];
    setNewExp({
      role: exp.role || '',
      org: exp.org || '',
      time: exp.time || '',
      pointsInput: Array.isArray(exp.points) ? exp.points.join('\n') : ''
    });
    setEditingExpIdx(idx);
  };

  const deleteExperience = (idx) => {
    const updated = [...resumeData.experience];
    updated.splice(idx, 1);
    setResumeData({ ...resumeData, experience: updated });
    if (editingExpIdx === idx) {
      setEditingExpIdx(null);
      setNewExp({ role: '', org: '', time: '', pointsInput: '' });
    }
  };

  const addEducation = () => {
    if (!newEdu.degree || !newEdu.school) return;
    
    if (editingEduIdx !== null) {
      const updated = [...resumeData.education];
      updated[editingEduIdx] = newEdu;
      setResumeData({ ...resumeData, education: updated });
      setEditingEduIdx(null);
      showAlert('success', 'Education slot updated! Press "Update CV Document" to save.');
    } else {
      setResumeData({
        ...resumeData,
        education: [...resumeData.education, newEdu]
      });
      showAlert('success', 'Education slot added! Press "Update CV Document" to save.');
    }
    setNewEdu({ degree: '', school: '', time: '' });
  };

  const startEditEducation = (idx) => {
    setNewEdu(resumeData.education[idx]);
    setEditingEduIdx(idx);
  };

  const deleteEducation = (idx) => {
    const updated = [...resumeData.education];
    updated.splice(idx, 1);
    setResumeData({ ...resumeData, education: updated });
    if (editingEduIdx === idx) {
      setEditingEduIdx(null);
      setNewEdu({ degree: '', school: '', time: '' });
    }
  };

  const addCvProject = () => {
    if (!newCvProj.name) return;
    
    if (editingCvProjIdx !== null) {
      const updated = [...resumeData.projects];
      updated[editingCvProjIdx] = newCvProj;
      setResumeData({ ...resumeData, projects: updated });
      setEditingCvProjIdx(null);
      showAlert('success', 'CV Project updated! Press "Update CV Document" to save.');
    } else {
      setResumeData({
        ...resumeData,
        projects: [...resumeData.projects, newCvProj]
      });
      showAlert('success', 'CV Project cataloged! Press "Update CV Document" to save.');
    }
    setNewCvProj({ name: '', tech: '', desc: '', link: '' });
  };

  const startEditCvProject = (idx) => {
    setNewCvProj(resumeData.projects[idx]);
    setEditingCvProjIdx(idx);
  };

  const deleteCvProject = (idx) => {
    const updated = [...resumeData.projects];
    updated.splice(idx, 1);
    setResumeData({ ...resumeData, projects: updated });
    if (editingCvProjIdx === idx) {
      setEditingCvProjIdx(null);
      setNewCvProj({ name: '', tech: '', desc: '', link: '' });
    }
  };

  const addReferee = () => {
    if (!newRef.name || !newRef.contact) return;
    
    if (editingRefIdx !== null) {
      const updated = [...resumeData.referees];
      updated[editingRefIdx] = newRef;
      setResumeData({ ...resumeData, referees: updated });
      setEditingRefIdx(null);
      showAlert('success', 'Referee updated! Press "Update CV Document" to save.');
    } else {
      setResumeData({
        ...resumeData,
        referees: [...resumeData.referees, newRef]
      });
      showAlert('success', 'Referee compiled! Press "Update CV Document" to save.');
    }
    setNewRef({ name: '', role: '', org: '', contact: '' });
  };

  const startEditReferee = (idx) => {
    setNewRef(resumeData.referees[idx]);
    setEditingRefIdx(idx);
  };

  const deleteReferee = (idx) => {
    const updated = [...resumeData.referees];
    updated.splice(idx, 1);
    setResumeData({ ...resumeData, referees: updated });
    if (editingRefIdx === idx) {
      setEditingRefIdx(null);
      setNewRef({ name: '', role: '', org: '', contact: '' });
    }
  };

  const syncProjectsFromDatabase = async () => {
    if (!window.confirm('This will load all featured projects from your database and format them for your CV, replacing the current CV projects list. Proceed?')) return;
    try {
      const res = await fetch('/api/admin/projects');
      if (res.ok) {
        const dbProjs = await res.json();
        const formatted = dbProjs.map(p => ({
          name: p.title,
          tech: Array.isArray(p.techStack) ? p.techStack.join(' | ') : p.techStack,
          desc: p.description,
          link: p.githubLink || p.demoLink || '#'
        }));
        setResumeData({ ...resumeData, projects: formatted });
        showAlert('success', 'Projects synchronized from main database! Press "Update CV Document" to write changes.');
      }
    } catch (err) {
      showAlert('error', 'Sync failed');
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "240px" }}>
        <Loader2 className="animate-spin" style={{ color: "var(--admin-accent-blue)" }} size={32} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", fontFamily: "var(--admin-font-main)" }}>
      {/* Toast alert */}
      <AnimatePresence>
        {alert.text && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            style={{
              position: "fixed",
              top: "24px",
              right: "24px",
              zIndex: 9999,
              padding: "1rem 1.25rem",
              borderRadius: "1rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              boxShadow: "var(--admin-shadow-lg)",
              backgroundColor: alert.type === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
              border: `1px solid ${alert.type === "success" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
              color: alert.type === "success" ? "var(--admin-accent-emerald)" : "var(--admin-accent-red)",
              fontFamily: "var(--admin-font-main)"
            }}
          >
            <span style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: alert.type === "success" ? "var(--admin-accent-emerald)" : "var(--admin-accent-red)",
              display: "inline-block"
            }}></span>
            {alert.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header bar */}
      <div className="admin-workspace-title-row" style={{ marginBottom: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText className="text-blue-500" style={{ color: "var(--admin-accent-blue)" }} size={22} /> CV & Resume Builder
          </h2>
          <p>Configure full printable CV records and experience timelines</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="admin-editor-btn-submit"
          style={{ margin: 0, padding: '0.85rem 1.75rem' }}
        >
          {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
          Update CV Document
        </button>
      </div>

      {/* Primary Layout grid (left sidebar, right dynamic form panels) */}
      <div className="admin-cv-timeline-layout">
        
        {/* Accordion / Sidebar menu */}
        <div className="admin-cv-sidebar-menu">
          <p className="admin-cv-panel-header" style={{ marginBottom: '0.5rem', border: 'none', fontSize: '0.62rem', color: 'var(--admin-text-muted)', paddingBottom: '0.25rem' }}>CV Sections</p>
          {[
            { id: 'profile', label: '👤 Profile & Contact', icon: Sparkles },
            { id: 'experience', label: '💼 Work Experience', icon: Briefcase },
            { id: 'education', label: '🎓 Academic slots', icon: GraduationCap },
            { id: 'skills', label: '🛠 Core Skills Chips', icon: Award },
            { id: 'projects', label: '💻 CV Project List', icon: Code },
            { id: 'referees', label: '⭐ Referee Records', icon: Users }
          ].map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`admin-cv-sidebar-menu-btn ${isActive ? 'admin-cv-sidebar-menu-btn-active' : ''}`}
              >
                <Icon size={13} /> {sec.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic viewport panels */}
        <div className="admin-editor-panel" style={{ margin: 0, minHeight: '450px' }}>
          
          {/* PROFILE & CONTACT */}
          {activeSection === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h4 className="admin-cv-panel-header">Profile Header</h4>
              
              <div className="admin-editor-form-grid">
                <div className="admin-input-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={resumeData.name}
                    onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                    className="admin-input-field"
                  />
                </div>

                <div className="admin-input-group">
                  <label>Professional Title</label>
                  <input
                    type="text"
                    value={resumeData.title}
                    onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
                    placeholder="e.g. Junior Web Developer"
                    className="admin-input-field"
                  />
                </div>

                <div className="admin-input-group admin-editor-form-grid-full">
                  <label>Professional Summary (CV Bio)</label>
                  <textarea
                    value={resumeData.summary}
                    onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                    rows={4}
                    className="admin-editor-form-textarea"
                  />
                </div>
              </div>

              <h4 className="admin-cv-panel-header" style={{ marginTop: '1rem' }}>CV Direct Contact</h4>

              <div className="admin-editor-form-grid">
                <div className="admin-input-group">
                  <label>Direct Email</label>
                  <input
                    type="email"
                    value={resumeData.contact.email}
                    onChange={(e) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, email: e.target.value } })}
                    className="admin-input-field"
                  />
                </div>

                <div className="admin-input-group">
                  <label>Phone Call Line</label>
                  <input
                    type="text"
                    value={resumeData.contact.phone}
                    onChange={(e) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, phone: e.target.value } })}
                    className="admin-input-field"
                  />
                </div>

                <div className="admin-input-group">
                  <label>Physical Location</label>
                  <input
                    type="text"
                    value={resumeData.contact.location}
                    onChange={(e) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, location: e.target.value } })}
                    className="admin-input-field"
                  />
                </div>

                <div className="admin-input-group">
                  <label>GitHub Link</label>
                  <input
                    type="text"
                    value={resumeData.contact.github}
                    onChange={(e) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, github: e.target.value } })}
                    className="admin-input-field"
                  />
                </div>

                <div className="admin-input-group admin-editor-form-grid-full">
                  <label>LinkedIn Profile Link</label>
                  <input
                    type="text"
                    value={resumeData.contact.linkedin}
                    onChange={(e) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, linkedin: e.target.value } })}
                    className="admin-input-field"
                  />
                </div>
              </div>
            </div>
          )}

          {/* WORK EXPERIENCE */}
          {activeSection === 'experience' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h4 className="admin-cv-panel-header">Work Experience Registry</h4>
              
              {/* Constructor Box */}
              <div className="admin-cv-constructor-box">
                <div className="admin-editor-form-grid">
                  <div className="admin-input-group">
                    <label>Role / Position</label>
                    <input
                      type="text"
                      value={newExp.role}
                      onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                      placeholder="e.g. Attachment Trainee"
                      className="admin-input-field"
                    />
                  </div>

                  <div className="admin-input-group">
                    <label>Organization / Company</label>
                    <input
                      type="text"
                      value={newExp.org}
                      onChange={(e) => setNewExp({ ...newExp, org: e.target.value })}
                      placeholder="e.g. Techsavanna Co. Ltd"
                      className="admin-input-field"
                    />
                  </div>

                  <div className="admin-input-group">
                    <label>Time Duration</label>
                    <input
                      type="text"
                      value={newExp.time}
                      onChange={(e) => setNewExp({ ...newExp, time: e.target.value })}
                      placeholder="e.g. June 2024 – August 2024"
                      className="admin-input-field"
                    />
                  </div>

                  <div className="admin-input-group">
                    <label>Key Responsibilities (One per line)</label>
                    <textarea
                      value={newExp.pointsInput}
                      onChange={(e) => setNewExp({ ...newExp, pointsInput: e.target.value })}
                      placeholder="Integrated REST APIs...&#10;Documented endpoints on Postman..."
                      rows={3}
                      className="admin-editor-form-textarea"
                    />
                  </div>

                  <div className="admin-editor-form-grid-full" style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    {editingExpIdx !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingExpIdx(null);
                          setNewExp({ role: '', org: '', time: '', pointsInput: '' });
                        }}
                        className="admin-editor-btn-cancel"
                        style={{ margin: 0, padding: '0.6rem 1.25rem', fontSize: '0.68rem' }}
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={addExperience}
                      className="admin-editor-btn-submit"
                      style={{ flex: 1, justifyContent: 'center', margin: 0 }}
                    >
                      <Plus size={14} /> {editingExpIdx !== null ? "Update Experience Block" : "Inject Experience Block"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Showcase experience */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                <h5 className="admin-cv-panel-header" style={{ border: 'none', marginBottom: 0, paddingBottom: 0 }}>Active Experience Record</h5>
                
                {resumeData.experience.length === 0 ? (
                  <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.72rem', fontStyle: 'italic' }}>No work slots configured</p>
                ) : (
                  resumeData.experience.map((exp, index) => (
                    <div key={index} className="admin-cv-item-card">
                      <div className="admin-cv-item-card-header">
                        <div>
                          <span className="admin-cv-item-card-time">{exp.time}</span>
                          <h6 className="admin-cv-item-card-title">{exp.role}</h6>
                          <p className="admin-cv-item-card-org">{exp.org}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => startEditExperience(index)}
                            className="admin-cv-item-delete-btn"
                            style={{ color: 'var(--admin-accent-blue)' }}
                            title="Edit slot"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteExperience(index)}
                            className="admin-cv-item-delete-btn"
                            title="Delete slot"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <ul className="admin-cv-item-card-points">
                        {(exp.points || []).map((pt, idx) => (
                          <li key={idx}>
                            <ChevronRight size={10} />
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* EDUCATION SLOTS */}
          {activeSection === 'education' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h4 className="admin-cv-panel-header">Academic Degrees & Education</h4>
              
              {/* Constructor Box */}
              <div className="admin-cv-constructor-box">
                <div className="admin-editor-form-grid">
                  <div className="admin-input-group">
                    <label>Degree / Certificate</label>
                    <input
                      type="text"
                      value={newEdu.degree}
                      onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                      placeholder="e.g. Diploma in ICT"
                      className="admin-input-field"
                    />
                  </div>

                  <div className="admin-input-group">
                    <label>School / University</label>
                    <input
                      type="text"
                      value={newEdu.school}
                      onChange={(e) => setNewEdu({ ...newEdu, school: e.target.value })}
                      placeholder="e.g. Daystar University"
                      className="admin-input-field"
                    />
                  </div>

                  <div className="admin-input-group">
                    <label>Time Frame</label>
                    <input
                      type="text"
                      value={newEdu.time}
                      onChange={(e) => setNewEdu({ ...newEdu, time: e.target.value })}
                      placeholder="e.g. 2023 – 2024"
                      className="admin-input-field"
                    />
                  </div>

                  <div className="admin-editor-form-grid-full" style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    {editingEduIdx !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingEduIdx(null);
                          setNewEdu({ degree: '', school: '', time: '' });
                        }}
                        className="admin-editor-btn-cancel"
                        style={{ margin: 0, padding: '0.6rem 1.25rem', fontSize: '0.68rem' }}
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={addEducation}
                      className="admin-editor-btn-submit"
                      style={{ flex: 1, justifyContent: 'center', margin: 0 }}
                    >
                      <Plus size={14} /> {editingEduIdx !== null ? "Update Education Slot" : "Inject Education Slot"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Active list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                <h5 className="admin-cv-panel-header" style={{ border: 'none', marginBottom: 0, paddingBottom: 0 }}>Active Academic Records</h5>
                
                {resumeData.education.length === 0 ? (
                  <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.72rem', fontStyle: 'italic' }}>No education slots established</p>
                ) : (
                  resumeData.education.map((edu, index) => (
                    <div key={index} className="admin-cv-item-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span className="admin-cv-item-card-time">{edu.time}</span>
                        <h6 className="admin-cv-item-card-title">{edu.degree}</h6>
                        <p className="admin-cv-item-card-org">{edu.school}</p>
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => startEditEducation(index)}
                          className="admin-cv-item-delete-btn"
                          style={{ color: 'var(--admin-accent-blue)' }}
                          title="Edit Degree"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteEducation(index)}
                          className="admin-cv-item-delete-btn"
                          title="Remove Degree"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* CURATED SKILLS CHIPS */}
          {activeSection === 'skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h4 className="admin-cv-panel-header">CV Resume Skills Chips (Comma Separated)</h4>
              
              <div className="admin-editor-form-grid">
                <div className="admin-input-group admin-editor-form-grid-full">
                  <label>Frontend Skills</label>
                  <input
                    type="text"
                    value={feSkills}
                    onChange={(e) => setFeSkills(e.target.value)}
                    placeholder="HTML, CSS, JavaScript, React"
                    className="admin-input-field"
                  />
                </div>

                <div className="admin-input-group admin-editor-form-grid-full">
                  <label>Backend Skills</label>
                  <input
                    type="text"
                    value={beSkills}
                    onChange={(e) => setBeSkills(e.target.value)}
                    placeholder="Node.js, Express, MongoDB, REST APIs"
                    className="admin-input-field"
                  />
                </div>

                <div className="admin-input-group admin-editor-form-grid-full">
                  <label>Tools & Utilities</label>
                  <input
                    type="text"
                    value={tlSkills}
                    onChange={(e) => setTlSkills(e.target.value)}
                    placeholder="Git, Postman, VS Code, Figma"
                    className="admin-input-field"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CV PROJECT LIST */}
          {activeSection === 'projects' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--admin-text-primary)', letterSpacing: '0.1em', margin: 0 }}>CV Projects Registry</h4>
                <button
                  type="button"
                  onClick={syncProjectsFromDatabase}
                  className="admin-subtab-btn-active"
                  style={{ fontSize: '0.58rem', padding: '0.4rem 0.85rem', cursor: 'pointer', borderRadius: '0.5rem' }}
                >
                  Sync from portfolio
                </button>
              </div>

              {/* Constructor Box */}
              <div className="admin-cv-constructor-box">
                <div className="admin-editor-form-grid">
                  <div className="admin-input-group">
                    <label>Project Name</label>
                    <input
                      type="text"
                      value={newCvProj.name}
                      onChange={(e) => setNewCvProj({ ...newCvProj, name: e.target.value })}
                      placeholder="e.g. Rerendet Coffee"
                      className="admin-input-field"
                    />
                  </div>

                  <div className="admin-input-group">
                    <label>Tech Stack string</label>
                    <input
                      type="text"
                      value={newCvProj.tech}
                      onChange={(e) => setNewCvProj({ ...newCvProj, tech: e.target.value })}
                      placeholder="e.g. HTML | CSS | React"
                      className="admin-input-field"
                    />
                  </div>

                  <div className="admin-input-group">
                    <label>GitHub Repository Link</label>
                    <input
                      type="url"
                      value={newCvProj.link}
                      onChange={(e) => setNewCvProj({ ...newCvProj, link: e.target.value })}
                      placeholder="https://github.com/..."
                      className="admin-input-field"
                    />
                  </div>

                  <div className="admin-input-group">
                    <label>CV Description</label>
                    <textarea
                      value={newCvProj.desc}
                      onChange={(e) => setNewCvProj({ ...newCvProj, desc: e.target.value })}
                      placeholder="Write a concise CV summary of the project..."
                      rows={3}
                      className="admin-editor-form-textarea"
                    />
                  </div>

                  <div className="admin-editor-form-grid-full" style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    {editingCvProjIdx !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCvProjIdx(null);
                          setNewCvProj({ name: '', tech: '', desc: '', link: '' });
                        }}
                        className="admin-editor-btn-cancel"
                        style={{ margin: 0, padding: '0.6rem 1.25rem', fontSize: '0.68rem' }}
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={addCvProject}
                      className="admin-editor-btn-submit"
                      style={{ flex: 1, justifyContent: 'center', margin: 0 }}
                    >
                      <Plus size={14} /> {editingCvProjIdx !== null ? "Update CV Project" : "Inject CV Project"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Display list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                <h5 className="admin-cv-panel-header" style={{ border: 'none', marginBottom: 0, paddingBottom: 0 }}>Active CV Project Records</h5>
                
                {resumeData.projects.length === 0 ? (
                  <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.72rem', fontStyle: 'italic' }}>No CV projects mapped</p>
                ) : (
                  resumeData.projects.map((proj, index) => (
                    <div key={index} className="admin-cv-item-card">
                      <div className="admin-cv-item-card-header">
                        <div>
                          <span className="admin-cv-item-card-time">{proj.tech}</span>
                          <h6 className="admin-cv-item-card-title">{proj.name}</h6>
                          <p className="admin-cv-item-card-org" style={{ fontStyle: 'italic', marginTop: '0.5rem', fontWeight: 500, color: 'var(--admin-text-secondary)' }}>{proj.desc}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => startEditCvProject(index)}
                            className="admin-cv-item-delete-btn"
                            style={{ color: 'var(--admin-accent-blue)' }}
                            title="Edit project"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCvProject(index)}
                            className="admin-cv-item-delete-btn"
                            title="Delete project"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* REFEREE RECORDS */}
          {activeSection === 'referees' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h4 className="admin-cv-panel-header">Professional Referee Contacts</h4>
              
              {/* Constructor Box */}
              <div className="admin-cv-constructor-box">
                <div className="admin-editor-form-grid">
                  <div className="admin-input-group">
                    <label>Referee Full Name</label>
                    <input
                      type="text"
                      value={newRef.name}
                      onChange={(e) => setNewRef({ ...newRef, name: e.target.value })}
                      placeholder="e.g. Zipporah Mwololo"
                      className="admin-input-field"
                    />
                  </div>

                  <div className="admin-input-group">
                    <label>Professional Role</label>
                    <input
                      type="text"
                      value={newRef.role}
                      onChange={(e) => setNewRef({ ...newRef, role: e.target.value })}
                      placeholder="e.g. Head of SHE"
                      className="admin-input-field"
                    />
                  </div>

                  <div className="admin-input-group">
                    <label>Organization / Entity</label>
                    <input
                      type="text"
                      value={newRef.org}
                      onChange={(e) => setNewRef({ ...newRef, org: e.target.value })}
                      placeholder="e.g. Daystar University"
                      className="admin-input-field"
                    />
                  </div>

                  <div className="admin-input-group">
                    <label>Referee contact details</label>
                    <input
                      type="text"
                      value={newRef.contact}
                      onChange={(e) => setNewRef({ ...newRef, contact: e.target.value })}
                      placeholder="e.g. Phone: +254... | Email: ..."
                      className="admin-input-field"
                    />
                  </div>

                  <div className="admin-editor-form-grid-full" style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    {editingRefIdx !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingRefIdx(null);
                          setNewRef({ name: '', role: '', org: '', contact: '' });
                        }}
                        className="admin-editor-btn-cancel"
                        style={{ margin: 0, padding: '0.6rem 1.25rem', fontSize: '0.68rem' }}
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={addReferee}
                      className="admin-editor-btn-submit"
                      style={{ flex: 1, justifyContent: 'center', margin: 0 }}
                    >
                      <Plus size={14} /> {editingRefIdx !== null ? "Update Referee Record" : "Inject Referee Record"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Active display grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                <h5 className="admin-cv-panel-header" style={{ border: 'none', marginBottom: 0, paddingBottom: 0 }}>Active CV References</h5>
                
                {resumeData.referees.length === 0 ? (
                  <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.72rem', fontStyle: 'italic' }}>No referee records mapped</p>
                ) : (
                  resumeData.referees.map((ref, index) => (
                    <div key={index} className="admin-cv-item-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h6 className="admin-cv-item-card-title" style={{ marginTop: 0 }}>{ref.name}</h6>
                        <span className="admin-cv-item-card-time" style={{ fontSize: '0.58rem', display: 'block', marginTop: '0.2rem' }}>{ref.role}</span>
                        <p className="admin-cv-item-card-org" style={{ marginTop: '0.1rem' }}>{ref.org}</p>
                        <p style={{ fontSize: '0.62rem', color: 'var(--admin-text-secondary)', marginTop: '0.5rem', fontStyle: 'italic' }}>{ref.contact}</p>
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => startEditReferee(index)}
                          className="admin-cv-item-delete-btn"
                          style={{ color: 'var(--admin-accent-blue)' }}
                          title="Edit Referee"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteReferee(index)}
                          className="admin-cv-item-delete-btn"
                          title="Remove Referee"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default ResumeManager;
