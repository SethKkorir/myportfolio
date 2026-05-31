import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  Cpu,
  Layers,
} from "lucide-react";

const SkillManager = ({ token }) => {
  const [skills, setSkills] = useState([]);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    level: 80,
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/admin/skills");
      const data = await res.json();
      setSkills(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `/api/admin/skills/${editing}`
      : "/api/admin/skills";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(form),
    });

    setForm({
      name: "",
      category: "",
      level: 80,
    });

    setEditing(null);
    fetchSkills();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/admin/skills/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    fetchSkills();
  };

  const handleEdit = (skill) => {
    setEditing(skill._id);
    setForm(skill);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", fontFamily: "var(--admin-font-main)" }}>
      {/* Header */}
      <div className="admin-workspace-title-row" style={{ marginBottom: 0 }}>
        <div>
          <h2>Skill Manager</h2>
          <p>Configure, update, and manage your technical stack proficiency levels</p>
        </div>
      </div>

      {/* Form Editor */}
      <div className="admin-editor-panel" style={{ margin: 0 }}>
        <div className="admin-editor-panel-header" style={{ marginBottom: "1.25rem" }}>
          <h4>{editing ? "⚙️ Edit technical stack slot" : "⚡ Add new stack capability"}</h4>
        </div>
        
        <div className="admin-editor-form-grid">
          <div className="admin-input-group" style={{ marginBottom: 0 }}>
            <label>Skill Name / Tech tag</label>
            <input
              type="text"
              placeholder="e.g. React.js"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="admin-input-field"
            />
          </div>

          <div className="admin-input-group" style={{ marginBottom: 0 }}>
            <label>Category Group</label>
            <input
              type="text"
              placeholder="e.g. Frontend"
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
              className="admin-input-field"
            />
          </div>

          <div className="admin-editor-form-grid-full" style={{ marginTop: "0.5rem" }}>
            <div className="admin-input-group" style={{ marginBottom: 0 }}>
              <label>Proficiency Index: {form.level}%</label>
              <div className="admin-prof-slider-row">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={form.level}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      level: parseInt(e.target.value),
                    })
                  }
                  className="admin-prof-range-input"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="admin-editor-form-footer">
          {editing && (
            <button
              onClick={() => {
                setEditing(null);
                setForm({ name: "", category: "", level: 80 });
              }}
              className="admin-editor-btn-cancel"
            >
              Cancel
            </button>
          )}
          
          <button
            onClick={handleSave}
            className="admin-editor-btn-submit"
          >
            {editing ? <Save size={14} /> : <Plus size={14} />}
            {editing ? "Save Changes" : "Inject skill block"}
          </button>
        </div>
      </div>

      {/* Skills Grouped Grid */}
      {skills.length === 0 ? (
        <div className="admin-feed-empty" style={{ padding: "3rem 0" }}>
          <Layers size={24} style={{ color: "var(--admin-text-muted)" }} />
          <p>No technical skills mapped yet</p>
        </div>
      ) : (
        <div className="admin-skills-columns">
          {[...new Set(skills.map((s) => s.category || "General"))].map((cat) => {
            const catSkills = skills.filter((s) => (s.category || "General") === cat);
            return (
              <div key={cat} className="admin-skills-col-list">
                <div className="admin-skills-col-header">
                  <div className="admin-skills-col-header-dot" />
                  <h4>{cat}</h4>
                  <span>{catSkills.length} slots</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {catSkills.map((skill) => (
                    <motion.div
                      key={skill._id}
                      whileHover={{ y: -4 }}
                      className="admin-skill-mgr-card"
                    >
                      <div className="admin-skill-mgr-card-top">
                        <div className="admin-skill-mgr-card-name">
                          <Cpu size={14} />
                          <span>{skill.name}</span>
                        </div>

                        <div className="admin-mgr-card-actions">
                          <button
                            onClick={() => handleEdit(skill)}
                            className="admin-mgr-card-action-btn admin-mgr-btn-edit"
                            title="Edit stack"
                          >
                            <Edit3 size={13} />
                          </button>

                          <button
                            onClick={() => handleDelete(skill._id)}
                            className="admin-mgr-card-action-btn admin-mgr-btn-delete"
                            title="Remove stack"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="admin-skill-mgr-card-progress">
                        <div className="admin-skill-mgr-card-progress-top">
                          <span>Proficiency</span>
                          <span>{skill.level}%</span>
                        </div>

                        <div className="admin-skill-mgr-card-progress-bar">
                          <div
                            className="admin-skill-mgr-card-progress-fill"
                            style={{
                              width: `${skill.level}%`,
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Catalog tag summary */}
      <div className="admin-editor-panel" style={{ margin: 0 }}>
        <div className="admin-editor-panel-header" style={{ marginBottom: "1rem" }}>
          <h4 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Layers size={14} className="text-indigo-400" />
            <span>Active Skill Catalog Summary</span>
          </h4>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
          {[...new Set(skills.map((s) => s.category || "General"))].map(
            (cat, idx) => (
              <span
                key={idx}
                className="admin-mgr-project-card-tag"
                style={{
                  padding: "0.4rem 0.8rem",
                  fontSize: "0.65rem",
                  borderRadius: "0.5rem",
                  background: "rgba(59, 130, 246, 0.08)",
                  color: "var(--admin-accent-blue)",
                  border: "1px solid rgba(59, 130, 246, 0.1)",
                  pointerEvents: "none"
                }}
              >
                {cat}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillManager;