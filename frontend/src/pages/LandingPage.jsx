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
  Target,
  Github,
  PlusCircle,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import ScrollDots from '../components/ScrollDots';
import SkeletonCard from '../components/SkeletonCard';
import ErrorState from '../components/ErrorState';
import { getIcon } from '../utils/iconHelper';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, ease: "easeOut" }
};

export default function LandingPage() {
  const [categories, setCategories] = React.useState([]);
  const [featuredVideos, setFeaturedVideos] = React.useState([]);
  const [reels, setReels] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [catIndex, setCatIndex] = React.useState(0);
  const [socialIndex, setSocialIndex] = React.useState(0);
  const [videoIndex, setVideoIndex] = React.useState(0);
  const [hudIndex, setHudIndex] = React.useState(0);
  const [reelIndex, setReelIndex] = React.useState(0);

  const catRef = React.useRef(null);
  const socialRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const hudRef = React.useRef(null);
  const reelRef = React.useRef(null);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [cResponse, vResponse, rResponse] = await Promise.all([
          axios.get('/api/public/categories/'),
          axios.get('/api/public/videos/?is_important=true'),
          axios.get('/api/public/reels/')
        ]);
        setCategories(cResponse.data.results || cResponse.data);
        setFeaturedVideos((vResponse.data.results || vResponse.data).slice(0, 3));
        setReels((rResponse.data.results || rResponse.data).slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch landing page data', err);
        setError('Synchronizing with the main neural core failed. System disruption detected.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  const scrollTo = (ref, index) => {
    if (!ref.current) return;
    const container = ref.current;
    const cards = container.children;
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  React.useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6
    };

    const observers = [
      { ref: catRef, setIndex: setCatIndex },
      { ref: socialRef, setIndex: setSocialIndex },
      { ref: videoRef, setIndex: setVideoIndex },
      { ref: hudRef, setIndex: setHudIndex },
      { ref: reelRef, setIndex: setReelIndex }
    ].map(({ ref, setIndex }) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(ref.current.children).indexOf(entry.target);
            if (index !== -1) setIndex(index);
          }
        });
      }, options);

      return { observer, ref };
    });

    observers.forEach(({ observer, ref }) => {
      if (ref.current) {
        Array.from(ref.current.children).forEach(child => observer.observe(child));
      }
    });

    return () => observers.forEach(({ observer }) => observer.disconnect());
  }, [loading, categories, reels, featuredVideos]);


  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="relative overflow-x-hidden">
      {/* 1 Hero Section */}
      <section className="relative pt-16 md:pt-32 pb-12 md:pb-24 px-6 overflow-hidden min-h-[70vh] md:min-h-screen flex items-center">
        <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-accent-blue/10 blur-[80px] md:blur-[150px] animate-pulse-glow" style={{ willChange: "opacity, filter" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-accent-purple/10 blur-[80px] md:blur-[150px] animate-pulse-glow" style={{ willChange: "opacity, filter" }} />
        
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
            
            <h1 className="text-hero text-center lg:text-left">
              From <span className="text-gradient">Confusion</span> <br />
              to Clarity in Mins
            </h1>
            
            <p className="text-lg md:text-2xl text-gray-400 mb-8 md:mb-12 max-w-xl font-light leading-relaxed text-center lg:text-left mx-auto lg:mx-0">
              Understand AI, coding, and semester subjects with structured videos, 
              notes, and exam-ready content.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center lg:justify-start">
              <Link to="/notes" className="contents">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 240, 255, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-accent-blue to-accent-purple rounded-2xl font-black text-white text-base md:text-lg flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(123,97,255,0.2)] w-full sm:w-auto"
                >
                  Start Learning <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
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
            <div className="absolute -inset-4 bg-gradient-to-tr from-accent-blue via-accent-purple to-accent-cyan rounded-[3rem] blur-2xl md:blur-3xl opacity-10 md:opacity-20 animate-pulse-glow" style={{ willChange: "opacity, filter" }} />
            
            <div className="glass-card p-2 border-white/10 relative overflow-hidden group rounded-[2.5rem] shadow-2xl">
              <div className="relative aspect-[4/5] md:aspect-square overflow-hidden rounded-[2rem]">
                <img 
                  src="/images/ai_human_hybrid.png" 
                  alt="Founder AI-Human Hybrid" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-blue/20 to-accent-purple/40 mix-blend-overlay" />
                <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20 blur-[1px] animate-glitch-line" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,240,255,0.3)_0%,transparent_70%)]" />
                
                <div className="absolute inset-0 border-[0.5px] border-white/10 rounded-[2rem] pointer-events-none" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-accent-blue/5 backdrop-blur-[2px] border-l border-white/10" />
                
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

              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                style={{ willChange: "transform" }}
                className="absolute top-10 right-10 p-4 glass-card border-accent-blue/30 backdrop-blur-md"
              >
                <Sparkles className="text-accent-blue" />
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, delay: 1, ease: "easeInOut" }}
                style={{ willChange: "transform" }}
                className="absolute bottom-20 -left-10 p-4 glass-card border-accent-purple/30 backdrop-blur-md hidden lg:block"
              >
                <div className="text-accent-purple font-black text-[10px] uppercase tracking-tighter italic">Powered by Clarity</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2 Main Categories Section */}
      <section id="categories" className="py-10 md:py-16 px-0 relative section-container overflow-hidden">
        <motion.div {...fadeInUp} className="text-center mb-10 md:mb-16 px-6">
          <h2 className="text-section-title mb-4 md:mb-6">Select Mission</h2>
          <p className="text-gray-400 text-base md:text-lg">Main entry points into the hive of knowledge.</p>
        </motion.div>
        
        <div className="relative group/scroll parent-container-overflow">
          <div className="scroll-container">
            <div 
              ref={catRef}
              className="scroll-track px-4 md:px-0"
            >
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="card-scroll-item">
                    <SkeletonCard />
                  </div>
                ))
              ) : (
                categories.map((cat, i) => {
                  const Icon = getIcon(cat.icon);
                  return (
                    <Link 
                      to={`/category/${cat.slug || cat.id}`} 
                      key={cat.id} 
                      className="card-scroll-item"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="group h-full"
                      >
                        <GlassCard 
                           glow 
                           neonColor={i % 2 === 0 ? "blue" : "purple"} 
                           className="p-0 overflow-hidden h-full flex flex-col border-white/5 hover:border-accent-blue/40"
                           style={{'--neon-glow': cat.theme_color}}
                        >
                          <div className="relative aspect-video overflow-hidden">
                            <img 
                              src={cat.background_image || `/images/cat_${i}.png`} 
                              alt={cat.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              loading="lazy"
                              onError={(e) => e.target.src = "/images/hero_bg.png"}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />
                            
                            <div className="absolute top-4 left-4 p-3 glass-card border-white/10 bg-dark/40 backdrop-blur-md rounded-xl text-white group-hover:scale-110 transition-transform">
                               <Icon size={20} className="text-accent-blue" />
                            </div>
                          </div>
                          <div className="p-6 sm:p-8 flex flex-col flex-1">
                            <h3 className="text-xl sm:text-2xl font-black mb-3 group-hover:text-accent-blue transition-colors italic uppercase tracking-tight break-words">{cat.name}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light line-clamp-2 break-words">{cat.description || "Knowledge module available for deployment."}</p>
                            <div className="mt-auto flex items-center gap-2 text-accent-blue font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                              Initialize <ArrowRight size={14} />
                            </div>
                          </div>
                        </GlassCard>
                      </motion.div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
        <ScrollDots count={categories.length} activeIndex={catIndex} color="blue" onDotClick={(idx) => scrollTo(catRef, idx)} />
      </section>

      {/* 2.5 Social Presence Section */}
      <section className="py-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-accent-purple/5 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <h2 className="text-section-title mb-4">Connect & Learn Beyond the Platform</h2>
            <p className="text-gray-400 text-base md:text-lg font-light max-w-2xl mx-auto text-center">
              Explore more content, updates, and learning resources across our social platforms.
            </p>
          </motion.div>
   
          <div className="relative group/scroll parent-container-overflow">
            <div className="scroll-container">
              <div 
                ref={socialRef}
                className="scroll-track md:grid-cols-3 md:px-0"
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
                    className="card-scroll-item group block"
                  >
                    <GlassCard 
                      glow 
                      neonColor={social.color === "blue" ? "blue" : "purple"} 
                      className="h-full border-white/5 group-hover:border-white/20 relative p-6 sm:p-8"
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
     
                        <p className="text-gray-400 text-sm font-light leading-relaxed mb-8 break-words">
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
            </div>
          </div>
          <ScrollDots count={3} activeIndex={socialIndex} color="purple" onDotClick={(idx) => scrollTo(socialRef, idx)} />
        </div>
      </section>

      {/* 3 Featured Videos Section */}
      <section className="py-10 md:py-16 px-0 relative bg-white/[0.01] overflow-hidden">
        <div className="section-container">
          <motion.div {...fadeInUp} className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-12 md:mb-16 text-center md:text-left px-0">
            <div>
              <h2 className="text-section-title mb-4 md:mb-6">Start Learning</h2>
              <p className="text-gray-400 text-base md:text-lg font-light">High-density engineering concepts in 5-minute packets.</p>
            </div>
            <Link to="/notes" className="px-8 py-3 glass-card border-white/10 text-xs font-black uppercase tracking-widest text-accent-cyan hover:text-white transition-colors">
              View All Content
            </Link>
          </motion.div>
        </div>
 
        <div className="relative group/scroll max-w-7xl mx-auto">
          <div 
            ref={videoRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 snap-x snap-mandatory px-4 md:px-0"
          >
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="min-w-[85%] md:min-w-[70%] lg:min-w-0 snap-center flex-shrink-0">
                  <SkeletonCard />
                </div>
              ))
            ) : (
              featuredVideos.map((video, i) => (
                <Link key={i} to={`/video/${video.id}`} className="min-w-[85%] max-w-[90%] md:max-w-none md:min-w-[70%] lg:min-w-0 snap-center flex-shrink-0">
                  <GlassCard className="p-0 border-white/10 group bg-white/[0.02] hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] transition-all duration-500 overflow-hidden">
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
                    <div className="p-6 sm:p-8">
                      <h3 className="text-lg sm:text-xl font-black mb-4 group-hover:text-accent-blue transition-colors line-clamp-1 italic uppercase tracking-tight break-words">{video.title}</h3>
                      <div className="flex justify-between items-center text-gray-500 text-xs font-black uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-1.5 uppercase tracking-widest">{video.type} module</span>
                        <span className="text-accent-cyan flex items-center gap-1">Deploy <ChevronRight size={14} /></span>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              ))
            )}
          </div>
        </div>
        <ScrollDots count={featuredVideos.length} activeIndex={videoIndex} color="blue" onDotClick={(idx) => scrollTo(videoRef, idx)} />
      </section>

      {/* 4 Instagram Reels Section */}
      <section className="py-16 md:py-20 px-6 relative overflow-hidden section-container">
        <div>
          <motion.div {...fadeInUp} className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-12 px-0">
            <div>
              <h2 className="text-section-title">Quick Concepts ⚡</h2>
              <p className="text-gray-400 text-sm font-medium mt-2">Explosive 60-second learning bursts</p>
            </div>
            <Link to="/reels" className="px-8 py-3 glass-card border-white/10 text-[10px] font-black uppercase tracking-widest text-accent-purple hover:text-white transition-colors">
              Explore All Reels
            </Link>
          </motion.div>

        <div className="relative group/scroll parent-container-overflow">
          <div className="scroll-container">
            <div 
              ref={reelRef}
              className="scroll-track px-4 md:px-0"
            >
              {loading ? (
                [1, 2, 3, 4].map(i => (
                  <div key={i} className="card-scroll-item aspect-[9/16] animate-pulse glass-card bg-white/5 opacity-50 flex-shrink-0" />
                ))
              ) : reels.length > 0 ? (
                reels.map((reel, i) => (
                  <a 
                    href={reel.video_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    key={i} 
                    className="card-scroll-item p-0 border-white/5 group relative aspect-[9/16] overflow-hidden rounded-2xl block"
                  >
                    <img 
                      src={reel.thumbnail || reel.thumbnail_url || "/images/hero_bg.png"} 
                      alt={reel.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent flex flex-col justify-end p-6">
                      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 group-hover:bg-accent-purple transition-all shadow-[0_0_20px_rgba(123,97,255,0.3)]">
                        <Zap size={20} className="text-white fill-current" />
                      </div>
                      <h4 className="font-black text-sm text-white group-hover:text-accent-purple transition-colors uppercase tracking-widest italic leading-tight line-clamp-2">{reel.title}</h4>
                    </div>
                  </a>
                ))
              ) : (
                  <div className="w-full py-12 text-center glass-card border-dashed border-white/10">
                      <span className="text-gray-500 font-black uppercase tracking-widest text-xs">No active transmissions detected</span>
                  </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* 5 How it Works Section */}
      <section className="py-16 md:py-20 px-0 relative border-y border-white/5 overflow-hidden section-container">
        <motion.div {...fadeInUp} className="text-center mb-20 px-0">
          <h2 className="text-hero underline decoration-accent-purple/30 underline-offset-8">The HUD Logic</h2>
          <p className="text-gray-400 text-lg font-light">Download knowledge into your long-term memory in three steps.</p>
        </motion.div>
        
        <div className="relative group/scroll">
          <div 
            ref={hudRef}
            className="flex md:grid md:grid-cols-3 gap-6 md:gap-10 overflow-x-auto md:overflow-visible pb-8 md:pb-0 scrollbar-hide snap-x snap-mandatory flex-nowrap px-4 md:px-0"
          >
            {[
              { step: "MISSION 01", title: "Pick Category", desc: "Select your target subject from our high-precision database.", icon: <Target className="text-accent-blue" />, color: "blue" },
              { step: "MISSION 02", title: "Watch & Ingest", desc: "Absorb core concepts via 5-minute high-octane video data.", icon: <Video className="text-accent-purple" />, color: "purple" },
              { step: "MISSION 03", title: "Revise & Conquer", desc: "Secure your grades with lethal cheat sheets and notes.", icon: <CheckCircle2 className="text-accent-cyan" />, color: "blue" },
            ].map((item, i) => (
              <div key={i} className="min-w-[85%] max-w-[90%] md:max-w-none md:min-w-[45%] lg:min-w-0 snap-center flex-shrink-0 flex items-stretch">
                <GlassCard glow neonColor={item.color} className="p-6 sm:p-10 group bg-white/[0.01] hover:bg-white/[0.03] transition-all h-full w-full">
                  <div className="text-[10px] font-black text-accent-purple/60 mb-6 tracking-[0.3em] uppercase">{item.step}</div>
                  <div className="p-5 bg-white/5 rounded-2xl inline-block mb-6 border border-white/5 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-4 transition-colors italic uppercase tracking-tighter break-words">{item.title}</h3>
                  <p className="text-gray-400 text-base leading-relaxed font-light break-words">{item.desc}</p>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
        <ScrollDots count={3} activeIndex={hudIndex} color="purple" onDotClick={(idx) => scrollTo(hudRef, idx)} />
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
            <div className="flex gap-8 justify-center lg:justify-start grayscale hover:grayscale-0 transition-all items-center">
              <a href="https://instagram.com/conceptsin5" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors">
                <Instagram size={24} />
              </a>
              <a href="https://youtube.com/@conceptsin5" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
                <Youtube size={24} />
              </a>
              <a href="https://linkedin.com/in/om-rajpure" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="https://github.com/Om-Rajpure" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Github size={24} />
              </a>
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
          
          <Link to="/om/login" className="contents">
            <motion.button 
              whileHover={{ scale: 1.1, boxShadow: "0 0 50px rgba(123, 97, 255, 0.6)" }}
              whileTap={{ scale: 0.9 }}
              className="px-16 py-8 bg-white text-dark rounded-[2.5rem] font-black text-2xl shadow-2xl transition-all"
            >
              Get Started
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  );
}
