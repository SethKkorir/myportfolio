import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download, Mail, Phone, MapPin, Github, Linkedin,
  Briefcase, GraduationCap, Code, Wrench, ChevronRight,
  Globe, User, Star
} from 'lucide-react';

const FALLBACK_RESUME = {
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
  experience: [
    {
      role: "Attachment Trainee",
      org: "Techsavanna Company Limited (Software solutions)",
      time: "2024",
      points: [
        "Gained hands-on experience in developing REST APIs and integrating them into web applications.",
        "Collaborated with a team of developers to design, develop, and test backend systems.",
        "Enhanced skills in team collaboration, version control (Git), and API documentation using tools like Postman.",
        "Contributed to the development of scalable and efficient backend solutions."
      ]
    }
  ],
  education: [
    { degree: "Bachelor of Applied Computer Science", school: "Daystar University", time: "2024 – Present" },
    { degree: "Diploma in ICT", school: "Daystar University", time: "2023 – 2024" },
    { degree: "Certificate in ICT", school: "Daystar University", time: "May- 2022 to Nov-2022" },
    { degree: "Kenya Certificate of Secondary Education (KCSE)", school: "Koibeiyon Secondary School", time: "2018 – 2021" }
  ],
  skills: {
    frontend: ["HTML", "CSS", "JavaScript", "React"],
    backend: ["Node.js", "Express", "MongoDB", "REST APIs"],
    tools: ["Git", "Postman", "VS Code", "Poster Design"]
  },
  projects: [
    {
      name: "Rerendet Coffee – Digital Brand Platform",
      tech: "HTML | CSS | JavaScript | React.js (Learning) | MERN (In Progress)",
      desc: "Designed and developed a modern coffee brand website to simulate a real-world business digital presence. Built the initial version using HTML, CSS, and JavaScript, then began transitioning to React.js for component-based development. Currently learning and applying React.js concepts including components, props, and state management. Developing backend functionality using Node.js and Express as part of a MERN stack architecture. Focused on responsive design, performance, and clean UI/UX.",
      link: "https://rerendet-website-two.vercel.app/"
    }
  ],
  referees: [
    {
      name: "Zipporah Mwololo",
      role: "Head of Department, School of Science, Health, and Engineering",
      org: "Daystar University",
      contact: "Phone: +254716372466 | Email: zmwololo@daystar.ac.ke"
    }
  ]
};

const Resume = () => {
  const printRef = useRef(null);
  const [resumeData, setResumeData] = useState(() => {
    const cached = localStorage.getItem('resumeJSON');
    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            if (Object.keys(parsed).length > 2) return parsed;
        } catch(e) {}
    }
    return FALLBACK_RESUME;
  });
  const [showPhoto, setShowPhoto] = useState(false);

  useEffect(() => {
    fetch('/api/admin/resume')
      .then(res => res.ok ? res.json() : Promise.reject('Offline'))
      .then(fetchedData => {
        let single = Array.isArray(fetchedData) ? fetchedData[0] : fetchedData;
        
        // Strict verification: only update if the server data is actually populated
        // This prevents overwriting the fallback with an empty "new" document
        const hasWork = single?.experience?.length > 0;
        const hasProjects = single?.projects?.length > 0;
        const hasEducation = single?.education?.length > 0;

        if (single && single.name && (hasWork || hasProjects || hasEducation)) {
            setResumeData(single);
            localStorage.setItem('resumeJSON', JSON.stringify(single));
        }
      })
      .catch(err => console.warn('Syncing with live backend failed, keeping current data.', err));
  }, []);

  const handlePrint = () => window.print();

  if (!resumeData) return <div className="min-h-screen bg-bg-main flex items-center justify-center text-accent">Loading resume...</div>;
  
  // Extended Safe-guards for rendering safety
  const ensureArray = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(s => s !== '');
    return [];
  };

  const data = {
    ...resumeData,
    contact: resumeData.contact || {},
    skills: {
        frontend: ensureArray(resumeData.skills?.frontend),
        backend: ensureArray(resumeData.skills?.backend),
        tools: ensureArray(resumeData.skills?.tools)
    },
    experience: (resumeData.experience || []).map(e => ({ ...e, points: ensureArray(e.points) })),
    education: resumeData.education || [],
    projects: resumeData.projects || [],
    referees: resumeData.referees || []
  };


  return (
    <div className="resume-page">
      {/* ── Toolbar ── */}
      <div className="resume-toolbar no-print">
        <a href="/" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '0.85rem' }}>
          ← Back to Portfolio
        </a>

          <button className="btn-primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem' }}>
            <Download size={18} /> Download CV
          </button>
        </div>




      {/* ── Resume Document ── */}
      <motion.div
        ref={printRef}
        className="resume-doc"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* LEFT SIDEBAR */}
        <aside className="resume-sidebar">
          {/* Dynamic Avatar */}


          {/* Contact */}
          <div className="resume-sidebar-section">
            <h3 className="resume-sidebar-heading">Contact</h3>
            <div className="resume-contact-list">
              <div className="resume-contact-item">
                <Mail size={14} />
                <span>{data.contact.email}</span>
              </div>
              <div className="resume-contact-item">
                <Phone size={14} />
                <span>{data.contact.phone}</span>
              </div>
              <div className="resume-contact-item">
                <MapPin size={14} />
                <span>{data.contact.location}</span>
              </div>
              <div className="resume-contact-item">
                <Github size={14} />
                <span>{data.contact.github}</span>
              </div>
              <div className="resume-contact-item">
                <Linkedin size={14} />
                <span>{data.contact.linkedin}</span>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="resume-sidebar-section">
            <h3 className="resume-sidebar-heading">Skills</h3>
            <div className="resume-skills-group">
              <p className="resume-skills-label">Frontend</p>
              {data.skills.frontend.map(s => (
                <div key={s} className="resume-skill-tag">{s}</div>
              ))}
            </div>
            <div className="resume-skills-group">
              <p className="resume-skills-label">Backend</p>
              {data.skills.backend.map(s => (
                <div key={s} className="resume-skill-tag">{s}</div>
              ))}
            </div>
            <div className="resume-skills-group">
              <p className="resume-skills-label">Tools</p>
              {data.skills.tools.map(s => (
                <div key={s} className="resume-skill-tag">{s}</div>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT */}
        <main className="resume-main">
          {/* Header */}
          <header className="resume-main-header">
            <div>
              <h1 className="resume-main-name">{data.name}</h1>
              <p className="resume-main-title">{data.title}</p>
            </div>
          </header>

          <div className="resume-divider" />

          {/* Summary */}
          <section className="resume-section">
            <div className="resume-section-head">
              <User size={18} />
              <h2>Professional Summary</h2>
            </div>
            <p className="resume-summary">{data.summary}</p>
          </section>

          {/* Experience */}
          <section className="resume-section">
            <div className="resume-section-head">
              <Briefcase size={18} />
              <h2>Work Experience</h2>
            </div>
            {data.experience.map((exp, i) => (
              <div key={i} className="resume-entry">
                <div className="resume-entry-header">
                  <div>
                    <h3 className="resume-entry-title">{exp.role}</h3>
                    <p className="resume-entry-org">{exp.org}</p>
                  </div>
                  <span className="resume-entry-time">{exp.time}</span>
                </div>
                <ul className="resume-entry-list">
                  {(exp.points || []).map((p, j) => (
                    <li key={j}>
                      <ChevronRight size={13} className="resume-entry-icon" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Education */}
          <section className="resume-section">
            <div className="resume-section-head">
              <GraduationCap size={18} />
              <h2>Education</h2>
            </div>
            {data.education.map((edu, i) => (
              <div key={i} className="resume-entry">
                <div className="resume-entry-header">
                  <div>
                    <h3 className="resume-entry-title">{edu.degree}</h3>
                    <p className="resume-entry-org">{edu.school}</p>
                  </div>
                  <span className="resume-entry-time">{edu.time}</span>
                </div>
              </div>
            ))}
          </section>

          {/* Projects */}
          <section className="resume-section">
            <div className="resume-section-head">
              <Code size={18} />
              <h2>Projects</h2>
            </div>
            {data.projects.map((proj, i) => (
              <div key={i} className="resume-entry">
                <div className="resume-entry-header">
                  <div>
                    <h3 className="resume-entry-title">{proj.name}</h3>
                    <p className="resume-entry-org" style={{ fontFamily: 'monospace', fontSize: '0.78rem', letterSpacing: 0 }}>{proj.tech}</p>
                  </div>
                  <a href={proj.link} target="_blank" rel="noopener noreferrer" className="resume-proj-link no-print">
                    <Github size={14} /> View
                  </a>
                </div>
                <p className="resume-summary">{proj.desc}</p>
              </div>
            ))}
          </section>
          {/* Referees */}
          {data.referees && data.referees.length > 0 && (
            <section className="resume-section">
              <div className="resume-section-head">
                <div style={{ color: '#6366f1' }}>⭐</div>
                <h2>References</h2>
              </div>
              {data.referees.map((ref, i) => (
                <div key={i} className="resume-entry" style={{ borderLeft: '2px solid #f1f5f9', paddingLeft: '0.75rem' }}>
                  <h3 className="resume-entry-title" style={{ fontSize: '0.9rem' }}>{ref.name}</h3>
                  <p className="resume-entry-org" style={{ fontSize: '0.7rem', color: '#64748b' }}>{ref.role}</p>
                  <p style={{ fontSize: '0.68rem', color: '#475569', marginTop: '0.1rem' }}>{ref.org}</p>
                  <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '0.1rem' }}>{ref.contact}</p>
                </div>
              ))}
            </section>
          )}
        </main>
      </motion.div>
    </div>
  );
};

export default Resume;
