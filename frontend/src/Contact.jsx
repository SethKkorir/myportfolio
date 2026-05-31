import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Github, Linkedin, Twitter, Instagram } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [msg, setMsg] = useState('');
  const [contactData, setContactData] = useState({
    items: [
      { Icon: Mail, label: 'Email', value: 'hello@example.com' },
      { Icon: Phone, label: 'Phone', value: '+00 000 000 0000' },
      { Icon: MapPin, label: 'Location', value: 'Your Location' },
    ],
    socials: [
      { Icon: Github, href: 'https://github.com/SethKkorir' },
      { Icon: Linkedin, href: 'https://www.linkedin.com/in/seth-korir-7b9416279/' },
      { Icon: Twitter, href: 'https://x.com/Kipchumba_sk' }
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
            { Icon: Mail, label: 'Email', value: source.contact.email || 'hello@example.com' },
            { Icon: Phone, label: 'Phone', value: source.contact.phone || '+00 000 000 0000' },
            { Icon: MapPin, label: 'Location', value: source.contact.location || 'Your Location' },
          ];
          
          const getSocialIcon = (platform) => {
            const p = platform.toLowerCase();
            if (p.includes('github')) return Github;
            if (p.includes('linkedin')) return Linkedin;
            if (p.includes('twitter')) return Twitter;
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
    
    // Concatenate subject into the message body for the backend API
    const finalMessage = form.subject 
      ? `[Subject: ${form.subject}]\n\n${form.message}`
      : form.message;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: finalMessage
        }),
      });
      if (res.ok) {
        setStatus('success');
        setMsg(`Message sent successfully!`);
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error();
      }
    } catch {
      setStatus('error');
      setMsg('Something went wrong. Please try again.');
    }
    setTimeout(() => {
      setStatus('idle');
      setMsg('');
    }, 5000);
  };

  return (
    <section id="contact" style={{ padding: '100px 0' }}>
      <div className="container">
        
        {/* Section Head */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', fontWeight: 900, margin: 0, color: 'white' }}>
            Get In Touch
          </h2>
          <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-muted)' }}>
            Have a project in mind or want to work together? Feel free to reach out.
          </p>
        </div>

        <div className="contact-wrap" style={{ alignItems: 'start', gap: '4rem' }}>
          
          {/* Form Column */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="contact-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <input
                  type="text" 
                  required 
                  placeholder="Your Name"
                  value={form.name} 
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="form-input contact-input-premium"
                />
              </div>
              
              <div className="form-group">
                <input
                  type="email" 
                  required 
                  placeholder="Email Address"
                  value={form.email} 
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="form-input contact-input-premium"
                />
              </div>

              <div className="form-group">
                <input
                  type="text" 
                  placeholder="Subject"
                  value={form.subject} 
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="form-input contact-input-premium"
                />
              </div>

              <div className="form-group">
                <textarea
                  required 
                  placeholder="Your Message"
                  value={form.message} 
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="form-textarea contact-input-premium"
                  style={{ minHeight: '180px' }}
                />
              </div>

              {msg && (
                <div className={`form-msg ${status}`}>{msg}</div>
              )}

              <button
                type="submit"
                className="btn-primary btn-gradient"
                style={{ width: '100%', justifyContent: 'center', padding: '1rem', borderRadius: '50px', fontWeight: 700 }}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'} <Send size={18} style={{ marginLeft: '0.4rem' }} />
              </button>
            </form>
          </motion.div>

          {/* Info Details Column */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', height: '100%', justifyContent: 'flex-start' }}
          >
            {contactData.items.map(({ Icon, label, value }, i) => (
              <div key={i} className="contact-item" style={{ background: 'rgba(9, 9, 20, 0.55)', padding: '1.25rem 1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div className="contact-icon" style={{ background: 'rgba(99, 102, 241, 0.08)', borderRadius: '0.75rem', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justify: 'center', color: 'var(--accent)' }}>
                  <Icon size={20} />
                </div>
                <div>
                  <div className="contact-label" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                  <div className="contact-val" style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white', marginTop: '0.25rem' }}>{value}</div>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1.5rem' }}>
              {contactData.socials.map(({ Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)', transition: 'var(--transition)' }} className="hover:text-white hover:border-white">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
