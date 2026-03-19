import { motion } from 'framer-motion';
import { 
  Users, 
  Zap, 
  Target, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  ArrowRight,
  Monitor,
  Video,
  BookOpen,
  MousePointer2,
  TrendingUp,
  Award,
  Clock,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';

export default function AboutPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-32 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 md:pt-48 pb-16 md:pb-32 px-6 flex items-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-accent-blue/10 blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-accent-purple/10 blur-[150px] animate-pulse-glow" />
        <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-5" />

        <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-12 md:gap-20 items-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 border border-accent-blue/30 text-accent-blue text-[10px] font-black uppercase tracking-widest rounded bg-accent-blue/5 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" /> System Identity: ConceptsIn5
            </div>
            <h1 className="text-4xl md:text-8xl font-black mb-6 md:mb-8 italic leading-tight tracking-tighter">
              From Confusion <br />
              <span className="text-gradient drop-shadow-[0_0_15px_rgba(123,97,255,0.4)] underline decoration-accent-blue/30">to Clarity.</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-400 font-light leading-relaxed max-w-xl mb-10 md:mb-12">
              ConceptsIn5 is a high-octane educational platform designed to help students master complex engineering topics in 5-minute mission packets.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/notes" className="px-10 py-5 bg-accent-blue rounded-2xl font-black text-white text-lg flex items-center gap-3 shadow-[0_10px_30px_rgba(0,240,255,0.3)] hover:scale-105 active:scale-95 transition-all">
                Explore Repository <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-full order-last lg:order-none"
          >
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,240,255,0.2)] aspect-[4/5] max-w-[280px] md:max-w-md mx-auto group">
              <img 
                src="/owner.jpeg" 
                alt="Creator Profile" 
                className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60" />
              
              {/* HUD Elements overlay on image */}
              <div className="absolute top-4 right-4 md:top-6 md:right-6 flex flex-col gap-2">
                <div className="px-2 md:px-3 py-1 bg-dark/80 backdrop-blur-md rounded border border-white/10 text-[8px] md:text-[9px] font-black text-white uppercase tracking-widest">
                  Status: Online
                </div>
                <div className="px-2 md:px-3 py-1 bg-dark/80 backdrop-blur-md rounded border border-white/10 text-[8px] md:text-[9px] font-black text-accent-blue uppercase tracking-widest">
                  Level 01 Creator
                </div>
              </div>
            </div>
            
            {/* Floating Ornaments */}
            <div className="absolute -top-10 -right-10 w-24 md:w-32 h-24 md:h-32 bg-accent-purple/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-32 md:w-40 h-32 md:h-40 bg-accent-blue/20 rounded-full blur-3xl animate-pulse delay-700" />
          </motion.div>
        </div>
      </section>

      {/* 2. THE PROBLEM SECTION */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16 md:mb-24">
            <h2 className="text-accent-purple font-black text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4">The Challenge</h2>
            <h3 className="text-3xl md:text-6xl font-black italic tracking-tighter uppercase mb-6 md:mb-8">Why This Exists</h3>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto italic">Engineering doesn't have to be a nightmare of 2-hour lectures and cryptic textbooks.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <ProblemCard 
              icon={<Clock className="text-accent-blue" />} 
              title="Time Burnout" 
              desc="Endless hours of lectures that could have been summarized in minutes." 
            />
            <ProblemCard 
              icon={<BookOpen className="text-red-400" />} 
              title="Complexity Overload" 
              desc="Jargon-heavy explanations that make simple concepts feel impossible." 
            />
            <ProblemCard 
              icon={<Zap className="text-yellow-400" />} 
              title="Exam Stress" 
              desc="The panic of revising thousands of pages the night before an exam." 
            />
          </div>
        </div>
      </section>

      {/* 3. THE SOLUTION SECTION */}
      <section className="py-16 md:py-24 px-6 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
           <motion.div {...fadeInUp}>
              <h2 className="text-accent-blue font-black text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4">The Solution</h2>
              <h3 className="text-3xl md:text-6xl font-black italic tracking-tighter uppercase mb-6 md:mb-10">Neural Learning Speed</h3>
              <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-8 md:mb-12">
                We've decoded the way modern students learn. By stripping away the fluff and focusing on the core logic, we deliver knowledge packets that stick.
              </p>
              
              <ul className="space-y-6">
                <li className="flex items-center gap-4 text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="font-bold tracking-wide">5-Minute Targeted Explanations</span>
                </li>
                <li className="flex items-center gap-4 text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-accent-purple/10 border border-accent-purple/30 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-accent-purple" />
                  </div>
                  <span className="font-bold tracking-wide">Structured Notes & Study Guides</span>
                </li>
                <li className="flex items-center gap-4 text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-accent-cyan" />
                  </div>
                  <span className="font-bold tracking-wide">Step-by-Step Learning Roadmaps</span>
                </li>
              </ul>
           </motion.div>

           <div className="relative">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="grid gap-6"
              >
                <GlassCard className="p-8 border-accent-blue/20 bg-accent-blue/[0.02]">
                  <div className="text-4xl font-black text-white mb-2">95%</div>
                  <div className="text-xs font-black uppercase tracking-widest text-accent-blue">Faster Understanding</div>
                </GlassCard>
                <GlassCard className="p-8 border-accent-purple/20 bg-accent-purple/[0.02] ml-12">
                  <div className="text-4xl font-black text-white mb-2">5+ Mins</div>
                  <div className="text-xs font-black uppercase tracking-widest text-accent-purple">Per Mission Packet</div>
                </GlassCard>
              </motion.div>
           </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16 md:mb-24">
            <h3 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase mb-4">The Mission Flow</h3>
            <p className="text-gray-500 text-[10px] md:text-sm font-black uppercase tracking-[0.2em]">Simple steps to mastery</p>
          </motion.div>

          <div className="relative">
            {/* Connecting line (Desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan opacity-20 -translate-y-1/2" />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
              <StepItem number="01" title="Choose Category" icon={<Monitor />} />
              <StepItem number="02" title="Pick Subject" icon={<BookOpen />} />
              <StepItem number="03" title="Review Notes" icon={<Zap />} />
              <StepItem number="04" title="Deploy Knowledge" icon={<Target />} />
            </div>
          </div>
        </div>
      </section>

      {/* 5. ABOUT THE CREATOR */}
      <section className="py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-purple/5 -z-10" />
        <div className="max-w-5xl mx-auto">
          <GlassCard className="p-8 md:p-20 border-accent-purple/20 bg-dark/40 relative overflow-hidden text-center">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <motion.div {...fadeInUp}>
              <div className="w-24 md:w-32 h-24 md:h-32 rounded-full border-4 border-accent-purple p-1 mx-auto mb-8 md:mb-10 overflow-hidden">
                <img src="/owner.jpeg" alt="Creator" className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-500" />
              </div>
              <h2 className="text-accent-purple font-black text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4">Origin Story</h2>
              <h3 className="text-2xl md:text-5xl font-black italic tracking-tighter uppercase mb-6 md:mb-8">Built by a Student, for Students</h3>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-light mb-8 md:mb-12 italic">
                "I faced the same struggles with engineering as you do. Long lectures that didn't help, exams that felt impossible, and resources that were too complex. I built ConceptsIn5 to be the mentor I wish I had—someone who explains things simply, quickly, and effectively."
              </p>
              <div className="text-sm font-black uppercase tracking-[0.2em] text-white">
                Om Rajpure <span className="text-accent-purple mx-2">|</span> Founder, ConceptsIn5
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </section>

      {/* 6. VISION & VALUES */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center mb-16 md:mb-32">
            <motion.div {...fadeInUp} className="text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase mb-6 md:mb-8">The Bigger Vision</h2>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed font-light italic">
                Our vision is to build a global learning movement where understanding is democratized. We believe that every complex concept has a simple core, and we are on a mission to uncover them all.
              </p>
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
              <ValueCard title="Simplicity" desc="Core logic first." />
              <ValueCard title="Speed" desc="Zero fluff metrics." />
              <ValueCard title="Clarity" desc="Visual & vivid." />
              <ValueCard title="Consistency" desc="Trusted systems." />
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="py-12 md:py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <GlassCard className="p-8 md:p-16 border-accent-blue/40 bg-gradient-to-br from-accent-blue/10 via-transparent to-accent-purple/10 animate-pulse-border relative overflow-hidden">
            <motion.div {...fadeInUp} className="relative z-10">
              <h2 className="text-3xl md:text-6xl font-black italic tracking-tighter uppercase mb-6 md:mb-8">Start Learning Smarter Today</h2>
              <p className="text-gray-400 text-base md:text-lg mb-8 md:mb-12 max-w-xl mx-auto italic font-light">
                Why learn in hours when you can master in minutes? Join the repository and deploy your knowledge.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
                <Link to="/" className="px-10 md:px-12 py-4 md:py-5 bg-white text-dark rounded-2xl font-black text-lg md:text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
                  Explore Now
                </Link>
                <Link to="/notes" className="px-10 md:px-12 py-4 md:py-5 border border-white/20 glass-card rounded-2xl font-black text-lg md:text-xl text-white hover:bg-white/5 transition-all">
                  View Notes
                </Link>
              </div>
            </motion.div>
            
            {/* Visual Flair */}
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent-blue/20 blur-[100px] rounded-full" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent-purple/20 blur-[100px] rounded-full" />
          </GlassCard>
        </div>
      </section>
    </div>
  );
}

function ProblemCard({ icon, title, desc }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-8 md:p-10 glass-card border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all h-full"
    >
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 md:mb-8 border border-white/10 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="text-lg md:text-xl font-black italic uppercase tracking-tighter mb-3 md:mb-4">{title}</h4>
      <p className="text-gray-500 text-sm md:text-base font-light leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function StepItem({ number, title, icon }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative z-10 flex flex-col items-center text-center lg:pt-12"
    >
      <div className="w-20 h-20 rounded-full bg-dark border-2 border-white/10 flex items-center justify-center mb-8 relative group cursor-default">
        <div className="absolute inset-0 bg-accent-blue rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
        <div className="text-gray-400 group-hover:text-accent-blue transition-colors">
          {icon}
        </div>
        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-accent-purple flex items-center justify-center text-[10px] font-black italic shadow-lg">
          {number}
        </div>
      </div>
      <h4 className="text-sm font-black uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors">
        {title}
      </h4>
    </motion.div>
  );
}

function ValueCard({ title, desc }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="p-6 md:p-8 glass-card border-white/5 bg-white/[0.01] text-center group cursor-default"
    >
      <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-accent-purple mb-2 group-hover:text-accent-blue transition-colors">{title}</div>
      <div className="text-[9px] md:text-[10px] text-gray-600 font-black uppercase tracking-widest">{desc}</div>
    </motion.div>
  );
}
