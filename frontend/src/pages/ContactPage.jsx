import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Youtube, Instagram, Send } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'sending' | 'sent' | 'error'

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    // Mailto fallback — works without backend email configuration
    const mailto = `mailto:hello@conceptsin5.com?subject=${encodeURIComponent(form.subject || 'Contact from ConceptsIn5')}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    window.location.href = mailto;
    // Give user feedback
    setTimeout(() => setStatus('sent'), 500);
  };

  return (
    <div className="min-h-screen pt-32 pb-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div {...fadeInUp} className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 glass-card border-accent-blue/30 text-accent-blue text-[10px] font-black uppercase tracking-[0.2em]">
            <Mail size={12} /> Get in Touch
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Contact Us
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have feedback, a question, or want to collaborate? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div {...fadeInUp}>
            <GlassCard className="p-10 border-white/5">
              <h2 className="text-2xl font-black mb-8 uppercase tracking-tight">Send a Message</h2>
              {status === 'sent' ? (
                <div className="text-center py-12">
                  <Send size={48} className="text-accent-blue mx-auto mb-4" />
                  <p className="text-xl font-black text-white mb-2">Message Opened</p>
                  <p className="text-gray-400">Your email client should have opened with your message. Send it from there to reach us.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:border-accent-blue/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:border-accent-blue/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:border-accent-blue/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us what's on your mind..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:border-accent-blue/50 focus:outline-none focus:ring-1 focus:ring-accent-blue/30 transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full py-4 bg-gradient-to-r from-accent-blue to-accent-purple rounded-2xl font-black text-white flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(0,240,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Send size={18} /> {status === 'sending' ? 'Opening...' : 'Send Message'}
                  </button>
                </form>
              )}
            </GlassCard>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8"
          >
            <GlassCard className="p-10 border-white/5">
              <h2 className="text-2xl font-black mb-8 uppercase tracking-tight">Direct Contact</h2>
              <div className="space-y-6">
                <a
                  href="mailto:hello@conceptsin5.com"
                  className="flex items-center gap-4 text-gray-400 hover:text-accent-blue transition-colors group"
                >
                  <div className="p-3 glass-card border-white/10 rounded-xl group-hover:border-accent-blue/30 transition-colors">
                    <Mail size={20} className="text-accent-blue" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Email</div>
                    <div className="font-bold text-white">hello@conceptsin5.com</div>
                  </div>
                </a>
              </div>
            </GlassCard>

            <GlassCard className="p-10 border-white/5">
              <h2 className="text-2xl font-black mb-8 uppercase tracking-tight">Follow Us</h2>
              <div className="space-y-5">
                {[
                  { icon: <Youtube size={20} className="text-red-500" />, label: 'YouTube', handle: '@conceptsin5', link: 'https://youtube.com/@conceptsin5' },
                  { icon: <Instagram size={20} className="text-pink-500" />, label: 'Instagram', handle: '@conceptsin5', link: 'https://instagram.com/conceptsin5' },
                  { icon: <Linkedin size={20} className="text-blue-400" />, label: 'LinkedIn', handle: 'Om Rajpure', link: 'https://linkedin.com/in/om-rajpure' },
                  { icon: <Github size={20} className="text-white" />, label: 'GitHub', handle: 'Om-Rajpure', link: 'https://github.com/Om-Rajpure' },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors group"
                  >
                    <div className="p-3 glass-card border-white/10 rounded-xl group-hover:border-white/20 transition-colors">
                      {social.icon}
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">{social.label}</div>
                      <div className="font-bold text-gray-300">{social.handle}</div>
                    </div>
                  </a>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-8 border-accent-blue/20 bg-accent-blue/[0.02]">
              <p className="text-gray-400 text-sm leading-relaxed">
                <span className="font-black text-white">Response time:</span> We typically respond within 24–48 hours. For urgent technical issues, please include details about the issue and your browser/device.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
