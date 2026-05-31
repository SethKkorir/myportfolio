import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Save, MessageSquare, Briefcase, Plus, Trash2, Edit2, Phone, Mail, MapPin, User, Loader2, Check } from 'lucide-react';

const PortfolioManager = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('hero');
  const [content, setContent] = useState({
    hero: { greeting: "Hello, I'm", name: "Seth Kipchumba Korir", title: "Full Stack Developer", tagline: "", profilePhoto: "" },
    about: { text: "", subText: "", cards: [] },
    contact: { phone: "", email: "", location: "" },
    socials: [],
    blogPosts: []
  });

  const [alert, setAlert] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  // Dynamic Array editing states
  const [newCard, setNewCard] = useState({ title: '', desc: '', icon: 'Briefcase', color: 'indigo', span: false });
  const [newSocial, setNewSocial] = useState({ platform: '', href: '', icon: 'Github' });
  const [newBlogPost, setNewBlogPost] = useState({ title: '', excerpt: '', date: '', readTime: '', category: '', href: '', image: '' });

  // Editing state trackers for saved items
  const [editingCardIdx, setEditingCardIdx] = useState(null);
  const [editingSocialIdx, setEditingSocialIdx] = useState(null);
  const [editingBlogIdx, setEditingBlogIdx] = useState(null);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/admin/portfolio-content');
      if (res.ok) {
        const data = await res.json();
        setContent({
          hero: data.hero || { greeting: "Hello, I'm", name: "Seth Kipchumba Korir", title: "Full Stack Developer", tagline: "", profilePhoto: "" },
          about: data.about || { text: "", subText: "", cards: [] },
          contact: data.contact || { phone: "", email: "", location: "" },
          socials: data.socials || [],
          blogPosts: data.blogPosts || []
        });
      }
    } catch (err) {
      showAlert('error', 'Failed to load portfolio content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert({ type: '', text: '' }), 4000);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/portfolio-content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(content)
      });

      if (res.ok) {
        const updated = await res.json();
        setContent(updated);
        showAlert('success', 'Portfolio configuration saved and live!');
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Failed to save');
      }
    } catch (err) {
      showAlert('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const addAboutCard = () => {
    if (!newCard.title || !newCard.desc) return;
    
    if (editingCardIdx !== null) {
      const updatedCards = [...(content.about.cards || [])];
      updatedCards[editingCardIdx] = newCard;
      setContent({
        ...content,
        about: {
          ...content.about,
          cards: updatedCards
        }
      });
      setEditingCardIdx(null);
      showAlert('success', 'About Card updated! Press "Save Configurations" to make it live.');
    } else {
      setContent({
        ...content,
        about: {
          ...content.about,
          cards: [...(content.about.cards || []), newCard]
        }
      });
      showAlert('success', 'About Card added! Press "Save Configurations" to make it live.');
    }
    setNewCard({ title: '', desc: '', icon: 'Briefcase', color: 'indigo', span: false });
  };

  const startEditAboutCard = (idx) => {
    setNewCard(content.about.cards[idx]);
    setEditingCardIdx(idx);
  };

  const cancelEditAboutCard = () => {
    setNewCard({ title: '', desc: '', icon: 'Briefcase', color: 'indigo', span: false });
    setEditingCardIdx(null);
  };

  const deleteAboutCard = (index) => {
    const updatedCards = [...content.about.cards];
    updatedCards.splice(index, 1);
    setContent({
      ...content,
      about: { ...content.about, cards: updatedCards }
    });
    if (editingCardIdx === index) {
      setEditingCardIdx(null);
      setNewCard({ title: '', desc: '', icon: 'Briefcase', color: 'indigo', span: false });
    } else if (editingCardIdx > index) {
      setEditingCardIdx(editingCardIdx - 1);
    }
  };

  const addSocialLink = () => {
    if (!newSocial.platform || !newSocial.href) return;
    
    if (editingSocialIdx !== null) {
      const updatedSocials = [...(content.socials || [])];
      updatedSocials[editingSocialIdx] = newSocial;
      setContent({
        ...content,
        socials: updatedSocials
      });
      setEditingSocialIdx(null);
      showAlert('success', 'Social Link updated! Press "Save Configurations" to make it live.');
    } else {
      setContent({
        ...content,
        socials: [...(content.socials || []), newSocial]
      });
      showAlert('success', 'Social Link added! Press "Save Configurations" to make it live.');
    }
    setNewSocial({ platform: '', href: '', icon: 'Github' });
  };

  const startEditSocialLink = (idx) => {
    setNewSocial(content.socials[idx]);
    setEditingSocialIdx(idx);
  };

  const cancelEditSocialLink = () => {
    setNewSocial({ platform: '', href: '', icon: 'Github' });
    setEditingSocialIdx(null);
  };

  const deleteSocialLink = (index) => {
    const updated = [...content.socials];
    updated.splice(index, 1);
    setContent({ ...content, socials: updated });
    if (editingSocialIdx === index) {
      setEditingSocialIdx(null);
      setNewSocial({ platform: '', href: '', icon: 'Github' });
    } else if (editingSocialIdx > index) {
      setEditingSocialIdx(editingSocialIdx - 1);
    }
  };

  const addBlogPost = () => {
    if (!newBlogPost.title || !newBlogPost.href) return;
    
    if (editingBlogIdx !== null) {
      const updatedBlogs = [...(content.blogPosts || [])];
      updatedBlogs[editingBlogIdx] = newBlogPost;
      setContent({
        ...content,
        blogPosts: updatedBlogs
      });
      setEditingBlogIdx(null);
      showAlert('success', 'Blog Post updated! Press "Save Configurations" to make it live.');
    } else {
      setContent({
        ...content,
        blogPosts: [...(content.blogPosts || []), newBlogPost]
      });
      showAlert('success', 'Blog Post added! Press "Save Configurations" to make it live.');
    }
    setNewBlogPost({ title: '', excerpt: '', date: '', readTime: '', category: '', href: '', image: '' });
  };

  const startEditBlogPost = (idx) => {
    setNewBlogPost(content.blogPosts[idx]);
    setEditingBlogIdx(idx);
  };

  const cancelEditBlogPost = () => {
    setNewBlogPost({ title: '', excerpt: '', date: '', readTime: '', category: '', href: '', image: '' });
    setEditingBlogIdx(null);
  };

  const deleteBlogPost = (index) => {
    const updated = [...content.blogPosts];
    updated.splice(index, 1);
    setContent({ ...content, blogPosts: updated });
    if (editingBlogIdx === index) {
      setEditingBlogIdx(null);
      setNewBlogPost({ title: '', excerpt: '', date: '', readTime: '', category: '', href: '', image: '' });
    } else if (editingBlogIdx > index) {
      setEditingBlogIdx(editingBlogIdx - 1);
    }
  };

  if (loading) {
    return (
      <div className="admin-scope-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", backgroundColor: "transparent" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%", border: "4px solid var(--admin-border-light)", borderTopColor: "var(--admin-accent-blue)" }}
          />
          <p style={{ fontSize: "0.65rem", fontWeight: 850, textTransform: "uppercase", color: "var(--admin-text-muted)", letterSpacing: "0.15em" }}>Loading setup parameters...</p>
        </div>
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
            className={`admin-float-alert ${
              alert.type === "success" 
                ? "admin-float-alert-success" 
                : "admin-float-alert-error"
            }`}
            style={{ position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 9999, width: "320px", boxShadow: "var(--admin-shadow-lg)" }}
          >
            {alert.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="admin-workspace-title-row" style={{ marginBottom: 0, borderBottom: "1px solid var(--admin-border-light)", paddingBottom: "1.25rem" }}>
        <div>
          <h2>Portfolio Designer</h2>
          <p>Configure landing pages, bio cards, testimonials, and channels</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="admin-editor-btn-submit"
          style={{ padding: "0.7rem 1.25rem" }}
        >
          {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
          Save Configurations
        </button>
      </div>

      {/* Sub tabs navigation */}
      <div className="admin-subtabs-row" style={{ marginBottom: 0 }}>
        {[
          { id: "hero", label: "👋 Hero Setup" },
          { id: "about", label: "📄 About bio & cards" },
          { id: "contact", label: "📞 Contact Channels" },
          { id: "blogs", label: "📝 Medium/Blog Posts" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`admin-subtab-btn ${activeSubTab === tab.id ? "admin-subtab-btn-active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Viewport for sub tabs */}
      <div className="admin-editor-panel" style={{ margin: 0 }}>
        
        {/* HERO CONFIG */}
        {activeSubTab === "hero" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="admin-editor-form-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div className="admin-input-group" style={{ marginBottom: 0 }}>
                  <label>Greeting Intro</label>
                  <input
                    type="text"
                    value={content.hero.greeting}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, greeting: e.target.value } })}
                    className="admin-input-field"
                    style={{ paddingLeft: "1rem" }}
                  />
                </div>

                <div className="admin-input-group" style={{ marginBottom: 0 }}>
                  <label>Showcase Full Name</label>
                  <input
                    type="text"
                    value={content.hero.name}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, name: e.target.value } })}
                    className="admin-input-field"
                    style={{ paddingLeft: "1rem" }}
                  />
                </div>

                <div className="admin-input-group" style={{ marginBottom: 0 }}>
                  <label>Professional Title / Role</label>
                  <input
                    type="text"
                    value={content.hero.title || ""}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                    className="admin-input-field"
                    style={{ paddingLeft: "1rem" }}
                  />
                </div>
              </div>

              <div className="admin-input-group" style={{ marginBottom: 0 }}>
                <label>Tagline & Bio Summary</label>
                <textarea
                  value={content.hero.tagline}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, tagline: e.target.value } })}
                  rows={4}
                  className="admin-editor-form-textarea"
                  style={{ height: "calc(100% - 1.25rem)", minHeight: "100px" }}
                />
              </div>
            </div>

            {/* Profile Avatar Editor section */}
            <div style={{ borderTop: "1px solid var(--admin-border-light)", paddingTop: "1.5rem", display: "grid", gridTemplateColumns: "80px 1fr", gap: "1.5rem", alignItems: "center" }}>
              <div 
                style={{ 
                  width: "80px", 
                  height: "80px", 
                  borderRadius: "50%", 
                  overflow: "hidden", 
                  border: "2px solid var(--admin-border-light)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  backgroundColor: "var(--admin-bg-card)"
                }}
              >
                {content.hero.profilePhoto ? (
                  <img 
                    src={content.hero.profilePhoto} 
                    alt="Seth Avatar" 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                ) : (
                  <User size={32} style={{ color: "var(--admin-text-muted)" }} />
                )}
              </div>

              <div className="admin-input-group" style={{ marginBottom: 0 }}>
                <label>Profile Avatar Photo (Upload File or Paste Link)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or upload"
                    value={content.hero.profilePhoto || ""}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, profilePhoto: e.target.value } })}
                    className="admin-input-field"
                    style={{ paddingLeft: "1rem", flex: 1 }}
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
                            setContent(prev => ({
                              ...prev,
                              hero: { ...prev.hero, profilePhoto: reader.result }
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABOUT & GRID CARDS */}
        {activeSubTab === "about" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div className="admin-input-group" style={{ marginBottom: 0 }}>
                <label>About Paragraph Text (Primary)</label>
                <textarea
                  value={content.about.text}
                  onChange={(e) => setContent({ ...content, about: { ...content.about, text: e.target.value } })}
                  rows={4}
                  className="admin-editor-form-textarea"
                  style={{ minHeight: "100px" }}
                />
              </div>

              <div className="admin-input-group" style={{ marginBottom: 0 }}>
                <label>About Paragraph Text (Secondary)</label>
                <textarea
                  value={content.about.subText || ""}
                  onChange={(e) => setContent({ ...content, about: { ...content.about, subText: e.target.value } })}
                  rows={4}
                  className="admin-editor-form-textarea"
                  style={{ minHeight: "100px" }}
                />
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--admin-border-light)", paddingTop: "1.5rem", display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.5rem" }}>
              {/* Cards constructor */}
              <div className="admin-cv-constructor-box" style={{ margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h5 style={{ fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase", color: "var(--admin-text-primary)", borderBottom: "1px solid var(--admin-border-light)", paddingBottom: "0.5rem", letterSpacing: "0.05em" }}>Construct About Card</h5>
                
                <div className="admin-input-group" style={{ marginBottom: 0 }}>
                  <label>Card Title</label>
                  <input
                    type="text"
                    value={newCard.title}
                    onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                    placeholder="e.g. Fullstack Engineer"
                    className="admin-input-field"
                    style={{ paddingLeft: "0.85rem", fontSize: "0.75rem", padding: "0.75rem" }}
                  />
                </div>

                <div className="admin-input-group" style={{ marginBottom: 0 }}>
                  <label>Description</label>
                  <input
                    type="text"
                    value={newCard.desc}
                    onChange={(e) => setNewCard({ ...newCard, desc: e.target.value })}
                    placeholder="e.g. Specializing in MERN stack"
                    className="admin-input-field"
                    style={{ paddingLeft: "0.85rem", fontSize: "0.75rem", padding: "0.75rem" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div className="admin-input-group" style={{ marginBottom: 0 }}>
                    <label>Icon Name</label>
                    <input
                      type="text"
                      value={newCard.icon}
                      onChange={(e) => setNewCard({ ...newCard, icon: e.target.value })}
                      className="admin-input-field"
                      style={{ paddingLeft: "0.85rem", fontSize: "0.75rem", padding: "0.75rem" }}
                    />
                  </div>

                  <div className="admin-input-group" style={{ marginBottom: 0 }}>
                    <label>Visual Accent</label>
                    <select
                      value={newCard.color}
                      onChange={(e) => setNewCard({ ...newCard, color: e.target.value })}
                      className="admin-input-field"
                      style={{ paddingLeft: "0.85rem", fontSize: "0.75rem", padding: "0.75rem", color: "var(--admin-text-primary)" }}
                    >
                      <option value="indigo">Indigo Glow</option>
                      <option value="blue">Blue Glass</option>
                      <option value="violet">Violet Core</option>
                      <option value="emerald">Emerald Edge</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                  <input
                    type="checkbox"
                    id="cardSpan"
                    checked={newCard.span}
                    onChange={(e) => setNewCard({ ...newCard, span: e.target.checked })}
                    style={{ cursor: "pointer", accentColor: "var(--admin-accent-blue)" }}
                  />
                  <label htmlFor="cardSpan" style={{ fontSize: "0.62rem", fontWeight: 900, textTransform: "uppercase", color: "var(--admin-text-secondary)", cursor: "pointer", letterSpacing: "0.05em" }}>Spans 2 columns</label>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {editingCardIdx !== null && (
                    <button
                      type="button"
                      onClick={cancelEditAboutCard}
                      className="admin-editor-btn-cancel"
                      style={{ flex: 1, padding: "0.6rem", fontSize: "0.68rem", margin: 0 }}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={addAboutCard}
                    className="admin-editor-btn-submit"
                    style={{ flex: 2, padding: "0.6rem", fontSize: "0.68rem", margin: 0 }}
                  >
                    <Plus size={12} /> {editingCardIdx !== null ? "Update Card" : "Inject About Card"}
                  </button>
                </div>
              </div>

              {/* Active Cards display */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h5 style={{ fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase", color: "var(--admin-text-primary)", letterSpacing: "0.05em" }}>Active Showcase Cards</h5>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  {(content.about.cards || []).length === 0 ? (
                    <p style={{ fontSize: "0.68rem", color: "var(--admin-text-muted)", fontStyle: "italic", gridColumn: "span 2" }}>No about cards compiled</p>
                  ) : (
                    content.about.cards.map((card, index) => (
                      <div 
                        key={index}
                        className="admin-cv-item-card"
                        style={{ margin: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", gridColumn: card.span ? "span 2" : "auto" }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ padding: "0.5rem", borderRadius: "0.5rem", backgroundColor: "var(--admin-bg-card)", border: "1px solid var(--admin-border-light)", display: "inline-flex", color: "var(--admin-accent-blue)" }}>
                            <Briefcase size={14} />
                          </div>
                          
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              type="button"
                              onClick={() => startEditAboutCard(index)}
                              className="admin-cv-item-delete-btn"
                              style={{ color: 'var(--admin-accent-blue)' }}
                              title="Edit Card"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteAboutCard(index)}
                              className="admin-cv-item-delete-btn"
                              title="Remove Card"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <div style={{ marginTop: "0.75rem" }}>
                          <h6 style={{ fontSize: "0.72rem", fontWeight: 900, color: "var(--admin-text-primary)" }}>{card.title}</h6>
                          <p style={{ fontSize: "0.65rem", color: "var(--admin-text-secondary)", marginTop: "0.2rem", lineHeight: "1.4" }}>{card.desc}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTACT & SOCIALS */}
        {activeSubTab === "contact" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <h5 style={{ fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase", color: "var(--admin-text-primary)", letterSpacing: "0.05em", borderBottom: "1px solid var(--admin-border-light)", paddingBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Phone size={12} style={{ color: "var(--admin-accent-blue)" }} />
                <span>Contact Base Channels</span>
              </h5>

              <div className="admin-input-group" style={{ marginBottom: 0 }}>
                <label>Hotline Phone</label>
                <div className="admin-input-wrapper">
                  <input
                    type="text"
                    value={content.contact.phone}
                    onChange={(e) => setContent({ ...content, contact: { ...content.contact, phone: e.target.value } })}
                    className="admin-input-field"
                  />
                  <Phone size={14} className="admin-input-icon" />
                </div>
              </div>

              <div className="admin-input-group" style={{ marginBottom: 0 }}>
                <label>Professional Email Address</label>
                <div className="admin-input-wrapper">
                  <input
                    type="email"
                    value={content.contact.email}
                    onChange={(e) => setContent({ ...content, contact: { ...content.contact, email: e.target.value } })}
                    className="admin-input-field"
                  />
                  <Mail size={14} className="admin-input-icon" />
                </div>
              </div>

              <div className="admin-input-group" style={{ marginBottom: 0 }}>
                <label>Office Location Address</label>
                <div className="admin-input-wrapper">
                  <input
                    type="text"
                    value={content.contact.location}
                    onChange={(e) => setContent({ ...content, contact: { ...content.contact, location: e.target.value } })}
                    className="admin-input-field"
                  />
                  <MapPin size={14} className="admin-input-icon" />
                </div>
              </div>
            </div>

            {/* Social linkages */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <h5 style={{ fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase", color: "var(--admin-text-primary)", letterSpacing: "0.05em", borderBottom: "1px solid var(--admin-border-light)", paddingBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Globe size={12} style={{ color: "var(--admin-accent-blue)" }} />
                <span>Social Media & Repo Links</span>
              </h5>

              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1rem" }}>
                {/* Social Builder */}
                <div className="admin-cv-constructor-box" style={{ margin: 0, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  <div className="admin-input-group" style={{ marginBottom: 0 }}>
                    <label>Platform Name</label>
                    <input
                      type="text"
                      value={newSocial.platform}
                      onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}
                      placeholder="e.g. GitHub"
                      className="admin-input-field"
                      style={{ paddingLeft: "0.75rem", padding: "0.6rem", fontSize: "0.72rem" }}
                    />
                  </div>

                  <div className="admin-input-group" style={{ marginBottom: 0 }}>
                    <label>URL Link</label>
                    <input
                      type="url"
                      value={newSocial.href}
                      onChange={(e) => setNewSocial({ ...newSocial, href: e.target.value })}
                      placeholder="https://..."
                      className="admin-input-field"
                      style={{ paddingLeft: "0.75rem", padding: "0.6rem", fontSize: "0.72rem" }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    {editingSocialIdx !== null && (
                      <button
                        type="button"
                        onClick={cancelEditSocialLink}
                        className="admin-editor-btn-cancel"
                        style={{ flex: 1, padding: "0.5rem", fontSize: "0.65rem", margin: 0 }}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={addSocialLink}
                      className="admin-editor-btn-submit"
                      style={{ flex: 2, padding: "0.5rem", fontSize: "0.65rem", margin: 0 }}
                    >
                      <Plus size={11} /> {editingSocialIdx !== null ? "Update Social" : "Inject Social"}
                    </button>
                  </div>
                </div>

                {/* Display list */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxHeight: "220px", overflowY: "auto", paddingRight: "0.25rem" }}>
                  {(content.socials || []).length === 0 ? (
                    <p style={{ fontSize: "0.68rem", color: "var(--admin-text-muted)", fontStyle: "italic" }}>No social links established</p>
                  ) : (
                    content.socials.map((link, idx) => (
                      <div 
                        key={idx} 
                        className="admin-cv-item-card"
                        style={{ margin: 0, padding: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: "0.7rem", fontWeight: 900, color: "var(--admin-text-primary)", margin: 0 }}>{link.platform}</p>
                          <p style={{ fontSize: "0.58rem", color: "var(--admin-text-secondary)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", marginTop: "0.1rem", marginBottom: 0 }}>{link.href}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => startEditSocialLink(idx)}
                            className="admin-cv-item-delete-btn"
                            style={{ padding: "0.15rem", color: 'var(--admin-accent-blue)' }}
                            title="Edit Social"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSocialLink(idx)}
                            className="admin-cv-item-delete-btn"
                            style={{ padding: "0.15rem" }}
                            title="Delete Social"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MEDIUM/BLOG POSTS CONFIG */}
        {activeSubTab === "blogs" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
            {/* Constructor */}
            <div className="admin-cv-constructor-box" style={{ margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h5 style={{ fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase", color: "var(--admin-text-primary)", borderBottom: "1px solid var(--admin-border-light)", paddingBottom: "0.5rem", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Globe size={12} style={{ color: "var(--admin-accent-blue)" }} />
                <span>Construct Blog Publication</span>
              </h5>

              <div className="admin-input-group" style={{ marginBottom: 0 }}>
                <label>Publication Title</label>
                <input
                  type="text"
                  value={newBlogPost.title}
                  onChange={(e) => setNewBlogPost({ ...newBlogPost, title: e.target.value })}
                  placeholder="e.g. The Sauna Life"
                  className="admin-input-field"
                  style={{ paddingLeft: "0.75rem", padding: "0.65rem", fontSize: "0.72rem" }}
                />
              </div>

              <div className="admin-input-group" style={{ marginBottom: 0 }}>
                <label>Excerpt / Summary</label>
                <textarea
                  value={newBlogPost.excerpt}
                  onChange={(e) => setNewBlogPost({ ...newBlogPost, excerpt: e.target.value })}
                  placeholder="Write a concise excerpt..."
                  rows={2}
                  className="admin-editor-form-textarea"
                  style={{ minHeight: "60px", padding: "0.65rem", fontSize: "0.72rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div className="admin-input-group" style={{ marginBottom: 0 }}>
                  <label>Published Date</label>
                  <input
                    type="text"
                    value={newBlogPost.date}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, date: e.target.value })}
                    placeholder="e.g. Oct 24, 2024"
                    className="admin-input-field"
                    style={{ paddingLeft: "0.75rem", padding: "0.65rem", fontSize: "0.72rem" }}
                  />
                </div>

                <div className="admin-input-group" style={{ marginBottom: 0 }}>
                  <label>Read Time</label>
                  <input
                    type="text"
                    value={newBlogPost.readTime}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, readTime: e.target.value })}
                    placeholder="e.g. 8 min read"
                    className="admin-input-field"
                    style={{ paddingLeft: "0.75rem", padding: "0.65rem", fontSize: "0.72rem" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div className="admin-input-group" style={{ marginBottom: 0 }}>
                  <label>Category</label>
                  <input
                    type="text"
                    value={newBlogPost.category}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, category: e.target.value })}
                    placeholder="e.g. Lifestyle"
                    className="admin-input-field"
                    style={{ paddingLeft: "0.75rem", padding: "0.65rem", fontSize: "0.72rem" }}
                  />
                </div>

                <div className="admin-input-group" style={{ marginBottom: 0 }}>
                  <label>Medium / Article Link</label>
                  <input
                    type="url"
                    value={newBlogPost.href}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, href: e.target.value })}
                    placeholder="https://medium.com/..."
                    className="admin-input-field"
                    style={{ paddingLeft: "0.75rem", padding: "0.65rem", fontSize: "0.72rem" }}
                  />
                </div>
              </div>

              <div className="admin-input-group" style={{ marginBottom: 0 }}>
                <label>Featured Cover Image (Upload File or Paste Link)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={newBlogPost.image || ""}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, image: e.target.value })}
                    placeholder="https://images.unsplash.com/... or upload"
                    className="admin-input-field"
                    style={{ paddingLeft: "0.75rem", padding: "0.65rem", fontSize: "0.72rem", flex: 1 }}
                  />
                  <label 
                    className="admin-editor-btn-submit" 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '0.4rem', 
                      cursor: 'pointer',
                      padding: '0.6rem 1rem', 
                      fontSize: '0.65rem',
                      margin: 0,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Plus size={12} />
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
                            setNewBlogPost(prev => ({ ...prev, image: reader.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                {editingBlogIdx !== null && (
                  <button
                    type="button"
                    onClick={cancelEditBlogPost}
                    className="admin-editor-btn-cancel"
                    style={{ flex: 1, padding: "0.6rem", fontSize: "0.68rem", margin: 0 }}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  onClick={addBlogPost}
                  className="admin-editor-btn-submit"
                  style={{ flex: 2, padding: "0.6rem", fontSize: "0.68rem", margin: 0 }}
                >
                  <Plus size={12} /> {editingBlogIdx !== null ? "Update Blog Post" : "Inject Blog Post"}
                </button>
              </div>
            </div>

            {/* Blogs list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h5 style={{ fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase", color: "var(--admin-text-primary)", letterSpacing: "0.05em" }}>Active Blog Publications</h5>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "380px", overflowY: "auto", paddingRight: "0.25rem" }}>
                {(content.blogPosts || []).length === 0 ? (
                  <div className="admin-feed-empty" style={{ padding: "3rem 0" }}>
                    <Globe size={20} style={{ color: "var(--admin-text-muted)", margin: "0 auto" }} />
                    <p>No publications compiled yet</p>
                  </div>
                ) : (
                  content.blogPosts.map((post, index) => (
                    <div 
                      key={index}
                      className="admin-cv-item-card"
                      style={{ margin: 0, padding: "1rem", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem", minWidth: 0, paddingRight: "1.5rem" }}>
                          <p style={{ fontSize: "0.72rem", fontWeight: 900, color: "var(--admin-text-primary)", margin: 0, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{post.title}</p>
                          <span style={{ fontSize: "0.58rem", fontWeight: 800, color: "var(--admin-accent-blue)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{post.category} • {post.date}</span>
                        </div>
                        <div style={{ position: "absolute", right: "1rem", top: "1rem", display: 'flex', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => startEditBlogPost(index)}
                            className="admin-cv-item-delete-btn"
                            style={{ color: 'var(--admin-accent-blue)' }}
                            title="Edit Blog Post"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteBlogPost(index)}
                            className="admin-cv-item-delete-btn"
                            title="Delete Blog Post"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <p style={{ fontSize: "0.68rem", color: "var(--admin-text-secondary)", lineHeight: "1.45", marginTop: "0.75rem", marginBottom: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {post.excerpt}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PortfolioManager;
