import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Clock, 
  Zap, 
  ChevronRight, 
  Target,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  MousePointer2,
  Video,
  ListRestart,
  Tag,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import ScrollDots from '../components/ScrollDots';

const cn = (...classes) => classes.filter(Boolean).join(' ');

function VideoCard({ video, subject, isActive, isFirst, lastWatchedId }) {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <motion.div
      layout
      {...fadeInUp}
    >
      <GlassCard className={cn(
        "p-0 border-white/5 group h-full flex flex-col hover:border-accent-blue/30 overflow-hidden transition-all duration-500",
        isActive ? "border-accent-blue shadow-[0_0_30px_rgba(0,240,255,0.15)] bg-white/[0.02]" : "bg-white/[0.01]"
      )}>
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={video.thumbnail || "/images/hero_bg.png"}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent" />
          
          <div className="absolute top-4 right-4 flex gap-2">
            <div className="px-2 py-1 bg-dark/80 backdrop-blur-md rounded border border-white/10 text-[9px] font-black text-white flex items-center gap-1 uppercase tracking-widest">
              <Clock size={10} className="text-accent-cyan" /> {video.duration}
            </div>
            <div className="px-2 py-1 bg-dark/80 backdrop-blur-md rounded border border-white/10 text-[9px] font-black text-white flex items-center gap-1 uppercase tracking-widest">
              <Target size={10} className="text-accent-purple" /> {subject?.title}
            </div>
          </div>

          {(isActive || isFirst) && (
            <div className="absolute top-4 left-4">
              <div className={cn(
                "px-2 py-1 text-[9px] font-black text-white rounded uppercase tracking-widest animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.2)]",
                isActive ? "bg-accent-blue/90" : "bg-accent-purple/90"
              )}>
                {isActive && lastWatchedId ? "Next Module" : (isFirst ? "Start Here" : "Next Module")}
              </div>
            </div>
          )}

          {/* Hover Play Icon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-accent-blue/20 backdrop-blur-md border border-accent-blue/40 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.4)]">
              <Play className="text-white fill-current ml-0.5" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-8 flex flex-col flex-1">
          <div className="flex gap-2 mb-4">
            {(video.important_topics ? video.important_topics.split(',') : []).slice(0, 2).map((topic, i) => (
              <span key={i} className="text-[9px] font-black text-accent-blue/60 uppercase tracking-widest flex items-center gap-1">
                <Tag size={8} /> {topic}
              </span>
            ))}
          </div>

          <h3 className="text-xl font-black mb-4 italic group-hover:text-accent-blue transition-colors line-clamp-1 uppercase tracking-tight">
            {video.title}
          </h3>

          <p className="text-gray-400 text-sm font-light leading-relaxed line-clamp-2 mb-8">
            {video.description}
          </p>

          <div className="mt-auto grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 bg-white/[0.03] border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all text-gray-300 hover:text-white">
              <Download size={14} className="text-accent-cyan" /> PDF
            </button>
            <Link to={`/video/${video.id}`} className="flex items-center justify-center gap-2 py-3 bg-accent-purple/10 border border-accent-purple/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent-purple hover:text-white transition-all text-accent-purple">
              <Play size={14} /> Video
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-between pt-6 border-t border-white/5">
             <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">Deployment Stream</span>
             <Link to={`/video/${video.id}`} className="flex items-center gap-2 text-accent-blue font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-3 group-hover:translate-x-0">
                Watch Module <ChevronRight size={14} />
             </Link>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function SubjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [subjectVideos, setSubjectVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roadmapIndex, setRoadmapIndex] = useState(0);
  const roadmapRef = useRef(null);
  const videoRefs = useRef({});

  useEffect(() => {
    const fetchSubjectData = async () => {
      setLoading(true);
      try {
        const [sResponse, vResponse] = await Promise.all([
          axios.get(`/api/public/subjects/${id}/`),
          axios.get(`/api/public/videos/?subject=${id}`)
        ]);
        
        const sData = sResponse.data;
        const vData = vResponse.data.results || vResponse.data;
        
        setSubject({
          ...sData,
          title: sData.name,
          roadmap: sData.description ? sData.description.split('.').filter(s => s.trim().length > 0) : [],
          importantTopics: sData.description ? sData.description.split(' ').slice(0, 5) : [] 
        });
        setSubjectVideos(vData.sort((a, b) => a.id - b.id));
      } catch (error) {
        console.error('Failed to fetch subject details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjectData();
  }, [id]);

  const [lastWatchedId, setLastWatchedId] = useState(null);
  useEffect(() => {
    const saved = localStorage.getItem(`watched_${id}`);
    if (saved) setLastWatchedId(saved);
  }, [id]);

  const continueVideo = useMemo(() => {
    if (!lastWatchedId || subjectVideos.length === 0) return subjectVideos[0];
    const index = subjectVideos.findIndex(v => v.id === parseInt(lastWatchedId));
    return subjectVideos[index + 1] || subjectVideos[index] || subjectVideos[0];
  }, [lastWatchedId, subjectVideos]);

  const totalDuration = useMemo(() => {
    const sum = subjectVideos.reduce((acc, v) => acc + (parseInt(v.duration) || 0), 0);
    return `~${sum} mins`;
  }, [subjectVideos]);

  const scrollToVideo = (videoId) => {
    videoRefs.current[videoId]?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  };

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

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-4xl font-black mb-4 italic uppercase tracking-widest text-white">Subject Not Found</h2>
          <Link to="/" className="text-accent-blue hover:underline font-black uppercase text-xs tracking-widest">Return to Base</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32">
      <section className="relative pt-48 pb-32 px-6 overflow-hidden min-h-[60vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/subject_hero.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 border border-accent-purple/30 text-accent-purple text-[10px] font-black uppercase tracking-widest rounded bg-accent-purple/5 backdrop-blur-sm shadow-[0_0_15px_rgba(123,97,255,0.1)]"
          >
            <Target className="w-4 h-4" /> Neural Learning Roadmap Initiated
          </motion.div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
            <div className="max-w-3xl">
              <motion.h1 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tighter italic"
              >
                {subject.title}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed mb-10"
              >
                {subject.description}
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-6 mb-4"
            >
              <div className="glass-card px-8 lg:px-10 py-6 border-white/10 bg-white/[0.02] text-center min-w-[140px]">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                  <Video size={12} className="text-accent-blue" /> Modules
                </div>
                <div className="text-4xl font-black text-white">{subjectVideos.length}</div>
              </div>
              <div className="glass-card px-8 lg:px-10 py-6 border-white/10 bg-white/[0.02] text-center min-w-[140px]">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                  <Clock size={12} className="text-accent-cyan" /> ETA
                </div>
                <div className="text-4xl font-black text-accent-cyan">{totalDuration}</div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 mt-6"
          >
            <button 
              onClick={() => scrollToVideo(subjectVideos[0]?.id)}
              className="px-10 py-5 bg-accent-blue rounded-2xl font-black text-white text-lg flex items-center gap-3 shadow-[0_10px_30px_rgba(0,240,255,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              disabled={subjectVideos.length === 0}
            >
              Start Course <ArrowRight className="w-5 h-5" />
            </button>
            {lastWatchedId && (
              <button 
                onClick={() => navigate(`/video/${continueVideo?.id}`)}
                className="px-10 py-5 border border-accent-purple/30 glass-card bg-accent-purple/5 rounded-2xl font-black text-accent-purple hover:text-white hover:bg-accent-purple transition-all flex items-center gap-3"
              >
                 Continue Learning <ListRestart className="w-5 h-5" />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 mt-20 relative">
        <div className="flex flex-col lg:flex-row gap-20">
          <aside className="lg:w-1/4">
            <div className="sticky top-32">
              <motion.div className="flex items-center gap-3 mb-10">
                <TrendingUp className="text-accent-purple" />
                <h3 className="text-2xl font-black italic tracking-tight uppercase">Mission Path</h3>
              </motion.div>

              <div className="relative group/scroll">
                <div 
                  ref={roadmapRef}
                  onScroll={() => handleScroll(roadmapRef, setRoadmapIndex, subject.roadmap.length)}
                  className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-6 lg:pb-0 scrollbar-hide snap-x snap-mandatory pr-10 lg:pr-0"
                >
                <div className="hidden lg:block absolute left-[23px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-accent-purple via-accent-blue to-accent-cyan opacity-20" />
                
                {subject.roadmap.map((step, i) => (
                  <motion.div key={i} className="relative lg:pb-12 group cursor-default flex-shrink-0">
                    <div className="flex items-center gap-6">
                      <div className="relative z-10 w-5 h-5 rounded-full bg-dark border-2 border-accent-purple transition-all duration-300 group-hover:bg-accent-purple">
                        <div className="absolute inset-0 bg-accent-purple rounded-full animate-ping opacity-0 group-hover:opacity-30" />
                      </div>
                      <div className="flex-1 whitespace-nowrap lg:whitespace-normal">
                        <div className="text-[9px] font-black text-gray-500 tracking-[0.2em] mb-1 group-hover:text-accent-purple transition-colors uppercase">Step {String(i + 1).padStart(2, '0')}</div>
                        <h4 className="font-bold text-gray-300 group-hover:text-white transition-all text-xs lg:text-sm uppercase tracking-wide line-clamp-2">
                          {step}
                        </h4>
                      </div>
                    </div>
                  </motion.div>
                ))}
                </div>
                <div className="absolute top-0 right-0 bottom-6 w-12 bg-gradient-to-l from-dark to-transparent pointer-events-none lg:hidden" />
              </div>
              <ScrollDots count={subject.roadmap.length} activeIndex={roadmapIndex} color="purple" />
            </div>
          </aside>

          <main className="lg:w-3/4">
            <motion.section className="mb-20">
              <div className="flex items-center gap-4 mb-8">
                 <Zap className="text-accent-cyan animate-pulse" />
                 <h3 className="text-xl font-black uppercase tracking-widest text-white italic">Exam Essentials</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                {subject.importantTopics.map((topic, i) => (
                  <motion.div key={i} className="px-6 py-3 border border-accent-cyan/20 glass-card bg-accent-cyan/[0.03] text-accent-cyan text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-default">
                    {topic}
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <div className="space-y-12">
              <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-6">
                <div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tight glow-text leading-tight">Course Modules</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {subjectVideos.map((video, i) => (
                  <div key={video.id} ref={el => videoRefs.current[video.id] = el} className="flex h-full">
                    <VideoCard 
                      video={video} 
                      subject={subject} 
                      isActive={video.id === parseInt(lastWatchedId)}
                      isFirst={i === 0}
                      lastWatchedId={lastWatchedId}
                    />
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
