import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle2, Github, Linkedin, Twitter, Instagram } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [msg, setMsg] = useState('');
  const [contactData, setContactData] = useState({
    items: [
      { Icon: Phone, label: 'Call Me', value: '+254 748 497 623' },
      { Icon: Mail, label: 'Email Me', value: 'zsethkipchumba179@gmail.com' },
      { Icon: MapPin, label: 'Location', value: 'Bomet, Kenya 20400' },
    ],
    socials: [
      { Icon: Github, href: 'https://github.com/SethKkorir' },
      { Icon: Linkedin, href: 'https://www.linkedin.com/in/seth-korir-7b9416279/' },
      { Icon: Twitter, href: 'https://x.com/Kipchumba_sk' },
      { Icon: Instagram, href: 'https://www.instagram.com/zs_kip/' },
    ]
  });

  React.useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/admin/portfolio-content');
        const data = res.ok ? await res.json() : null;
        
        const source = data?.contact ? data : JSON.parse(localStorage.getItem('portfolioContent') || '{}');
        
        if (source.contact) {
          const newItems = [
            { Icon: Phone, label: 'Call Me', value: source.contact.phone },
            { Icon: Mail, label: 'Email Me', value: source.contact.email },
            { Icon: MapPin, label: 'Location', value: source.contact.location },
          ];
          
          const getSocialIcon = (platform) => {
            const p = platform.toLowerCase();
            if (p.includes('github')) return Github;
            if (p.includes('linkedin')) return Linkedin;
            if (p.includes('twitter')) return Twitter;
            if (p.includes('instagram')) return Instagram;
            return Mail;
          };

          const newSocials = source.socials?.map(s => ({
            Icon: getSocialIcon(s.platform),
            href: s.href
          })) || contactData.socials;

          setContactData({ items: newItems, socials: newSocials });
        }
      } catch(e) {}
    };
    fetchContent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setMsg(`Message sent! I'll get back to you soon, ${form.name}.`);
        setForm({ name: '', email: '', message: '' });
      } else {
        throw new Error();
      }
    } catch {
      setStatus('error');
      setMsg('Something went wrong. Please try again or email directly.');
    }
    setTimeout(() => setStatus('idle'), 6000);
  };

  return (
    <section id="contact">
      <div className="container">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="gradient-text">Let's Talk Coffee & Code</h2>
          <p>Open to freelance projects and junior developer opportunities. Let's build something remarkable.</p>
        </motion.div>

        <div className="contact-wrap">
          {/* Info */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {contactData.items.map(({ Icon, label, value }, i) => (
              <div key={i} className="contact-item">
                <div className="contact-icon"><Icon size={20} /></div>
                <div>
                  <div className="contact-label">{label}</div>
                  <div className="contact-val">{value}</div>
                </div>
              </div>
            ))}

            <div className="socials-row">
              {contactData.socials.map(({ Icon, href }, i) => (
                <a key={i} href={href} target="_blank" className="social-btn">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass" style={{ padding: '2.5rem' }}>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text" required placeholder="John Doe"
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email" required placeholder="john@example.com"
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Your Message</label>
                  <textarea
                    required placeholder="Tell me about your project..."
                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    className="form-textarea"
                  />
                </div>

                {msg && (
                  <div className={`form-msg ${status}`}>{msg}</div>
                )}

                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); alert("Coming Soon!"); }}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
                >
                  <Send size={18} /> Send Message
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
