import React from 'react';
import { motion } from 'framer-motion';

const Blog = () => {
    return (
        <section id="blog" className="blog">
            <div className="container">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    Blog
                </motion.h2>
                <div className="blog-grid">
                    <motion.div
                        className="blog-card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        whileHover={{ y: -10 }}
                    >
                        <h3>The Sauna Life</h3>
                        <p>Exploring the benefits and cultural significance of sauna practices from around the world.</p>
                        <a href="https://medium.com/@kipzseth/the-sauna-life-0c400f8bb4b4" target="_blank" rel="noopener noreferrer" className="btn">
                            <i className="fab fa-medium"></i> Read on Medium
                        </a>
                    </motion.div>
                    <motion.div
                        className="blog-card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        whileHover={{ y: -10 }}
                    >
                        <h3>Cultural Comparisons in Kenya</h3>
                        <p>An insightful look at the diverse cultural traditions across different communities in Kenya.</p>
                        <a href="https://medium.com/@kipzseth/comparison-between-different-cultures-in-kenya-d88a13e6e42a" target="_blank" rel="noopener noreferrer" className="btn">
                            <i className="fab fa-medium"></i> Read on Medium
                        </a>
                    </motion.div>
                </div>
                <motion.div
                    className="blog-cta"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <a href="https://medium.com/@kipzseth" target="_blank" rel="noopener noreferrer" className="btn secondary">
                        <i className="fab fa-medium"></i> View All Articles
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Blog;
