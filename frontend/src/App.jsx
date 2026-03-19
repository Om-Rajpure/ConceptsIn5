import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Cpu, 
  Database, 
  Zap, 
  ArrowRight, 
  Linkedin, 
  Youtube, 
  Instagram,
  CheckCircle2,
  Code,
  Sparkles,
  MousePointer2
} from 'lucide-react';
import GlassCard from './components/GlassCard';
import Navbar from './components/Navbar';
import Layout from './components/Layout';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" }
};

const subjects = [
  { 
    title: "DBMS", 
    desc: "Master SQL, Normalization, and indexing in minutes.",
    icon: <Database className="w-8 h-8 text-accent-cyan" />,
    color: "blue"
  },
  { 
    title: "Operating Systems", 
    desc: "CPU scheduling, memory management made simple.",
    icon: <Cpu className="w-8 h-8 text-accent-blue" />,
    color: "blue"
  },
  { 
    title: "AI / ML", 
    desc: "Neural networks and algorithms explained like you're five.",
    icon: <Zap className="w-8 h-8 text-accent-purple" />,
    color: "purple"
  },
  { 
    title: "Coding Basics", 
    desc: "Logic building and syntax shortcuts for fast learning.",
    icon: <Code className="w-8 h-8 text-accent-electric" />,
    color: "blue"
  }
];

export default function App() {
  return (
    <Layout>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        {/* Hero Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/10 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/10 blur-[120px] animate-pulse-glow" />
        
        {/* Floating Icons for Background Atmosphere */}
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/3 right-[15%] text-accent-purple/40 hidden lg:block"
        >
          <Sparkles size={100} />
        </motion.div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 glass-card border-accent-blue/30 text-accent-blue text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(0,240,255,0.1)]"
          >
            <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
            Next-Gen AI Learning System
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight"
          >
            Master <span className="text-gradient drop-shadow-[0_0_25px_rgba(123,97,255,0.4)]">Complex</span> <br />
            Topics in 5 Mins
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed"
          >
            The ultimate HUD for your education. Simplified videos, <br className="hidden md:block" />
            notes, and AI-powered insights for every student.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 240, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="group px-10 py-5 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-blue bg-[length:200%_auto] hover:bg-right transition-all duration-500 rounded-2xl font-black text-white text-lg flex items-center gap-3 shadow-[0_10px_40px_rgba(123,97,255,0.3)]"
            >
              Start Learning Now <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button 
              whileHover={{ backgroundColor: "rgba(255,255,255,0.1)", scale: 1.02 }}
              className="px-10 py-5 border border-white/10 glass-card rounded-2xl font-bold text-gray-300 hover:text-white transition-all flex items-center gap-2"
            >
               View Syllabus <MousePointer2 className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/5 blur-[80px]" />
        
        <motion.div {...fadeInUp} className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 glow-text">Mission Briefing</h2>
          <p className="text-gray-400 text-lg">Download knowledge into your brain in three rapid steps.</p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { step: "MISSION 01", title: "Select Target", desc: "Browse through structured courses designed for deep focus.", icon: <BookOpen className="text-accent-blue" />, color: "blue" },
            { step: "MISSION 02", title: "Ingest Data", desc: "Absorb core concepts in 5-minute high-octane videos.", icon: <Zap className="text-accent-purple" />, color: "purple" },
            { step: "MISSION 03", title: "Secure Grades", desc: "Access lethal cheat sheets and exam-winning notes.", icon: <CheckCircle2 className="text-accent-cyan" />, color: "blue" },
          ].map((item, i) => (
            <GlassCard key={i} glow neonColor={item.color} className="p-8 group">
              <div className="text-xs font-black text-accent-purple/60 mb-6 tracking-widest">{item.step}</div>
              <div className="p-4 bg-white/5 rounded-2xl inline-block mb-6 border border-white/5 group-hover:border-accent-purple/30 group-hover:shadow-[0_0_15px_rgba(123,97,255,0.2)] transition-all">
                {item.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 group-hover:text-white transition-colors">{item.title}</h3>
              <p className="text-gray-400 text-base leading-relaxed">{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Subjects Section */}
      <section id="subjects" className="py-32 px-6 relative overflow-hidden bg-white/[0.01]">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 glow-text">Core Database</h2>
            <p className="text-gray-400 text-lg font-light">The most requested engineering subjects, precision engineered.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {subjects.map((sub, i) => (
              <GlassCard key={i} glow neonColor={sub.color} className="p-10 border-white/5 hover:border-accent-blue/30 group cursor-pointer h-full flex flex-col justify-center">
                <div className="mb-8 w-14 h-14 flex items-center justify-center rounded-2xl bg-white/[0.03] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-[0_0_20px_rgba(0,240,255,0.05)] border border-white/5 group-hover:border-accent-blue/20">
                  {sub.icon}
                </div>
                <h3 className="text-2xl font-black mb-3 text-white group-hover:text-accent-blue transition-colors">{sub.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{sub.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-accent-blue opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 group-hover:duration-300 font-bold text-xs uppercase tracking-widest">
                  Initialize <ArrowRight size={14} />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section id="about" className="py-32 px-6 max-w-6xl mx-auto relative">
         {/* Background Decor */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent-blue/10 blur-[100px] -z-10" />
        
        <GlassCard className="flex flex-col lg:flex-row items-center gap-16 p-12 lg:p-20 border-accent-purple/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Animated Glow Rings */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-accent-blue via-accent-purple to-accent-cyan rounded-full blur-2xl opacity-20 group-hover:opacity-50 animate-pulse-glow" />
            <div className="absolute -inset-1 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full animate-float opacity-30" />
            
            <img 
              src="/owner.jpeg" 
              alt="Founder" 
              className="relative w-56 h-56 lg:w-80 lg:h-80 rounded-full object-cover border-4 border-accent-purple/30 shadow-[0_0_50px_rgba(123,97,255,0.2)]"
            />
            
            {/* Status Indicator */}
            <div className="absolute bottom-6 right-6 px-4 py-1.5 bg-dark border border-accent-blue/50 rounded-full flex items-center gap-2 shadow-xl">
              <div className="w-2 h-2 rounded-full bg-accent-blue animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-widest text-accent-blue">Online</span>
            </div>
          </motion.div>

          <div className="flex-1 text-center lg:text-left">
            <motion.div {...fadeInUp} className="inline-block px-3 py-1 mb-6 border border-accent-cyan/30 text-accent-cyan text-[10px] font-black uppercase tracking-widest rounded">
              Command Center
            </motion.div>
            <motion.h2 {...fadeInUp} className="text-4xl md:text-5xl font-black mb-8 glow-text leading-tight">
              Designed by a Student <br />to Solve Your Pain
            </motion.h2>
            <motion.p {...fadeInUp} className="text-gray-400 text-lg leading-relaxed mb-10 font-light">
              I built ConceptsIn5 because I was tired of 40-minute videos that could be explained in five. 
              Our mission is to give you the most optimized learning path, saving you hundreds of hours in 
              the process. High efficiency, zero fluff.
            </motion.p>
            <div className="flex gap-8 justify-center lg:justify-start">
              {[
                { icon: <Youtube />, href: "#" },
                { icon: <Instagram />, href: "#" },
                { icon: <Linkedin />, href: "#" }
              ].map((social, i) => (
                <motion.a 
                  key={i} 
                  href={social.href} 
                  whileHover={{ y: -5, color: '#00F0FF', textShadow: "0 0 10px #00F0FF" }}
                  className="text-gray-500 transition-all duration-300"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6 relative min-h-[600px] flex items-center justify-center">
        {/* Deep Field Perspective Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)]" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl w-full glass-card p-16 lg:p-24 text-center border-accent-blue/30 relative overflow-hidden group shadow-[0_20px_100px_rgba(123,97,255,0.2)]"
        >
          {/* Animated Background Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-blue/20 blur-[120px] -z-10 group-hover:scale-150 transition-transform duration-1000" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-purple/20 blur-[120px] -z-10 group-hover:scale-150 transition-transform duration-1000" />
          
          <h2 className="text-5xl md:text-8xl font-black mb-12 leading-tight tracking-tighter">
            Level Up Your <br />
            <span className="text-gradient">Intelligence</span>
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center relative z-10">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(123, 97, 255, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-6 bg-white text-dark rounded-2xl font-black text-xl shadow-2xl transition-all"
            >
              Get Instant Access
            </motion.button>
            <p className="text-gray-500 font-medium text-lg italic">
              Join 5,000+ students already winning.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 relative z-10 bg-dark/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="text-3xl font-black tracking-tighter text-gradient mb-6">
              ConceptsIn5
            </div>
            <p className="text-gray-500 text-lg max-w-sm leading-relaxed">
              We provide high-octane engineering knowledge in 5-minute packets. 
              Designed for the modern student who values time.
            </p>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest mb-8 text-white">Navigation</h4>
            <div className="flex flex-col gap-4 text-gray-500 text-base">
              <a href="#" className="hover:text-accent-blue transition-colors">Subjects</a>
              <a href="#" className="hover:text-accent-blue transition-colors">AI Tools</a>
              <a href="#" className="hover:text-accent-blue transition-colors">Study Guides</a>
            </div>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest mb-8 text-white">System</h4>
            <div className="flex flex-col gap-4 text-gray-500 text-base">
              <a href="#" className="hover:text-accent-purple transition-colors">Status</a>
              <a href="#" className="hover:text-accent-purple transition-colors">Support</a>
              <a href="#" className="hover:text-accent-purple transition-colors">Contact</a>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-gray-600 font-medium uppercase tracking-[0.2em]">
            © 2026 ConceptsIn5. Initializing Success.
          </div>
          <div className="flex gap-10 text-gray-500">
            <Youtube className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
            <Instagram className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
            <Linkedin className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
      </footer>
    </Layout>
  );
}
