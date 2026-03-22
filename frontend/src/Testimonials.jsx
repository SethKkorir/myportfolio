import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const Testimonials = () => {
    const [testimonials, setTestimonials] = React.useState([]);

    React.useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await fetch('/api/admin/portfolio-content');
                if (res.ok) {
                    const data = await res.json();
                    if (data.testimonials) {
                        setTestimonials(data.testimonials);
                        return;
                    }
                }
            } catch (err) {}

            // Fallback
            const localContent = localStorage.getItem('portfolioContent');
            if (localContent) {
                try {
                    const parsed = JSON.parse(localContent);
                    if (parsed.testimonials) setTestimonials(parsed.testimonials);
                } catch(e) {}
            }
        };
        fetchTestimonials();
    }, []);

    if (testimonials.length === 0) return null;

    return (
        <section id="testimonials" className="py-24 bg-bg-secondary/30 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
            
            <div className="container mx-auto px-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter uppercase italic mb-4">
                        Client <span className="gradient-text">References</span>
                    </h2>
                    <p className="text-text-secondary max-w-2xl mx-auto font-medium">
                        Kind words from professionals and colleagues I've had the pleasure of working with.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass p-10 rounded-[2.5rem] border border-white/5 relative group hover:border-accent/30 transition-all duration-500"
                        >
                            <Quote className="text-accent/20 absolute top-8 right-8 group-hover:text-accent/40 transition-colors" size={40} />
                            
                            <div className="space-y-6 relative z-10">
                                <p className="text-text-primary text-lg leading-relaxed italic font-medium">
                                    "{t.text}"
                                </p>
                                
                                <div className="pt-6 border-t border-white/5 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center text-white font-black text-xl shadow-glow">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-text-primary font-black uppercase tracking-tight text-sm">{t.name}</h4>
                                        <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
