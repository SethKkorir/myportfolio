import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  FolderGit2,
  Github,
  ExternalLink,
  X,
  Check
} from "lucide-react";
import "./admin.css";

const ProjectManager = ({ token }) => {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [isEditingMode, setIsEditingMode] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    github: "",
    live: "",
    tags: "",
    image: "",
    category: "Fullstack"
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `/api/admin/projects/${editing}`
      : "/api/admin/projects";

    // Split tags by comma
    const tagsArray = typeof form.tags === 'string' 
      ? form.tags.split(",").map(t => t.trim()).filter(t => t !== "") 
      : form.tags;

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        githubLink: form.github,
        demoLink: form.live,
        techStack: tagsArray,
        image: form.image,
        category: form.category
      }),
    });

    handleCancel();
    fetchProjects();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project from your showcase catalog?")) return;
    await fetch(`/api/admin/projects/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    fetchProjects();
  };

  const handleEdit = (project) => {
    setEditing(project._id);
    setForm({
      title: project.title || "",
      description: project.description || "",
      github: project.githubLink || "",
      live: project.demoLink || "",
      tags: Array.isArray(project.techStack) ? project.techStack.join(", ") : "",
      image: project.image || "",
      category: project.category || "Fullstack"
    });
    setIsEditingMode(true);
  };

  const handleCancel = () => {
    setForm({
      title: "",
      description: "",
      github: "",
      live: "",
      tags: "",
      image: "",
      category: "Fullstack"
    });
    setEditing(null);
    setIsEditingMode(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--admin-text-primary)' }}>Projects Cabinet</h2>
          <p style={{ fontSize: '0.72rem', color: 'var(--admin-text-secondary)', fontWeight: 600, marginTop: '0.2rem' }}>Create and configure featured portfolio items</p>
        </div>

        {!isEditingMode && (
          <button
            onClick={() => setIsEditingMode(true)}
            className="admin-editor-btn-submit"
            style={{ padding: '0.7rem 1.25rem' }}
          >
            <Plus size={16} /> Add New Project
          </button>
        )}
      </div>

      {/* Editor Drawer */}
      {isEditingMode && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-editor-panel"
        >
          <div className="admin-editor-panel-header">
            <h4>{editing ? '🛠 Edit project particulars' : '🚀 Construct new featured project'}</h4>
            <button onClick={handleCancel} className="admin-editor-close-btn">
              <X size={15} />
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div className="admin-editor-form-grid">
              
              <div className="admin-input-group">
                <label>Project Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. E-Commerce Platform"
                  className="admin-input-field"
                  style={{ paddingLeft: '1rem' }}
                />
              </div>

              <div className="admin-input-group">
                <label>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="admin-input-field"
                  style={{ paddingLeft: '1rem', color: 'var(--admin-text-primary)' }}
                >
                  <option value="Fullstack">Fullstack</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="admin-input-group">
                <label>Tech Stack / Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="React, Node.js, MongoDB"
                  className="admin-input-field"
                  style={{ paddingLeft: '1rem' }}
                />
              </div>

              <div className="admin-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label>Thumbnail Image (Upload File or Paste Link)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://images.unsplash.com/... or upload"
                    className="admin-input-field"
                    style={{ paddingLeft: '1rem', flex: 1 }}
                  />
                  <label 
                    className="admin-editor-btn-submit" 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '0.4rem', 
                      cursor: 'pointer',
                      padding: '0.7rem 1.25rem', 
                      fontSize: '0.7rem',
                      margin: 0,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Plus size={13} />
                    <span>Upload</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            alert("Image size is too large (max 2MB).");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setForm(prev => ({ ...prev, image: reader.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="admin-input-group">
                <label>GitHub Link</label>
                <input
                  type="url"
                  value={form.github}
                  onChange={(e) => setForm({ ...form, github: e.target.value })}
                  placeholder="https://github.com/..."
                  className="admin-input-field"
                  style={{ paddingLeft: '1rem' }}
                />
              </div>

              <div className="admin-input-group">
                <label>Live Demo Link</label>
                <input
                  type="url"
                  value={form.live}
                  onChange={(e) => setForm({ ...form, live: e.target.value })}
                  placeholder="https://..."
                  className="admin-input-field"
                  style={{ paddingLeft: '1rem' }}
                />
              </div>

              <div className="admin-input-group admin-editor-form-grid-full">
                <label>Image Preview</label>
                <div className="admin-editor-image-preview-box">
                  {form.image ? (
                    <img 
                      src={form.image} 
                      alt="Preview" 
                      onError={(e) => {e.target.src='https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'}}
                    />
                  ) : (
                    <span>No thumbnail loaded</span>
                  )}
                </div>
              </div>

              <div className="admin-input-group admin-editor-form-grid-full">
                <label>Detailed Description</label>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Write a brief walkthrough of features and deliverables..."
                  rows={4}
                  className="admin-editor-form-textarea"
                />
              </div>

            </div>

            <div className="admin-editor-form-footer">
              <button type="button" onClick={handleCancel} className="admin-editor-btn-cancel">
                Cancel
              </button>
              <button type="submit" className="admin-editor-btn-submit">
                <Check size={14} /> {editing ? "Sync Updates" : "Deploy Project"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Projects Grid Display */}
      <div className="admin-workspace-grid">
        {projects.length === 0 ? (
          <div style={{ gridColumn: 'span 3', padding: '3rem 0', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '1.5rem', border: '1px dashed var(--admin-border-light)' }}>
            <FolderGit2 size={32} className="admin-input-icon" style={{ position: 'static', margin: '0 auto 0.75rem', color: 'var(--admin-text-muted)' }} />
            <p style={{ fontSize: '0.72rem', fontStyle: 'italic', color: 'var(--admin-text-secondary)', fontWeight: 700 }}>No featured projects in collection</p>
          </div>
        ) : (
          projects.map((project) => (
            <motion.div
              key={project._id}
              whileHover={{ y: -4 }}
              className="admin-mgr-project-card"
            >
              {/* Media image */}
              <div className="admin-mgr-project-card-media">
                <img
                  src={project.image}
                  alt={project.title}
                  onError={(e) => {e.target.src='https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'}}
                />
                <span className="admin-mgr-project-card-badge">{project.category || 'Featured'}</span>
              </div>

              {/* Card content info */}
              <div className="admin-mgr-project-card-body">
                <div>
                  <h5 style={{ lineHeight: '1.2' }}>{project.title}</h5>
                  <p style={{ marginTop: '0.4rem', textOverflow: 'ellipsis', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {project.description}
                  </p>
                </div>

                {/* Tech chips */}
                <div className="admin-mgr-project-card-tags">
                  {(Array.isArray(project.techStack) ? project.techStack : []).slice(0, 3).map((tag, i) => (
                    <span key={i} className="admin-mgr-project-card-tag">
                      {tag}
                    </span>
                  ))}
                  {project.techStack?.length > 3 && (
                    <span style={{ fontSize: '0.65rem', alignSelf: 'center', color: 'var(--admin-text-muted)', fontWeight: 800 }}>+{project.techStack.length - 3}</span>
                  )}
                </div>

                {/* Card footer actions */}
                <div className="admin-mgr-project-card-footer">
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noreferrer" className="admin-mgr-card-action-btn" title="GitHub Repo">
                        <Github size={13} />
                      </a>
                    )}
                    {project.demoLink && (
                      <a href={project.demoLink} target="_blank" rel="noreferrer" className="admin-mgr-card-action-btn" title="Live Demo">
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>

                  <div className="admin-mgr-card-actions">
                    <button
                      onClick={() => handleEdit(project)}
                      className="admin-mgr-card-action-btn admin-mgr-btn-edit"
                      title="Edit project"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="admin-mgr-card-action-btn admin-mgr-btn-delete"
                      title="Delete project"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

    </div>
  );
};

export default ProjectManager;