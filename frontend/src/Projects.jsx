import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Github,
    ExternalLink,
    ArrowRight,
    RotateCw,
    Shield,
    Laptop,
    Code2,
    Layers
} from "lucide-react";

const DEFAULT_PROJECTS = [
    {
        title: "Rerendet Coffee",
        description:
            "A premium digital coffee brand experience engineered for modern responsive commerce. Features seamless state management, rich smooth animations, and a polished dark interface.",
        category: "E-Commerce",
        techStack: ["React.js", "Vanilla CSS", "Framer Motion"],
        githubLink: "https://github.com/SethKkorir/rerendet_website",
        demoLink: "https://rerendet-website-two.vercel.app/",
        image: ""
    }
];

/* ── Color Mapping ── */
const PROJECT_THEMES = {
    ecommerce: { accent: "245, 158, 11", label: "#f59e0b" },
    backend:   { accent: "16, 185, 129",  label: "#10b981" },
    api:       { accent: "16, 185, 129",  label: "#10b981" },
    fullstack: { accent: "139, 92, 246",  label: "#8b5cf6" },
    mern:      { accent: "139, 92, 246",  label: "#8b5cf6" },
    frontend:  { accent: "59, 130, 246",  label: "#3b82f6" },
    default:   { accent: "99, 102, 241",  label: "#6366f1" },
};

function getTheme(title, category) {
    const t = (title || "").toLowerCase();
    const c = (category || "").toLowerCase();
    if (t.includes("coffee") || c.includes("commerce")) return PROJECT_THEMES.ecommerce;
    if (c.includes("backend")) return PROJECT_THEMES.backend;
    if (c.includes("api")) return PROJECT_THEMES.api;
    if (c.includes("fullstack") || c.includes("mern")) return PROJECT_THEMES.fullstack;
    if (c.includes("frontend")) return PROJECT_THEMES.frontend;
    return PROJECT_THEMES.default;
}

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [iframeLoading, setIframeLoading] = useState(true);
    const [iframeKey, setIframeKey] = useState(0);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch("/api/admin/projects");
                const data = await res.json();
                setProjects(
                    Array.isArray(data) && data.length > 0 ? data : DEFAULT_PROJECTS
                );
            } catch {
                setProjects(DEFAULT_PROJECTS);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    useEffect(() => {
        setIframeLoading(true);
    }, [activeIndex]);

    const activeProject = projects[activeIndex] || DEFAULT_PROJECTS[0];
    const hasLiveLink = activeProject?.demoLink && activeProject.demoLink !== "#";
    const theme = getTheme(activeProject.title, activeProject.category);

    const handleReload = () => {
        setIframeLoading(true);
        setIframeKey((prev) => prev + 1);
    };

    /* ── Styles ── */
    const sectionStyle = {
        padding: "120px 0",
        background: "var(--bg-main)",
        position: "relative",
        overflow: "hidden",
    };

    const glowStyle = (top, left, size, color) => ({
        position: "absolute",
        top, left,
        width: size, height: size,
        background: `radial-gradient(circle, rgba(${color}, 0.06) 0%, transparent 70%)`,
        borderRadius: "50%",
        pointerEvents: "none",
        filter: "blur(80px)",
    });

    return (
        <section id="projects" style={sectionStyle}>
            {/* Ambient glows */}
            <div style={glowStyle("10%", "-5%", "500px", "99, 102, 241")} />
            <div style={glowStyle("60%", "70%", "550px", "14, 165, 233")} />

            <div className="container" style={{ position: "relative", zIndex: 10 }}>

                {/* ── Section Header ── */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    marginBottom: "4rem",
                    flexWrap: "wrap",
                    gap: "2rem",
                }}>
                    <div>
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.4rem 1rem",
                            borderRadius: "50px",
                            background: "rgba(99, 102, 241, 0.08)",
                            border: "1px solid rgba(99, 102, 241, 0.15)",
                            marginBottom: "1.25rem",
                        }}>
                            <Layers size={14} style={{ color: "var(--accent)" }} />
                            <span style={{
                                fontSize: "0.7rem",
                                fontWeight: 800,
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                color: "var(--accent)",
                            }}>Live Workbench</span>
                        </div>
                        <h2 style={{
                            fontSize: "clamp(2.5rem, 5vw, 4rem)",
                            fontWeight: 900,
                            fontFamily: "var(--font-heading)",
                            color: "var(--text-primary)",
                            letterSpacing: "-0.03em",
                            lineHeight: 1.1,
                        }}>
                            Projects
                        </h2>
                        <p style={{
                            color: "var(--text-secondary)",
                            opacity: 0.7,
                            marginTop: "1rem",
                            maxWidth: "520px",
                            fontWeight: 600,
                            fontSize: "1rem",
                            lineHeight: 1.7,
                        }}>
                            An interactive showcase of deployed modules, client-facing systems, and custom-built layouts.
                        </p>
                    </div>

                    <a
                        href="https://github.com/SethKkorir?tab=repositories"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline"
                        style={{
                            borderRadius: "50px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            textDecoration: "none",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                        }}
                    >
                        View Full Archive
                        <ArrowRight size={16} />
                    </a>
                </div>

                {loading ? (
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "8rem 0",
                        gap: "1rem",
                    }}>
                        <div style={{
                            width: 48, height: 48,
                            border: "3px solid rgba(255,255,255,0.05)",
                            borderTop: "3px solid var(--accent)",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                        }} />
                        <span style={{
                            color: "var(--text-muted)",
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.15em",
                        }}>Loading projects...</span>
                    </div>
                ) : (
                    /* ── Main Workbench Grid ── */
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: "2rem",
                        alignItems: "start",
                    }}
                        className="projects-workbench-grid"
                    >
                        {/* LEFT: Project Selector Cards */}
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                            maxHeight: "600px",
                            overflowY: "auto",
                            paddingRight: "0.5rem",
                        }}
                            className="projects-selector-col"
                        >
                            {projects.map((project, idx) => {
                                const isActive = activeIndex === idx;
                                const t = getTheme(project.title, project.category);
                                const accentColor = `rgba(${t.accent}, 1)`;

                                return (
                                    <motion.div
                                        key={idx}
                                        onClick={() => setActiveIndex(idx)}
                                        whileHover={{ scale: 1.003 }}
                                        whileTap={{ scale: 0.998 }}
                                        style={{
                                            borderRadius: "1rem",
                                            padding: isActive ? "1.25rem" : "0.85rem 1rem",
                                            cursor: "pointer",
                                            transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                                            background: isActive
                                                ? `linear-gradient(135deg, rgba(${t.accent}, 0.06) 0%, rgba(9, 9, 20, 0.85) 100%)`
                                                : "rgba(9, 9, 20, 0.35)",
                                            border: isActive
                                                ? `1px solid rgba(${t.accent}, 0.35)`
                                                : "1px solid rgba(255, 255, 255, 0.03)",
                                            boxShadow: isActive
                                                ? `0 12px 32px -8px rgba(${t.accent}, 0.1)`
                                                : "none",
                                            position: "relative",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {/* Active indicator line */}
                                        {isActive && (
                                            <div style={{
                                                position: "absolute",
                                                top: 0, left: 0, bottom: 0,
                                                width: "3px",
                                                background: `linear-gradient(180deg, ${accentColor}, transparent)`,
                                                borderRadius: "0 4px 4px 0",
                                            }} />
                                        )}

                                        {/* Card header row */}
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            gap: "0.75rem",
                                        }}>
                                            <h3 style={{
                                                fontSize: isActive ? "1.05rem" : "0.9rem",
                                                fontWeight: 800,
                                                fontFamily: "var(--font-heading)",
                                                color: isActive ? "white" : "var(--text-secondary)",
                                                transition: "all 0.3s ease",
                                                letterSpacing: "-0.01em",
                                                margin: 0,
                                            }}>
                                                {project.title}
                                            </h3>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                                                <span style={{
                                                    padding: "0.2rem 0.6rem",
                                                    borderRadius: "50px",
                                                    fontSize: "0.55rem",
                                                    fontWeight: 800,
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.06em",
                                                    whiteSpace: "nowrap",
                                                    background: isActive
                                                        ? `rgba(${t.accent}, 0.15)`
                                                        : "rgba(255,255,255,0.03)",
                                                    color: isActive ? t.label : "var(--text-muted)",
                                                    border: `1px solid ${isActive ? `rgba(${t.accent}, 0.2)` : "rgba(255,255,255,0.05)"}`,
                                                }}>
                                                    {project.category || "Project"}
                                                </span>
                                                {project.demoLink && project.demoLink !== "#" && (
                                                    <span style={{
                                                        width: 7, height: 7,
                                                        borderRadius: "50%",
                                                        background: "#22c55e",
                                                        boxShadow: "0 0 6px rgba(34,197,94,0.5)",
                                                        flexShrink: 0,
                                                    }} title="Live" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Expanded details — only shown on active card */}
                                        {isActive && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                transition={{ duration: 0.25 }}
                                                style={{ overflow: "hidden" }}
                                            >
                                                <p style={{
                                                    color: "var(--text-muted)",
                                                    fontSize: "0.75rem",
                                                    lineHeight: 1.65,
                                                    fontWeight: 600,
                                                    marginTop: "0.6rem",
                                                    marginBottom: "0.75rem",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                }}>
                                                    {project.description}
                                                </p>

                                                {/* Tech badges */}
                                                <div style={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: "0.3rem",
                                                    marginBottom: "0.75rem",
                                                }}>
                                                    {project.techStack?.slice(0, 4).map((tech, i) => (
                                                        <span key={i} style={{
                                                            padding: "0.2rem 0.5rem",
                                                            borderRadius: "6px",
                                                            fontSize: "0.55rem",
                                                            fontWeight: 800,
                                                            textTransform: "uppercase",
                                                            letterSpacing: "0.04em",
                                                            background: `rgba(${t.accent}, 0.06)`,
                                                            border: `1px solid rgba(${t.accent}, 0.12)`,
                                                            color: `rgba(${t.accent}, 0.85)`,
                                                        }}>
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Card footer links */}
                                                <div style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    paddingTop: "0.6rem",
                                                    borderTop: "1px solid rgba(255,255,255,0.04)",
                                                }}>
                                                    <a
                                                        href={project.githubLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{
                                                            color: "var(--text-muted)",
                                                            textDecoration: "none",
                                                            fontSize: "0.65rem",
                                                            fontWeight: 800,
                                                            textTransform: "uppercase",
                                                            letterSpacing: "0.08em",
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            gap: "0.35rem",
                                                            transition: "color 0.2s ease",
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.color = "white"}
                                                        onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                                                    >
                                                        <Github size={13} /> Repository
                                                    </a>

                                                    {project.demoLink && project.demoLink !== "#" ? (
                                                        <a
                                                            href={project.demoLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            style={{
                                                                color: t.label,
                                                                textDecoration: "none",
                                                                fontSize: "0.65rem",
                                                                fontWeight: 800,
                                                                textTransform: "uppercase",
                                                                letterSpacing: "0.08em",
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                gap: "0.3rem",
                                                            }}
                                                        >
                                                            Live <ExternalLink size={11} />
                                                        </a>
                                                    ) : (
                                                        <span style={{
                                                            fontSize: "0.55rem",
                                                            fontWeight: 800,
                                                            textTransform: "uppercase",
                                                            letterSpacing: "0.08em",
                                                            color: "var(--text-muted)",
                                                            opacity: 0.5,
                                                        }}>In Development</span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* RIGHT: Interactive Canvas / Live Preview */}
                        <div className="projects-canvas-col">
                            <div style={{
                                borderRadius: "2rem",
                                overflow: "hidden",
                                border: "1px solid rgba(255,255,255,0.06)",
                                background: "#040212",
                                boxShadow: `0 32px 64px -16px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(${theme.accent}, 0.05)`,
                                display: "flex",
                                flexDirection: "column",
                            }}>
                                {/* Browser chrome mockup */}
                                <div style={{
                                    padding: "1rem 1.5rem",
                                    background: "rgba(8, 7, 28, 0.9)",
                                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "1rem",
                                }}>
                                    {/* Traffic light dots */}
                                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444", opacity: 0.85 }} />
                                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#eab308", opacity: 0.85 }} />
                                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#22c55e", opacity: 0.85 }} />
                                    </div>

                                    {/* SSL Address bar */}
                                    <div style={{
                                        flex: 1,
                                        maxWidth: "420px",
                                        background: "rgba(3, 0, 20, 0.65)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                        borderRadius: "1rem",
                                        padding: "0.5rem 1rem",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        justifyContent: "center",
                                    }}>
                                        <Shield size={12} style={{ color: "#22c55e", flexShrink: 0 }} />
                                        <span style={{
                                            fontSize: "0.72rem",
                                            fontWeight: 700,
                                            color: "var(--text-muted)",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            userSelect: "none",
                                        }}>
                                            {hasLiveLink ? activeProject.demoLink : "https://local.production.showcase"}
                                        </span>
                                    </div>

                                    {/* Action buttons */}
                                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                        {hasLiveLink && (
                                            <>
                                                <button
                                                    onClick={handleReload}
                                                    title="Reload Live View"
                                                    style={{
                                                        width: 32, height: 32,
                                                        borderRadius: "10px",
                                                        background: "rgba(255,255,255,0.03)",
                                                        border: "1px solid rgba(255,255,255,0.06)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        color: "var(--text-muted)",
                                                        cursor: "pointer",
                                                        transition: "all 0.2s ease",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                                                        e.currentTarget.style.color = "white";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                                                        e.currentTarget.style.color = "var(--text-muted)";
                                                    }}
                                                >
                                                    <RotateCw
                                                        size={14}
                                                        style={{
                                                            animation: iframeLoading ? "spin 1s linear infinite" : "none",
                                                        }}
                                                    />
                                                </button>
                                                <a
                                                    href={activeProject.demoLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title="Open in New Tab"
                                                    style={{
                                                        width: 32, height: 32,
                                                        borderRadius: "10px",
                                                        background: "rgba(255,255,255,0.03)",
                                                        border: "1px solid rgba(255,255,255,0.06)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        color: "var(--text-muted)",
                                                        textDecoration: "none",
                                                        transition: "all 0.2s ease",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                                                        e.currentTarget.style.color = "white";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                                                        e.currentTarget.style.color = "var(--text-muted)";
                                                    }}
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Canvas viewport */}
                                <div style={{
                                    height: "520px",
                                    width: "100%",
                                    position: "relative",
                                    background: "#030014",
                                    overflow: "hidden",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    <AnimatePresence mode="wait">
                                        {hasLiveLink ? (
                                            /* ── LIVE IFRAME MODE ── */
                                            <motion.div
                                                key={`live-${activeIndex}-${iframeKey}`}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                style={{ width: "100%", height: "100%", position: "relative" }}
                                            >
                                                <iframe
                                                    key={iframeKey}
                                                    src={activeProject.demoLink}
                                                    title={activeProject.title}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        border: "none",
                                                        display: "block",
                                                    }}
                                                    onLoad={() => setIframeLoading(false)}
                                                    sandbox="allow-scripts allow-same-origin allow-popups"
                                                />

                                                {/* Loading overlay */}
                                                {iframeLoading && (
                                                    <div style={{
                                                        position: "absolute",
                                                        inset: 0,
                                                        background: "#030014",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: "0.75rem",
                                                    }}>
                                                        <div style={{
                                                            width: 40, height: 40,
                                                            border: "2px solid rgba(255,255,255,0.05)",
                                                            borderTop: `2px solid ${theme.label}`,
                                                            borderRadius: "50%",
                                                            animation: "spin 1s linear infinite",
                                                        }} />
                                                        <span style={{
                                                            fontSize: "0.6rem",
                                                            fontWeight: 800,
                                                            textTransform: "uppercase",
                                                            letterSpacing: "0.15em",
                                                            color: "var(--text-muted)",
                                                        }}>Rendering Live View...</span>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ) : (
                                            /* ── STATIC / IMAGE FALLBACK MODE ── */
                                            <motion.div
                                                key={`static-${activeIndex}`}
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.98 }}
                                                transition={{ duration: 0.4 }}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    position: "relative",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    padding: "2.5rem",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                {/* Background image if available */}
                                                {activeProject.image && (
                                                    <div style={{
                                                        position: "absolute",
                                                        inset: 0,
                                                        width: "100%",
                                                        height: "100%",
                                                    }}>
                                                        <img
                                                            src={activeProject.image}
                                                            alt={activeProject.title}
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover",
                                                                opacity: 0.3,
                                                                filter: "blur(2px)",
                                                                transition: "all 0.7s ease",
                                                            }}
                                                        />
                                                        <div style={{
                                                            position: "absolute",
                                                            inset: 0,
                                                            background: "linear-gradient(to top, #030014 0%, rgba(3,0,20,0.65) 50%, transparent 100%)",
                                                        }} />
                                                    </div>
                                                )}

                                                {/* Under production shield */}
                                                <div style={{
                                                    position: "relative",
                                                    zIndex: 10,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    textAlign: "center",
                                                    maxWidth: "360px",
                                                    gap: "1.25rem",
                                                    padding: "2.5rem",
                                                    background: "rgba(9, 8, 24, 0.7)",
                                                    backdropFilter: "blur(20px)",
                                                    WebkitBackdropFilter: "blur(20px)",
                                                    border: "1px solid rgba(255,255,255,0.06)",
                                                    borderRadius: "1.5rem",
                                                }}>
                                                    <div style={{
                                                        width: 64, height: 64,
                                                        borderRadius: "1rem",
                                                        background: `rgba(${theme.accent}, 0.08)`,
                                                        border: `1px solid rgba(${theme.accent}, 0.2)`,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        color: theme.label,
                                                        boxShadow: `0 8px 32px rgba(${theme.accent}, 0.15)`,
                                                    }}>
                                                        <Laptop size={32} />
                                                    </div>
                                                    <h4 style={{
                                                        fontSize: "1.25rem",
                                                        fontWeight: 900,
                                                        fontFamily: "var(--font-heading)",
                                                        color: "white",
                                                    }}>Under Local Production</h4>
                                                    <p style={{
                                                        color: "var(--text-muted)",
                                                        fontSize: "0.78rem",
                                                        lineHeight: 1.7,
                                                        fontWeight: 600,
                                                    }}>
                                                        This module is running on a local development server. Explore the source code using the GitHub link.
                                                    </p>
                                                    <a
                                                        href={activeProject.githubLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-outline"
                                                        style={{
                                                            borderRadius: "50px",
                                                            fontSize: "0.78rem",
                                                            padding: "0.6rem 1.5rem",
                                                        }}
                                                    >
                                                        <Code2 size={14} /> Explore Codebase
                                                    </a>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Keyframes injected inline */}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .projects-workbench-grid {
                    grid-template-columns: 1fr !important;
                }
                @media (min-width: 1024px) {
                    .projects-workbench-grid {
                        grid-template-columns: 5fr 7fr !important;
                    }
                }
                .projects-selector-col {
                    order: 2;
                }
                .projects-canvas-col {
                    order: 1;
                }
                @media (min-width: 1024px) {
                    .projects-selector-col {
                        order: 1;
                    }
                    .projects-canvas-col {
                        order: 2;
                    }
                }
            `}</style>
        </section>
    );
};

export default Projects;