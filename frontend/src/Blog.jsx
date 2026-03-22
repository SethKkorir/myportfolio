import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, BookOpen, Coffee, ExternalLink, Sparkles, ChevronRight } from 'lucide-react';

const posts = [
  {
    title: 'The Sauna Life',
    excerpt: 'Exploring the profound health benefits and cultural significance of sauna practices around the globe.',
    date: 'Oct 24, 2024',
    readTime: '8 min read',
    category: 'Lifestyle',
    href: 'https://medium.com/@kipzseth/the-sauna-life-0c400f8bb4b4',
    image: 'https://images.unsplash.com/photo-1544161515-4af6b1d46409?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Cultural Evolution in Kenya',
    excerpt: 'An insightful comparative study of diverse cultural traditions across Kenyan communities and their modern evolution.',
    date: 'Sep 15, 2024',
    readTime: '12 min read',
    category: 'Culture',
    href: 'https://medium.com/@kipzseth/comparison-between-different-cultures-in-kenya-d88a13e6e42a',
    image: 'https://images.unsplash.com/photo-1523805081326-ff966a9df95d?auto=format&fit=crop&q=80&w=800',
  },
];

const Blog = () => (
  <section id="blog" className="py-24">
    <div className="container">
      <motion.div
        className="section-head mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="text-accent uppercase tracking-widest font-black text-xs mb-4 inline-block px-4 py-1.5 bg-accent/10 rounded-full border border-accent/20">
          Intellectual Pursuits
        </span>
        <h2 className="text-5xl md:text-7xl font-black font-heading tracking-tight mb-6">
          Thoughts & <span className="gradient-text">Ink</span>
        </h2>
        <p className="max-w-2xl text-text-secondary leading-relaxed font-bold">
          Exploring the intersection of technology, culture, and high-performance living through long-form publications.
        </p>
      </motion.div>

      <div className="blog-grid grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post, i) => (
          <motion.a
            key={i}
            href={post.href}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-card glass rounded-[2.5rem] border border-white/5 overflow-hidden group hover:border-accent/40 transition-all duration-500"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
          >
            <div className="blog-img-wrap h-64 relative overflow-hidden bg-bg-secondary">
              <img 
                src={post.image} 
                alt={post.title} 
                className="blog-img w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-bg-main/60 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-accent border border-accent/20 tracking-widest">
                  {post.category}
                </span>
              </div>
              <div className="absolute inset-0 bg-bg-main/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center text-white shadow-glow scale-0 group-hover:scale-110 transition-transform duration-500">
                    <ExternalLink size={24} />
                 </div>
              </div>
            </div>
            <div className="blog-body p-8 flex flex-col gap-4">
              <div className="flex justify-between items-center text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                <span className="flex items-center gap-2"><Calendar size={12} className="text-accent" /> {post.date}</span>
                <span className="flex items-center gap-2"><Clock size={12} className="text-accent" /> {post.readTime}</span>
              </div>
              <h3 className="blog-title text-3xl font-black font-heading text-text-primary group-hover:text-accent transition-colors leading-tight tracking-tight">
                {post.title}
              </h3>
              <p className="blog-excerpt text-text-secondary leading-relaxed font-bold opacity-80 mb-4 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-2 text-accent text-xs font-black uppercase tracking-widest mt-auto border-t border-white/5 pt-6">
                Read Publication <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      <div className="blog-cta mt-16 text-center">
        <a href="https://medium.com/@kipzseth" target="_blank" rel="noopener noreferrer" className="btn-modern btn-outline inline-flex items-center gap-4 py-5 px-10 font-black uppercase tracking-[0.2em] text-xs">
          <BookOpen size={18} /> Deep Dive on Medium
        </a>
      </div>
    </div>
  </section>
);

export default Blog;
