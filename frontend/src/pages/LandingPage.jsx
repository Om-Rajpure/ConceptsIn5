import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  Linkedin, 
  Youtube, 
  Instagram,
  CheckCircle2,
  Zap,
  Sparkles,
  MousePointer2,
  Clock,
  Video,
  Layers,
  Award,
  Users,
  ChevronRight,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import ScrollDots from '../components/ScrollDots';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: "easeOut" }
};

export default function LandingPage() {
  const [categories, setCategories] = React.useState([]);
  const [featuredVideos, setFeaturedVideos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [catIndex, setCatIndex] = React.useState(0);
  const [socialIndex, setSocialIndex] = React.useState(0);
  const [videoIndex, setVideoIndex] = React.useState(0);

  const catRef = React.useRef(null);
  const socialRef = React.useRef(null);
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [cResponse, vResponse] = await Promise.all([
          axios.get('/api/public/categories/'),
          axios.get('/api/public/videos/?is_important=true')
        ]);
        setCategories(cResponse.data.results || cResponse.data);
        setFeaturedVideos((vResponse.data.results || vResponse.data).slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch landing page data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleScroll = (ref, setIndex, itemCount) => {
    if (!ref.current) return;
    const scrollLeft = ref.current.scrollLeft;
    const width = ref.current.offsetWidth;
    const index = Math.round(scrollLeft / (width * 0.8));
    setIndex(Math.min(index, itemCount - 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
         <div className="w-12 h-12 border-4 border-accent-blue border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  const reels = [
    { id: 1, title: "Quick CSS Tip", thumbnail: "https://img.youtube.com/vi/reels1/maxresdefault.jpg" },
    { id: 2, title: "JS One-Liner", thumbnail: "https://img.youtube.com/vi/reels2/maxresdefault.jpg" },
    { id: 3, title: "Git Cheat Sheet", thumbnail: "https://img.youtube.com/vi/reels3/maxresdefault.jpg" }
  ];

  return (
    <div className="relative">
      {/* 1 Hero Section */}
      <section className="relative pt-16 md:pt-32 pb-12 md:pb-24 px-6 overflow-hidden min-h-[70vh] md:min-h-screen flex items-center">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-blue/10 blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-purple/10 blur-[150px] animate-pulse-glow" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 glass-card border-accent-blue/30 text-accent-blue text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(0,240,255,0.1)]"
            >
              <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
              Initializing Intelligence v2.0
            </motion.div>
            
            <h1 className="text-3xl sm:text-4xl md:text-8xl font-black mb-6 md:mb-8 leading-tight tracking-tighter text-center lg:text-left">
              From <span className="text-gradient">Confusion</span> <br />
              to Clarity in Mins
            </h1>
            
            <p className="text-lg md:text-2xl text-gray-400 mb-8 md:mb-12 max-w-xl font-light leading-relaxed text-center lg:text-left mx-auto lg:mx-0">
              Understand AI, coding, and semester subjects with structured videos, 
              notes, and exam-ready content.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center lg:justify-start">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 240, 255, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-accent-blue to-accent-purple rounded-2xl font-black text-white text-base md:text-lg flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(123,97,255,0.2)]"
              >
                Start Learning <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button 
                whileHover={{ backgroundColor: "rgba(255,255,255,0.1)", scale: 1.02 }}
                onClick={() => document.getElementById('categories').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 md:px-10 py-4 md:py-5 border border-white/10 glass-card rounded-2xl font-bold text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2 text-base md:text-lg"
              >
                 Explore Categories <Layers className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative max-w-[280px] md:max-w-none mx-auto lg:mx-0"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-accent-blue via-accent-purple to-accent-cyan rounded-[3rem] blur-3xl opacity-20 animate-pulse-glow" />
            
            {/* Custom AI-Human Fusion Image UI */}
            <div className="glass-card p-2 border-white/10 relative overflow-hidden group rounded-[2.5rem] shadow-2xl">
              <div className="relative aspect-[4/5] md:aspect-square overflow-hidden rounded-[2rem]">
                {/* Real Human Side */}
                <img 
                  src="/images/ai_human_hybrid.png" 
                  alt="Founder AI-Human Hybrid" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                
                {/* AI Fusion Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-blue/20 to-accent-purple/40 mix-blend-overlay" />
                <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20 blur-[1px] animate-glitch-line" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,240,255,0.3)_0%,transparent_70%)]" />
                
                {/* Futuristic HUD Elements */}
                <div className="absolute inset-0 border-[0.5px] border-white/10 rounded-[2rem] pointer-events-none" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-accent-blue/5 backdrop-blur-[2px] border-l border-white/10" />
                
                {/* Circuit/Glow Detail */}
                <div className="absolute top-1/2 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-blue to-transparent opacity-30" />
                <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-accent-purple to-transparent opacity-30" />
                
                <div className="absolute bottom-8 left-8 right-8 p-4 glass-card border-white/10 bg-dark/60 backdrop-blur-md">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center border border-accent-blue/40">
                         <Zap size={14} className="text-accent-blue animate-pulse" />
                      </div>
                      <div>
                         <div className="text-[10px] font-black text-white uppercase tracking-widest">AI + Human Clarity</div>
                         <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Neural Sync Optimized</div>
                      </div>
                   </div>
                </div>
              </div>

              {/* Float Effect Elements */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-10 right-10 p-4 glass-card border-accent-blue/30 backdrop-blur-md"
              >
                <Sparkles className="text-accent-blue" />
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute bottom-20 -left-10 p-4 glass-card border-accent-purple/30 backdrop-blur-md hidden lg:block"
              >
                <div className="text-accent-purple font-black text-[10px] uppercase tracking-tighter italic">Powered by Clarity</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2 Main Categories Section */}
      <section id="categories" className="py-10 md:py-16 px-6 relative max-w-7xl mx-auto">
        <motion.div {...fadeInUp} className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-6xl font-black mb-4 md:mb-6 glow-text italic">Select Mission</h2>
          <p className="text-gray-400 text-base md:text-lg">Main entry points into the hive of knowledge.</p>
        </motion.div>
        
        <div className="relative group/scroll">
          <div 
            ref={catRef}
            onScroll={() => handleScroll(catRef, setCatIndex, categories.length)}
            className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide snap-x snap-mandatory pr-10 md:pr-0"
          >
            {categories.map((cat, i) => (
              <Link to={`/category/${cat.slug || cat.id}`} key={cat.id} className="min-w-[280px] md:min-w-0 snap-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group h-full"
                >
                  <GlassCard glow neonColor={i % 2 === 0 ? "blue" : "purple"} className="p-0 overflow-hidden h-full flex flex-col border-white/5 hover:border-accent-blue/40">
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        src={cat.thumbnail || `/images/cat_${i}.png`} 
                        alt={cat.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => e.target.src = "/images/hero_bg.png"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="text-2xl font-black mb-3 group-hover:text-accent-blue transition-colors italic uppercase tracking-tight">{cat.name}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light line-clamp-2">{cat.description || "Knowledge module available for deployment."}</p>
                      <div className="mt-auto flex items-center gap-2 text-accent-blue font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                        Initialize <ArrowRight size={14} />
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </Link>
            ))}
          </div>
          {/* Edge Fade */}
          <div className="absolute top-0 right-0 bottom-4 w-12 bg-gradient-to-l from-dark to-transparent pointer-events-none md:hidden" />
        </div>
        <ScrollDots count={categories.length} activeIndex={catIndex} color="blue" />
      </section>

      {/* 2.5 Social Presence Section */}
      <section className="py-12 px-6 relative max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-accent-purple/5 blur-[120px] rounded-full -z-10" />
        
        <motion.div {...fadeInUp} className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-black mb-4 glow-text italic">Connect & Learn Beyond the Platform</h2>
          <p className="text-gray-400 text-base md:text-lg font-light max-w-2xl mx-auto text-center">
            Explore more content, updates, and learning resources across our social platforms.
          </p>
        </motion.div>

        <div className="relative group/scroll">
          <div 
            ref={socialRef}
            onScroll={() => handleScroll(socialRef, setSocialIndex, 3)}
            className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide snap-x snap-mandatory pr-10 md:pr-0"
          >
            {[
              {
                platform: "YouTube",
                name: "ConceptsIn5",
                desc: "Watch full concept explanations and structured learning videos",
                icon: <Youtube className="w-8 h-8 text-red-500" />,
                link: "https://www.youtube.com/@conceptsin5",
                color: "red",
                glowColor: "rgba(239, 68, 68, 0.4)"
              },
              {
                platform: "Instagram",
                name: "ConceptsIn5",
                desc: "Quick reels and short-form concept breakdowns",
                icon: <Instagram className="w-8 h-8 text-pink-500" />,
                link: "https://www.instagram.com/conceptsin5",
                color: "pink",
                glowColor: "rgba(236, 72, 153, 0.4)"
              },
              {
                platform: "LinkedIn",
                name: "Om Rajpure",
                desc: "Follow for professional updates and project insights",
                icon: <Linkedin className="w-8 h-8 text-accent-blue" />,
                link: "https://www.linkedin.com/in/om-rajpure",
                color: "blue",
                glowColor: "rgba(0, 240, 255, 0.4)"
              }
            ].map((social, i) => (
              <motion.a 
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group block min-w-[300px] md:min-w-0 snap-center"
              >
                <GlassCard 
                  glow 
                  neonColor={social.color === "blue" ? "blue" : "purple"} 
                  className="h-full border-white/5 group-hover:border-white/20 relative"
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity blur-2xl -z-10" 
                    style={{ backgroundColor: social.glowColor }}
                  />
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all">
                      {social.icon}
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter group-hover:text-gradient">
                        {social.name}
                      </h3>
                      <p className="text-accent-cyan text-xs font-black uppercase tracking-widest mt-1">
                        {social.platform}
                      </p>
                    </div>

                    <p className="text-gray-400 text-sm font-light leading-relaxed mb-8">
                      {social.desc}
                    </p>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-auto px-8 py-3 rounded-xl border border-white/10 glass-card text-xs font-black uppercase tracking-widest group-hover:bg-white group-hover:text-dark transition-all"
                    >
                      Visit Profile
                    </motion.div>
                  </div>
                </GlassCard>
              </motion.a>
            ))}
          </div>
          {/* Edge Fade */}
          <div className="absolute top-0 right-0 bottom-4 w-12 bg-gradient-to-l from-dark to-transparent pointer-events-none md:hidden" />
        </div>
        <ScrollDots count={3} activeIndex={socialIndex} color="purple" />
      </section>

      {/* 3 Featured Videos Section */}
      <section className="py-10 md:py-16 px-6 relative bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-12 md:mb-16 text-center md:text-left">
            <div>
              <h2 className="text-3xl md:text-6xl font-black mb-4 md:mb-6 glow-text tracking-tighter italic">Start Learning</h2>
              <p className="text-gray-400 text-base md:text-lg font-light">High-density engineering concepts in 5-minute packets.</p>
            </div>
            <button className="px-8 py-3 glass-card border-white/10 text-xs font-black uppercase tracking-widest text-accent-cyan hover:text-white transition-colors">
              View All Content
            </button>
          </motion.div>

          <div className="relative group/scroll">
            <div 
              ref={videoRef}
              onScroll={() => handleScroll(videoRef, setVideoIndex, featuredVideos.length)}
              className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide snap-x snap-mandatory pr-10 md:pr-0"
            >
              {featuredVideos.map((video, i) => (
                <Link key={i} to={`/video/${video.id}`} className="min-w-[300px] md:min-w-0 snap-center">
                  <GlassCard className="p-0 border-white/10 group bg-white/[0.02] hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] transition-all duration-500">
                    <div className="relative aspect-video overflow-hidden rounded-t-2xl">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-dark/40 group-hover:bg-dark/20 transition-colors flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-accent-blue/20 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-accent-blue group-hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all duration-300">
                          <Play className="text-white fill-current ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-4 px-2 py-1 bg-dark/80 backdrop-blur-md rounded border border-white/10 text-[10px] font-black text-white flex items-center gap-1">
                        <Clock size={12} className="text-accent-cyan" /> {video.duration}
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-xl font-black mb-4 group-hover:text-accent-blue transition-colors line-clamp-1 italic uppercase tracking-tight">{video.title}</h3>
                      <div className="flex justify-between items-center text-gray-500 text-xs font-black uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-1.5 uppercase tracking-widest">{video.type} module</span>
                        <span className="text-accent-cyan flex items-center gap-1">Deploy <ChevronRight size={14} /></span>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
            {/* Edge Fade */}
            <div className="absolute top-0 right-0 bottom-4 w-12 bg-gradient-to-l from-dark to-transparent pointer-events-none md:hidden" />
          </div>
          <ScrollDots count={featuredVideos.length} activeIndex={videoIndex} color="blue" />
        </div>
      </section>

      {/* 4 Instagram Reels Section */}
      <section className="py-16 md:py-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-black glow-text italic">Quick Concepts ⚡</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </motion.div>

          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
            {/* Using mock thumbnails for reels */}
            {reels.map((reel, i) => (
              <GlassCard key={i} className="min-w-[200px] md:min-w-[240px] p-0 border-white/5 group relative aspect-[9/16] overflow-hidden">
                <img src={reel.thumbnail} alt={reel.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent flex flex-col justify-end p-6">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 group-hover:bg-accent-purple transition-all">
                    <Zap size={20} className="text-white fill-current" />
                  </div>
                  <h4 className="font-black text-sm text-white group-hover:text-accent-purple transition-colors uppercase tracking-widest italic">{reel.title}</h4>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* 5 How it Works Section */}
      <section className="py-16 md:py-20 px-6 max-w-7xl mx-auto relative border-y border-white/5">
        <motion.div {...fadeInUp} className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 glow-text italic underline decoration-accent-purple/30 underline-offset-8">The HUD Logic</h2>
          <p className="text-gray-400 text-lg font-light">Download knowledge into your long-term memory in three steps.</p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { step: "MISSION 01", title: "Pick Category", desc: "Select your target subject from our high-precision database.", icon: <Target className="text-accent-blue" />, color: "blue" },
            { step: "MISSION 02", title: "Watch & Ingest", desc: "Absorb core concepts via 5-minute high-octane video data.", icon: <Video className="text-accent-purple" />, color: "purple" },
            { step: "MISSION 03", title: "Revise & Conquer", desc: "Secure your grades with lethal cheat sheets and notes.", icon: <CheckCircle2 className="text-accent-cyan" />, color: "blue" },
          ].map((item, i) => (
            <GlassCard key={i} glow neonColor={item.color} className="p-10 group bg-white/[0.01] hover:bg-white/[0.03] transition-all">
              <div className="text-[10px] font-black text-accent-purple/60 mb-6 tracking-[0.3em] uppercase">{item.step}</div>
              <div className="p-5 bg-white/5 rounded-2xl inline-block mb-6 border border-white/5 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all">
                {item.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 transition-colors italic uppercase tracking-tighter">{item.title}</h3>
              <p className="text-gray-400 text-base leading-relaxed font-light">{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 6 Why ConceptsIn5 Section */}
      <section className="py-20 md:pb-24 px-6 relative overflow-hidden bg-grid opacity-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <motion.div {...fadeInUp}>
              <h2 className="text-4xl md:text-6xl font-black mb-10 glow-text leading-tight tracking-tighter italic">Why Students <br />Join the Hive?</h2>
              <div className="space-y-8">
                {[
                  { title: "Save 100+ Hours", desc: "No more long, boring lectures. Only what matters." },
                  { title: "Simple Explanations", desc: "Complex engineering made understandable for anyone." },
                  { title: "Exam-Ready Content", desc: "Notes and videos designed to help you score high." },
                  { title: "Structured Paths", desc: "Don't get lost. Follow our optimized learning roads." }
                ].map((point, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="mt-1 w-6 h-6 rounded-full bg-accent-blue/20 flex-shrink-0 flex items-center justify-center border border-accent-blue/30 group-hover:bg-accent-blue transition-colors">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg mb-1 group-hover:text-accent-blue transition-colors uppercase tracking-widest">{point.title}</h4>
                      <p className="text-gray-500 text-sm font-medium">{point.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative hidden md:block"
            >
              <div className="absolute -inset-10 bg-accent-blue/10 blur-[100px] animate-pulse-glow" />
              <GlassCard className="p-12 border-accent-blue/20 bg-dark/40 backdrop-blur-2xl">
                 <div className="mb-10 text-center">
                   <Award className="w-16 h-16 text-accent-cyan mx-auto mb-4" />
                   <h3 className="text-3xl font-black text-white italic">Target Achieved</h3>
                 </div>
                 <div className="space-y-6">
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                     <motion.div initial={{ width: 0 }} whileInView={{ width: '95%' }} transition={{ duration: 1 }} className="h-full bg-accent-blue" />
                   </div>
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                     <span>Efficiency</span>
                     <span>95% Boost</span>
                   </div>
                 </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* 7 Creator Section */}
      <section id="about" className="py-20 md:py-24 px-6 max-w-6xl mx-auto relative content-center">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent-blue/10 blur-[100px] -z-10" />
        
        <GlassCard className="flex flex-col lg:flex-row items-center gap-16 p-12 lg:p-20 border-accent-purple/10 bg-white/[0.01]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-accent-blue via-accent-purple to-accent-cyan rounded-full blur-2xl opacity-20 animate-pulse-glow" />
            <img 
              src="/owner.jpeg" 
              alt="Founder" 
              className="relative w-56 h-56 lg:w-80 lg:h-80 rounded-full object-cover border-4 border-accent-purple/30 shadow-[0_0_50px_rgba(123,97,255,0.2)]"
            />
            <div className="absolute bottom-6 right-6 px-4 py-1.5 bg-dark border border-accent-blue/50 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-blue animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-widest text-accent-blue">Online</span>
            </div>
          </motion.div>

          <div className="flex-1 text-center lg:text-left">
            <motion.div {...fadeInUp} className="inline-block px-3 py-1 mb-6 border border-accent-cyan/30 text-accent-cyan text-[10px] font-black uppercase tracking-widest rounded bg-accent-cyan/5">
              Command Center
            </motion.div>
            <motion.h2 {...fadeInUp} className="text-4xl md:text-6xl font-black mb-8 glow-text italic leading-tight">
              Built by a Student, <br />for Students
            </motion.h2>
            <motion.p {...fadeInUp} className="text-gray-400 text-lg leading-relaxed mb-10 font-light">
              I built ConceptsIn5 because I was tired of fluff. Our mission is to optimize 
              your learning time. We strip away the filler and give you the pure signal. 
              High efficiency learning for the modern age.
            </motion.p>
            <div className="flex gap-8 justify-center lg:justify-start grayscale hover:grayscale-0 transition-all">
              <Instagram className="cursor-pointer hover:text-accent-purple transition-colors" />
              <Youtube className="cursor-pointer hover:text-red-500 transition-colors" />
              <Linkedin className="cursor-pointer hover:text-accent-blue transition-colors" />
            </div>
          </div>
        </GlassCard>
      </section>

      {/* 8 Final CTA Section */}
      <section className="py-40 px-6 relative text-center overflow-hidden min-h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.1)_0%,transparent_70%)]" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-6xl md:text-9xl font-black mb-12 italic tracking-tighter leading-none"
          >
            Start Learning <br />
            <span className="text-gradient">Smarter</span> Today
          </motion.h2>
          
          <motion.button 
            whileHover={{ scale: 1.1, boxShadow: "0 0 50px rgba(123, 97, 255, 0.6)" }}
            whileTap={{ scale: 0.9 }}
            className="px-16 py-8 bg-white text-dark rounded-[2.5rem] font-black text-2xl shadow-2xl transition-all"
          >
            Get Started
          </motion.button>
        </div>
      </section>
    </div>
  );
}
