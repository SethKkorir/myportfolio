import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ type: 'success', message: 'Message sent successfully!' });
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus({ type: 'error', message: data.message || 'Failed to send message.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'An error occurred. Please try again.' });
        }
    };

    return (
        <section id="contact" className="contact">
            <div className="container">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    Contact Me
                </motion.h2>
                <div className="contact-content">
                    <motion.div
                        className="contact-info"
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="info-item">
                            <i className="fas fa-phone"></i>
                            <p>+254748497623</p>
                        </div>
                        <div className="info-item">
                            <i className="fas fa-envelope"></i>
                            <p>zsethkipchumba179@gmail.com</p>
                        </div>
                        <div className="info-item">
                            <i className="fas fa-map-marker-alt"></i>
                            <p>Bomet, Kenya, 20400</p>
                        </div>
                        <div className="social-links">
                            <a href="https://www.linkedin.com/in/seth-korir-7b9416279/" target="_blank" rel="noopener noreferrer" className="social-icon">
                                <i className="fab fa-linkedin"></i>
                            </a>
                            <a href="https://github.com/SethKkorir" target="_blank" rel="noopener noreferrer" className="social-icon">
                                <i className="fab fa-github"></i>
                            </a>
                            <a href="https://x.com/Kipchumba_sk" target="_blank" rel="noopener noreferrer" className="social-icon">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="https://www.instagram.com/zs_kip/" target="_blank" rel="noopener noreferrer" className="social-icon">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="https://medium.com/@kipzseth" target="_blank" rel="noopener noreferrer" className="social-icon">
                                <i className="fab fa-medium"></i>
                            </a>
                        </div>
                    </motion.div>
                    <motion.form
                        id="contactForm"
                        className="contact-form"
                        onSubmit={handleSubmit}
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Your Name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Your Email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <textarea
                            id="message"
                            name="message"
                            placeholder="Your Message"
                            required
                            value={formData.message}
                            onChange={handleChange}
                        ></textarea>
                        <button type="submit" className="btn primary">Send Message</button>
                        {status.message && (
                            <div className={`form-message ${status.type}`}>
                                {status.message}
                            </div>
                        )}
                    </motion.form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
