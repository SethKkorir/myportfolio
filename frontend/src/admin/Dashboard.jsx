// src/pages/admin/Dashboard.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  LayoutDashboard,
  FolderGit2,
  FileText,
  Cpu,
  Globe,
  LogOut,
  Calendar,
  MessageSquare,
  Mail,
  User,
  Sparkles,
  Activity,
  Send,
  MoreHorizontal,
  Phone,
  CheckCircle2,
  Clock,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import ProjectManager from "./ProjectManager";
import SkillManager from "./SkillManager";
import ResumeManager from "./ResumeManager";
import PortfolioManager from "./PortfolioManager";
import "./admin.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("admin-theme") || "dark");

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("admin-theme", nextTheme);
  };

  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    skillCategories: 0,
    messages: 0,
  });

  const [contacts, setContacts] = useState([]);
  const [portfolioContent, setPortfolioContent] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    localStorage.getItem("admin-sidebar-collapsed") === "true"
  );

  const handleToggleSidebar = () => {
    const nextState = !sidebarCollapsed;
    setSidebarCollapsed(nextState);
    localStorage.setItem("admin-sidebar-collapsed", nextState);
  };

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const projectRes = await fetch("/api/admin/projects");
      const projects = projectRes.ok ? await projectRes.json() : [];

      const skillRes = await fetch("/api/admin/skills");
      const skills = skillRes.ok ? await skillRes.json() : [];

      const contactRes = await fetch("/api/admin/contacts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (contactRes.status === 401) {
        handleLogout();
        return;
      }

      const contactsData = contactRes.ok ? await contactRes.json() : [];
      setContacts(contactsData);

      // Fetch Portfolio Content and Resume Data to complete dynamic analytics
      const portfolioRes = await fetch("/api/admin/portfolio-content");
      const portfolioData = portfolioRes.ok ? await portfolioRes.json() : null;
      setPortfolioContent(portfolioData);

      const resumeRes = await fetch("/api/admin/resume");
      let cvData = resumeRes.ok ? await resumeRes.json() : null;
      if (Array.isArray(cvData)) cvData = cvData[0] || null;
      setResumeData(cvData);

      const uniqueCats = [...new Set(skills.map(s => s.category || "General"))].length;

      setStats({
        projects: projects.length,
        skills: skills.length,
        skillCategories: uniqueCats,
        messages: contactsData.length,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate dynamic tasks based on database completeness
  const getDynamicTasks = () => {
    const tasks = [];
    
    // Task 1: Hero Setup
    const heroPhotoSet = !!(portfolioContent?.hero?.profilePhoto);
    tasks.push({
      task: heroPhotoSet ? "Hero avatar profile image configured" : "Configure Hero avatar profile image",
      status: heroPhotoSet ? "Done" : "Pending",
      color: heroPhotoSet ? "admin-dot-emerald" : "admin-dot-amber",
      time: heroPhotoSet ? "Configured" : "Action required"
    });

    // Task 2: Biography Text
    const bioTextSet = !!(portfolioContent?.about?.text);
    tasks.push({
      task: bioTextSet ? "Biography storytelling intro is live" : "Set up your story bio text",
      status: bioTextSet ? "Done" : "Pending",
      color: bioTextSet ? "admin-dot-emerald" : "admin-dot-amber",
      time: bioTextSet ? "Configured" : "Action required"
    });

    // Task 3: Projects Showcase Catalog
    const hasProjects = stats.projects > 0;
    tasks.push({
      task: hasProjects ? `Featured Portfolio Showcase catalog` : "Upload featured showcase projects",
      status: hasProjects ? "Active" : "Pending",
      color: hasProjects ? "admin-dot-emerald" : "admin-dot-amber",
      time: hasProjects ? `${stats.projects} projects` : "Action required"
    });

    // Task 4: Technical Skills Setup
    const hasSkills = stats.skills > 0;
    tasks.push({
      task: hasSkills ? `Technical skill proficiencies registered` : "Configure tech skill chips",
      status: hasSkills ? "Active" : "Pending",
      color: hasSkills ? "admin-dot-emerald" : "admin-dot-amber",
      time: hasSkills ? `${stats.skills} skills` : "Action required"
    });

    // Task 5: CV Resume Details
    const resumeFilled = !!(resumeData?.experience?.length || resumeData?.education?.length);
    tasks.push({
      task: resumeFilled ? `CV Career & Academic slots calibrated` : "Calibrate CV resume credentials",
      status: resumeFilled ? "Active" : "Pending",
      color: resumeFilled ? "admin-dot-emerald" : "admin-dot-amber",
      time: resumeFilled ? `${(resumeData?.experience?.length || 0) + (resumeData?.education?.length || 0)} entries` : "Action required"
    });

    // Task 6: Blog Publications
    const hasBlogs = !!(portfolioContent?.blogPosts?.length);
    tasks.push({
      task: hasBlogs ? "Medium publications stream connected" : "Link dynamic blog posts",
      status: hasBlogs ? "Active" : "Pending",
      color: hasBlogs ? "admin-dot-emerald" : "admin-dot-blue",
      time: hasBlogs ? `${portfolioContent.blogPosts.length} articles` : "Optional"
    });

    return tasks;
  };

  const dynamicTasks = getDynamicTasks();
  const completedTasksCount = dynamicTasks.filter(t => t.status === "Done" || t.status === "Active").length;
  const tasksProgressPercentage = Math.round((completedTasksCount / dynamicTasks.length) * 100);

  const getInquiriesTrend = () => {
    const trendDays = [];
    const trendCounts = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const label = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      trendDays.push(label);
      
      const count = contacts.filter(c => {
        if (!c.createdAt) return false;
        const cDate = new Date(c.createdAt);
        return cDate.getFullYear() === d.getFullYear() &&
               cDate.getMonth() === d.getMonth() &&
               cDate.getDate() === d.getDate();
      }).length;
      trendCounts.push(count);
    }
    
    // Scale points to fit 600x120 SVG viewport
    const maxCount = Math.max(...trendCounts, 1);
    const points = trendCounts.map((count, index) => {
      const x = (index / 6) * 600;
      const y = 120 - (count / maxCount) * 80;
      return { x, y, count };
    });
    
    return { trendDays, trendCounts, points };
  };

  const { trendDays, trendCounts, points } = getInquiriesTrend();
  
  // Calculate dynamic path for SVG
  const pathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p, i) => {
        const prev = points[i];
        const cpX1 = prev.x + 50;
        const cpY1 = prev.y;
        const cpX2 = p.x - 50;
        const cpY2 = p.y;
        return `C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
      }).join(' ')
    : "";

  const baseD = points.map((p, idx) => {
    const yVal = 130 - (idx % 2 === 0 ? 10 : 5);
    return { x: p.x, y: yVal };
  });
  
  const basePathD = baseD.length > 0 
    ? `M ${baseD[0].x} ${baseD[0].y} ` + baseD.slice(1).map((p, i) => {
        const prev = baseD[i];
        const cpX1 = prev.x + 50;
        const cpY1 = prev.y;
        const cpX2 = p.x - 50;
        const cpY2 = p.y;
        return `C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
      }).join(' ')
    : "";

  const totalWeeklyInquiries = trendCounts.reduce((a, b) => a + b, 0);
  const todayInquiries = trendCounts[6] || 0;

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "resume", label: "Resume", icon: FileText },
    { id: "skills", label: "Skills", icon: Cpu },
    { id: "portfolio", label: "Portfolio", icon: Globe },
    { id: "inquiries", label: "Inquiries", icon: MessageSquare },
  ];

  if (loading) {
    return (
      <div className="admin-scope-wrapper" data-theme={theme} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--admin-bg-page)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            style={{ width: '3rem', height: '3rem', borderRadius: '50%', border: '4px solid var(--admin-border-light)', borderTopColor: 'var(--admin-accent-blue)' }}
          />
          <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--admin-text-muted)', letterSpacing: '0.2em' }}>Initializing control system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-scope-wrapper" data-theme={theme}>
      <div className="admin-dashboard-container">
        <div className="admin-dashboard-main-frame">
          
          {/* ── 1. LEFT SIDEBAR ── */}
          <aside className={`admin-sidebar-left ${sidebarCollapsed ? "admin-sidebar-collapsed" : ""}`}>
            <div>
              {/* Brand Header Logo */}
              <div className="admin-sidebar-brand" style={{ display: 'flex', justifyContent: sidebarCollapsed ? 'center' : 'space-between', alignItems: 'center', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div 
                    className="admin-sidebar-brand-icon"
                    onClick={sidebarCollapsed ? handleToggleSidebar : undefined}
                    style={{ cursor: sidebarCollapsed ? 'pointer' : 'default' }}
                    title={sidebarCollapsed ? "Expand Sidebar" : undefined}
                  >
                    S
                  </div>
                  {!sidebarCollapsed && (
                    <div className="admin-sidebar-brand-text">
                      <h2>seth.portfolio</h2>
                      <span>Admin Panel</span>
                    </div>
                  )}
                </div>
                
                {!sidebarCollapsed ? (
                  <button 
                    onClick={handleToggleSidebar}
                    className="admin-sidebar-collapse-toggle"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--admin-text-muted)',
                      cursor: 'pointer',
                      padding: '0.35rem',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      backgroundColor: 'var(--admin-bg-hover)',
                    }}
                    title="Collapse Sidebar"
                  >
                    <ChevronLeft size={14} />
                  </button>
                ) : (
                  <button 
                    onClick={handleToggleSidebar}
                    className="admin-sidebar-collapse-toggle"
                    style={{
                      position: 'absolute',
                      right: '-16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'var(--admin-accent-blue)',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      width: '1.25rem',
                      height: '1.25rem',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--admin-shadow-sm)',
                      zIndex: 10
                    }}
                    title="Expand Sidebar"
                  >
                    <ChevronRight size={10} />
                  </button>
                )}
              </div>

              {/* Navigation Menu Links */}
              <nav className="admin-sidebar-menu">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`admin-sidebar-menu-btn ${isActive ? "admin-sidebar-menu-btn-active" : ""}`}
                      style={{ 
                        justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                        padding: sidebarCollapsed ? '0.85rem' : '0.85rem 1.1rem',
                        position: 'relative'
                      }}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <Icon size={16} />
                      {!sidebarCollapsed && (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          {item.label}
                          {item.id === "inquiries" && contacts.length > 0 && (
                            <span 
                              className="admin-feed-badge" 
                              style={{ 
                                marginLeft: "auto", 
                                fontSize: "0.58rem", 
                                fontWeight: 800,
                                backgroundColor: "var(--admin-accent-blue)",
                                color: "#ffffff",
                                borderRadius: "6px",
                                padding: "0.15rem 0.4rem",
                                lineHeight: 1
                              }}
                            >
                              {contacts.length}
                            </span>
                          )}
                        </span>
                      )}
                      
                      {/* Compact Indicator Dot for collapsed view */}
                      {sidebarCollapsed && item.id === "inquiries" && contacts.length > 0 && (
                        <span 
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--admin-accent-blue)',
                            border: '1px solid var(--admin-bg-card)',
                            boxShadow: '0 0 4px rgba(59, 130, 246, 0.4)'
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions card promos and logout */}
            <div className="admin-sidebar-footer" style={{ paddingLeft: sidebarCollapsed ? '0.5rem' : '0', paddingRight: sidebarCollapsed ? '0.5rem' : '0' }}>
              <button
                type="button"
                onClick={toggleTheme}
                className="admin-sidebar-footer-btn"
                style={{ 
                  marginBottom: '0.5rem', 
                  border: '1px solid var(--admin-border-light)',
                  backgroundColor: 'var(--admin-bg-card)',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  fontWeight: 800,
                  fontSize: sidebarCollapsed ? '0px' : '0.68rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  padding: sidebarCollapsed ? '0.85rem' : '0.7rem 1.1rem',
                  gap: sidebarCollapsed ? '0' : '0.75rem'
                }}
                title={sidebarCollapsed ? (theme === "light" ? "Dark Theme" : "Light Theme") : undefined}
              >
                {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
                {!sidebarCollapsed && (theme === "light" ? "Dark Theme" : "Light Theme")}
              </button>

              {/* Compressed Showcase Globe button when collapsed */}
              {sidebarCollapsed && (
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-sidebar-footer-btn"
                  style={{ 
                    justifyContent: 'center', 
                    marginBottom: '0.5rem', 
                    border: '1px solid var(--admin-border-light)', 
                    backgroundColor: 'var(--admin-bg-card)',
                    padding: '0.85rem'
                  }}
                  title="View Live Showcase"
                >
                  <Globe size={15} />
                </a>
              )}

              {!sidebarCollapsed && (
                <div className="admin-sidebar-promo-card">
                  <h5>Live Showcase</h5>
                  <p>Verify live frontend uploads</p>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-sidebar-promo-btn"
                  >
                    View site
                  </a>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="admin-sidebar-footer-btn admin-sidebar-logout-btn"
                style={{
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  padding: sidebarCollapsed ? '0.85rem' : '0.7rem 1.1rem',
                  gap: sidebarCollapsed ? '0' : '0.75rem',
                  fontSize: sidebarCollapsed ? '0px' : '0.7rem'
                }}
                title={sidebarCollapsed ? "Logout" : undefined}
              >
                <LogOut size={16} />
                {!sidebarCollapsed && "Logout"}
              </button>
            </div>
          </aside>

          {/* ── 2. CENTRAL WORKSPACE COLUMN ── */}
          <main className="admin-workspace">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ width: '100%' }}
              >
                {activeTab === "overview" && (
                  <div>
                    {/* Header */}
                    <div className="admin-workspace-title-row">
                      <div>
                        <h2>Hello, Seth</h2>
                        <p>Track your brand progress here. Keep updating your portfolio!</p>
                      </div>

                      <div className="admin-workspace-date">
                        <Calendar size={13} />
                        <span>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>

                    {/* Metrics Row */}
                    <div className="admin-metrics-row">
                      {/* Projects Showcase */}
                      <div className="admin-metric-card">
                        <div className="admin-metric-card-icon admin-metric-icon-blue">👍</div>
                        <div className="admin-metric-card-info">
                          <p>Showcase Catalog</p>
                          <div className="admin-metric-card-value">
                            {stats.projects}
                            <span className="admin-metric-card-badge admin-badge-emerald">active items</span>
                          </div>
                        </div>
                      </div>

                      {/* Skills Stack */}
                      <div className="admin-metric-card">
                        <div className="admin-metric-card-icon admin-metric-icon-amber">⏱</div>
                        <div className="admin-metric-card-info">
                          <p>Technical Skills</p>
                          <div className="admin-metric-card-value">
                            {stats.skills}
                            <span className="admin-metric-card-badge admin-badge-emerald">+{stats.skillCategories} categories</span>
                          </div>
                        </div>
                      </div>

                      {/* Inquiry Inbox */}
                      <div className="admin-metric-card">
                        <div className="admin-metric-card-icon admin-metric-icon-indigo">📈</div>
                        <div className="admin-metric-card-info">
                          <p>Inquiries Feed</p>
                          <div className="admin-metric-card-value">
                            {stats.messages}
                            <span className="admin-metric-card-badge admin-badge-emerald">received</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Performance Visual Chart */}
                    <div className="admin-visualization-card">
                      <div className="admin-visualization-header">
                        <h4>Visitor Inquiry Activity</h4>
                        <span style={{ fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", color: "var(--admin-text-muted)", letterSpacing: "0.05em" }}>Inquiries Trend (Last 7 Days)</span>
                      </div>

                      {/* Dynamic Line Graph */}
                      <div className="admin-svg-graph-container">
                        <svg style={{ width: '100%', height: '100%', overflow: 'visible' }} viewBox="0 0 600 150">
                          {/* Grid Lines */}
                          <line x1="0" y1="20" x2="600" y2="20" stroke="var(--admin-border-chart)" strokeWidth="1" />
                          <line x1="0" y1="50" x2="600" y2="50" stroke="var(--admin-border-chart)" strokeWidth="1" />
                          <line x1="0" y1="80" x2="600" y2="80" stroke="var(--admin-border-chart)" strokeWidth="1" />
                          <line x1="0" y1="110" x2="600" y2="110" stroke="var(--admin-border-chart)" strokeWidth="1" />

                          {/* Dynamic inquiries path (Blue Line) */}
                          {pathD && (
                            <path 
                              d={pathD} 
                              fill="none" 
                              stroke="#3b82f6" 
                              strokeWidth="2.5" 
                              strokeLinecap="round"
                            />
                          )}

                          {/* Dynamic comparison baseline path (Orange Dashed Line) */}
                          {basePathD && (
                            <path 
                              d={basePathD} 
                              fill="none" 
                              stroke="#f97316" 
                              strokeWidth="2.5" 
                              strokeLinecap="round"
                              strokeDasharray="4 2"
                              opacity="0.5"
                            />
                          )}

                          {/* Dynamic Interactive Dot on today's point (last element) */}
                          {points.length > 0 && (
                            <circle 
                              cx={points[6].x} 
                              cy={points[6].y} 
                              r="4.5" 
                              fill="#3b82f6" 
                              stroke="#ffffff" 
                              strokeWidth="1.5" 
                            />
                          )}

                          {/* Dynamic Tooltip positioned over today's data (last point) */}
                          {points.length > 0 && (
                            <foreignObject x={points[6].x - 130} y={points[6].y - 85} width="125" height="75" style={{ overflow: 'visible' }}>
                              <div style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '0.45rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.55rem', fontWeight: 800, textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', lineHeight: 1.35, border: '1px solid var(--admin-border-light)' }}>
                                <span style={{ fontSize: '0.45rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inquiry Report</span>
                                <span style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', marginTop: '0.2rem' }}><span style={{ color: '#3b82f6' }}>Today</span> <span>{todayInquiries} msg</span></span>
                                <span style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between' }}><span style={{ color: '#f97316' }}>7-Day Total</span> <span>{totalWeeklyInquiries} msg</span></span>
                              </div>
                            </foreignObject>
                          )}
                        </svg>

                        <div className="admin-svg-labels">
                          {trendDays.map((day, idx) => (
                            <span key={idx}>{day}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Current Tasks List */}
                    <div className="admin-tasks-card">
                      <div className="admin-tasks-header">
                        <h4>Portfolio Setup Completeness <span>Done {tasksProgressPercentage}%</span></h4>
                        <span style={{ fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", color: "var(--admin-text-muted)", letterSpacing: "0.05em" }}>Completeness Meter</span>
                      </div>

                      <div className="admin-tasks-list">
                        {dynamicTasks.map((t, i) => (
                          <div key={i} className="admin-task-item">
                            <div className="admin-task-item-left">
                              <div className="admin-task-item-icon-wrapper" style={{ color: t.status === "Done" || t.status === "Active" ? "var(--admin-accent-emerald)" : "var(--admin-text-muted)" }}>
                                <CheckCircle2 size={15} />
                              </div>
                              <span 
                                className="admin-task-item-title" 
                                style={{ 
                                  textDecoration: t.status === "Done" || t.status === "Active" ? "line-through" : "none", 
                                  color: t.status === "Done" || t.status === "Active" ? "var(--admin-text-muted)" : "var(--admin-text-primary)",
                                  fontWeight: t.status === "Done" || t.status === "Active" ? 600 : 700
                                }}
                              >
                                {t.task}
                              </span>
                            </div>

                            <div className="admin-task-item-right">
                              <span className="admin-task-status">
                                <span className={`admin-task-status-dot ${t.color}`} />
                                {t.status}
                              </span>

                              <span className="admin-task-time">
                                <Clock size={11} /> {t.time}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* Sub components inside central wrapper */}
                {activeTab === "projects" && <ProjectManager token={token} />}
                {activeTab === "skills" && <SkillManager token={token} />}
                {activeTab === "resume" && <ResumeManager token={token} />}
                {activeTab === "portfolio" && <PortfolioManager token={token} />}

                {activeTab === "inquiries" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    {/* Header title */}
                    <div className="admin-workspace-title-row" style={{ marginBottom: 0 }}>
                      <div>
                        <h2>Inquiries & Messages</h2>
                        <p>Manage visitor contact requests, messaging feed, and system properties</p>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: "2rem" }}>
                      
                      {/* Left: Profile Card */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <div className="admin-profile-card" style={{ margin: 0, padding: "2rem 1.5rem" }}>
                          <div className="admin-profile-avatar" style={{ width: "5rem", height: "5rem" }}>
                            <span className="admin-profile-avatar-status" style={{ width: "1rem", height: "1rem", border: "2px solid var(--admin-bg-card)" }}></span>
                            <User size={40} />
                          </div>
                          <h4 style={{ fontSize: "0.9rem", marginTop: "1.25rem" }}>Seth Kipchumba Korir</h4>
                          <span style={{ fontSize: "0.65rem" }}>@SethKkorir</span>

                          <div className="admin-profile-actions" style={{ marginTop: "1.5rem", gap: "0.75rem" }}>
                            <a href="tel:+254748497623" className="admin-profile-action-btn" title="Phone Hotline"><Phone size={14} /></a>
                            <a href="mailto:zsethkipchumba179@gmail.com" className="admin-profile-action-btn" title="Direct Email"><Mail size={14} /></a>
                            <button 
                              onClick={toggleTheme} 
                              className="admin-profile-action-btn" 
                              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                            >
                              {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
                            </button>
                            <button 
                              onClick={() => alert("System Status: MongoDB Connected\nJWT Auth: Verified\nCSS Mode: Pure Vanilla")} 
                              className="admin-profile-action-btn" 
                              title="System Info"
                            >
                              <MoreHorizontal size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Quick system status card */}
                        <div className="admin-editor-panel" style={{ margin: 0, padding: "1.25rem" }}>
                          <h5 style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--admin-text-muted)", letterSpacing: "0.1em", marginBottom: "0.75rem", fontWeight: 800 }}>System Parameters</h5>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.68rem", fontWeight: 700 }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span style={{ color: "var(--admin-text-secondary)" }}>Database:</span>
                              <span style={{ color: "var(--admin-accent-emerald)" }}>Connected</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span style={{ color: "var(--admin-text-secondary)" }}>Auth Token:</span>
                              <span style={{ color: "var(--admin-accent-blue)" }}>Active</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span style={{ color: "var(--admin-text-secondary)" }}>System Theme:</span>
                              <span style={{ textTransform: "capitalize" }}>{theme} Mode</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Inquiries List */}
                      <div className="admin-editor-panel" style={{ margin: 0, padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div className="admin-feed-header" style={{ borderBottom: "1px solid var(--admin-border-light)", paddingBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase", color: "var(--admin-text-primary)", letterSpacing: "0.08em" }}>Visitor Contact Stream</span>
                          <span className="admin-feed-badge" style={{ backgroundColor: "var(--admin-accent-blue)", color: "#ffffff", border: "none" }}>{contacts.length} MSG</span>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", overflowY: "auto", maxHeight: "400px", paddingRight: "0.5rem" }}>
                          {contacts.length === 0 ? (
                            <div className="admin-feed-empty" style={{ padding: "4rem 0" }}>
                              <MessageSquare size={24} style={{ color: "var(--admin-text-muted)", margin: "0 auto 0.75rem" }} />
                              <p style={{ fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", color: "var(--admin-text-muted)", letterSpacing: "0.05em" }}>No messages received yet</p>
                            </div>
                          ) : (
                            contacts.map((c, idx) => (
                              <div key={c._id || idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                <div className="admin-feed-item-header">
                                  <span className="admin-feed-item-name">{c.name}</span>
                                  <span className="admin-feed-item-time">
                                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:15 AM'}
                                  </span>
                                </div>
                                
                                <div className="admin-feed-bubble" style={{ marginTop: "0.35rem" }}>
                                  <p style={{ margin: 0 }}>{c.message}</p>
                                  <a href={`mailto:${c.email}`} className="admin-feed-bubble-reply">Reply via Email</a>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
//