import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <section id="about" className="about">
            <div className="container">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    About Me
                </motion.h2>
                <div className="about-content">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        A highly motivated and detail-oriented student pursuing a Bachelor's degree in Applied Computer Science at Daystar University. Skilled in web development with a strong foundation in the MERN stack (MongoDB, Express, Node.js), APIs, and version control using Git. Passionate about creating accessible and user-friendly technologies, I am eager to contribute to innovative projects, collaborate with diverse teams, and further develop my technical expertise.
                    </motion.p>
                    <div className="about-cards">
                        {[
                            { icon: "fa-code", title: "Frontend Lab", desc: "Building responsive, interactive UIs with React & Framer Motion.", sub: "" },
                            { icon: "fa-server", title: "Backend Systems", desc: "Architecting robust REST APIs using Node.js & Express.", sub: "" },
                            { icon: "fa-database", title: "Database Architecture", desc: "Designing scalable data schemas with MongoDB.", sub: "" }
                        ].map((card, index) => (
                            <motion.div
                                className="card"
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                                whileHover={{ y: -10 }}
                            >
                                <i className={`fas ${card.icon}`}></i>
                                <h3>{card.title}</h3>
                                <p>{card.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
