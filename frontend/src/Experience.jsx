import React from 'react';
import { motion } from 'framer-motion';

const Experience = () => {
    return (
        <section id="experience" className="experience">
            <div className="container">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    Experience & Education
                </motion.h2>
                <div className="timeline">
                    {[
                        {
                            title: "Attachment Trainee", place: "Techsavanna Company Limited", desc: [
                                "Gained hands-on experience in developing REST APIs and integrating them into web applications",
                                "Collaborated with a team of developers to design, develop, and test backend systems",
                                "Enhanced skills in team collaboration, version control (Git), and API documentation using tools like Postman",
                                "Contributed to the development of scalable and efficient backend solutions"
                            ]
                        },
                        { title: "Bachelor of Applied Computer Science", place: "Daystar University", time: "2025 – Present" },
                        { title: "Diploma in ICT", place: "Daystar University", time: "2023 – 2024" },
                        { title: "Certificate in ICT", place: "Daystar University", time: "May-2022 – Nov-2022" }
                    ].map((item, index) => (
                        <motion.div
                            className="timeline-item"
                            key={index}
                            initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <div className="content">
                                <h3>
                                    <i className={`fas ${item.title.includes("Bachelor") || item.title.includes("Diploma") || item.title.includes("Certificate") ? "fa-graduation-cap" : "fa-briefcase"}`} style={{ marginRight: '10px', color: 'var(--primary-color)' }}></i>
                                    {item.title}
                                </h3>
                                <p className="place">{item.place}</p>
                                {item.time && <p className="time">{item.time}</p>}
                                {item.desc && (
                                    <ul>
                                        {item.desc.map((li, i) => (
                                            <li key={i}>{li}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
