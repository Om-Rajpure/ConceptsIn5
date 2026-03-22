import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  ExternalLink, 
  Download, 
  Clock, 
  Tag, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  Sparkles,
  Zap,
  Target,
  ArrowLeft,
  Award
} from 'lucide-react';
import { subjects } from '../data/subjects';
import { videos } from '../data/videos';
import { notes } from '../data/notes';
import GlassCard from '../components/GlassCard';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function VideoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [context, setContext] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/public/videos/${id}/`);
        const videoData = response.data;
        const subjectData = videoData.subject;
        
        // Fetch all videos for this subject roadmap using subject__slug filter
        const vResponse = await axios.get(`/api/public/videos/?subject__slug=${subjectData.slug}`);
        const subjectVideos = vResponse.data.results || vResponse.data;
        
        const sortedVideos = subjectVideos.sort((a, b) => a.id - b.id);
        const currentIndex = sortedVideos.findIndex(v => v.id === videoData.id);

        setContext({
          subject: { id: subjectData.id, title: subjectData.name, slug: subjectData.slug },
          video: {
            ...videoData,
            youtubeUrl: videoData.youtube_id ? `https://www.youtube.com/embed/${videoData.youtube_id}` : videoData.video_url,
            topicsCovered: videoData.important_topics ? videoData.important_topics.split(',').map(t => t.trim()) : []
          },
          subjectVideos: sortedVideos,
          index: currentIndex,
          prev: sortedVideos[currentIndex - 1],
          next: sortedVideos[currentIndex + 1],
          notes: videoData.notes && videoData.notes.length > 0 ? videoData.notes[0] : { content: '', tags: '', title: 'No Notes' },
          allNotes: videoData.notes || []
        });
      } catch (error) {
          console.error('Failed to fetch video details', error);
      } finally {
          setLoading(false);
      }
    };

    fetchVideoData();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    // Save progress using subject slug
    if (context?.subject?.slug && context?.video?.id) {
      localStorage.setItem(`watched_${context.subject.slug}`, context.video.id);
    }
  }, [context?.subject?.slug, context?.video?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
         <div className="w-12 h-12 border-4 border-accent-blue border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  const { subject, video, prev, next } = context;

  return (
    <div className="min-h-screen pb-32 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-accent-blue/5 to-transparent -z-10" />
      <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-accent-purple/5 blur-[150px] animate-pulse-glow" />

      <section className="pt-32 px-6 max-w-7xl mx-auto relative z-10">
        <Link to={`/subject/${subject.slug}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-accent-blue mb-8 transition-colors group px-4 py-2 glass-card border-white/5 text-[10px] font-black uppercase tracking-widest">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to {subject.title}
        </Link>

        {/* 1. Video Hero Section */}
        <div className="grid lg:grid-cols-12 gap-12 mb-20">
          {/* Video Player */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-8"
          >
            <div className="glass-card p-2 border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden bg-dark">
               <div className="relative aspect-video rounded-[2rem] overflow-hidden">
                 <iframe 
                   src={video.youtubeUrl}
                   title={video.title}
                   className="absolute inset-0 w-full h-full"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                   allowFullScreen
                   loading="lazy"
                 ></iframe>
               </div>
            </div>
          </motion.div>

          {/* Video Metadata */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-accent-cyan/30 text-accent-cyan text-[10px] font-black uppercase tracking-widest rounded bg-accent-cyan/5 w-fit">
              <Sparkles size={12} /> High-Density Module
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black mb-6 italic tracking-tighter leading-tight uppercase">
              {video.title}
            </h1>
            
            <p className="text-gray-400 text-lg font-light leading-relaxed mb-8">
              {video.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="glass-card p-4 border-white/5 bg-white/[0.02]">
                 <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Duration</div>
                 <div className="text-xl font-black text-white flex items-center gap-2">
                    <Clock size={16} className="text-accent-blue" /> {video.duration}
                 </div>
              </div>
              <div className="glass-card p-4 border-white/5 bg-white/[0.02]">
                 <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Subject</div>
                 <div className="text-xl font-black text-white flex items-center gap-2">
                     <Target size={16} className="text-accent-purple" /> {subject.title}
                 </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
               {video.notes && video.notes.length > 0 && video.notes[0].pdf_file ? (
                 <a 
                   href={video.notes[0].pdf_file}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="w-full py-4 bg-accent-blue rounded-2xl font-black text-white flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(0,240,255,0.3)] hover:scale-105 active:scale-95 transition-all"
                 >
                    Download Study Notes <Download size={18} />
                 </a>
               ) : (
                 <button className="w-full py-4 bg-gray-800/50 rounded-2xl font-black text-gray-500 flex items-center justify-center gap-3 cursor-not-allowed">
                    No Notes Available <Download size={18} />
                 </button>
               )}
               <a 
                 href={video.youtubeUrl.replace("embed/", "watch?v=")} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="w-full py-4 glass-card border-white/10 rounded-2xl font-bold text-gray-300 flex items-center justify-center gap-3 hover:text-white transition-all"
               >
                  Watch on YouTube <ExternalLink size={18} />
               </a>
            </div>
          </motion.div>
        </div>

        {/* 2. Structured Learning Content */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left: Notes & Topics */}
          <div className="lg:col-span-2 space-y-12">
            {/* Quick Summary */}
            <motion.section {...fadeInUp}>
               <h3 className="text-2xl font-black italic mb-6 glow-text tracking-tight uppercase underline decoration-accent-blue/30 underline-offset-8">Quick Summary</h3>
               <GlassCard className="bg-white/[0.01] border-white/5 font-light text-xl leading-relaxed text-gray-300 italic">
                 "{context.notes.content?.split('.')[0] || video.description}."
               </GlassCard>
            </motion.section>

            {/* Topics Covered */}
            <motion.section {...fadeInUp}>
               <h3 className="text-2xl font-black italic mb-6 glow-text tracking-tight uppercase">Topics Covered</h3>
               <div className="flex flex-wrap gap-4">
                 {video.topicsCovered.map((topic, i) => (
                   <div key={i} className="px-6 py-3 border border-accent-blue/20 glass-card bg-accent-blue/[0.03] text-accent-blue text-xs font-black uppercase tracking-widest rounded-xl">
                      {topic}
                   </div>
                 ))}
               </div>
            </motion.section>

            {/* Detailed Notes */}
            <motion.section {...fadeInUp}>
               <h3 className="text-2xl font-black italic mb-6 glow-text tracking-tight uppercase">Structured Notes</h3>
               <GlassCard className="p-10 border-white/5 bg-white/[0.01]">
                 <div className="prose prose-invert max-w-none">
                    <div className="text-gray-400 text-lg leading-relaxed font-light space-y-6">
                       {(context.notes.content || "").split('. ').map((para, i) => (
                         <p key={i}>{para}.</p>
                       ))}
                    </div>
                 </div>
               </GlassCard>
            </motion.section>
          </div>

          {/* Right: Exam Highlights & Roadmap */}
          <aside className="space-y-12">
            {/* Exam Points */}
            <motion.section {...fadeInUp}>
               <div className="glass-card p-10 border-accent-purple/30 bg-accent-purple/[0.02] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Award size={64} className="text-accent-purple" />
                  </div>
                  <h3 className="text-2xl font-black italic mb-8 glow-text tracking-tight uppercase flex items-center gap-3">
                    <Zap className="text-accent-purple" size={24} /> Exam Points
                  </h3>
                  <ul className="space-y-6">
                    {(context.notes.tags ? context.notes.tags.split(',') : []).map((point, i) => (
                      <li key={i} className="flex gap-4">
                         <div className="w-1.5 h-1.5 rounded-full bg-accent-purple mt-2 flex-shrink-0 animate-pulse" />
                         <span className="text-gray-300 font-medium leading-relaxed">{point.trim()}</span>
                      </li>
                    ))}
                    {(!context.notes.tags) && (
                      <li className="text-gray-500 italic text-sm">No exam points available yet.</li>
                    )}
                  </ul>
               </div>
            </motion.section>

            {/* Subject Roadmap */}
            <motion.section {...fadeInUp}>
                <h3 className="text-xl font-black italic mb-6 opacity-60 uppercase tracking-widest">Subject Roadmap</h3>
                <div className="space-y-4">
                  {context.subjectVideos.map((step, i) => (
                    <div 
                      key={step.id}
                      className={cn(
                        "p-4 rounded-xl border transition-all flex items-center justify-between group cursor-pointer",
                        step.id === id 
                          ? "bg-accent-blue/10 border-accent-blue/30" 
                          : "bg-white/5 border-white/5 hover:border-white/20"
                      )}
                      onClick={() => step.id !== id && navigate(`/video/${step.id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border",
                          step.id === id ? "bg-accent-blue border-accent-blue text-white" : "border-gray-700 text-gray-500"
                        )}>
                          {i + 1}
                        </div>
                        <span className={cn(
                          "text-sm font-bold uppercase tracking-tight",
                          step.id === id ? "text-accent-blue" : "text-gray-500 group-hover:text-gray-300"
                        )}>
                          {step.title}
                        </span>
                      </div>
                      {step.id === id && <Play size={14} className="text-accent-blue animate-pulse" />}
                    </div>
                  ))}
                </div>
            </motion.section>
          </aside>
        </div>

        {/* 3. Related Videos */}
        <section className="mt-32 pt-20 border-t border-white/5">
           <h2 className="text-3xl font-black italic mb-12 glow-text tracking-tighter uppercase">More in {subject.title}</h2>
           <div className="grid md:grid-cols-3 gap-8">
              {context.subjectVideos.filter(v => v.id !== id).slice(0, 3).map((v) => (
                <Link key={v.id} to={`/video/${v.id}`}>
                  <GlassCard className="p-0 border-white/5 group hover:border-accent-blue/40">
                    <div className="aspect-video relative overflow-hidden">
                       <img 
                          src={v.thumbnail} 
                          alt={v.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                       <div className="absolute inset-0 bg-dark/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="w-12 h-12 rounded-full bg-accent-blue flex items-center justify-center">
                           <Play className="text-white fill-current ml-1" size={20} />
                         </div>
                       </div>
                    </div>
                    <div className="p-6">
                       <h4 className="font-black text-lg group-hover:text-accent-blue transition-colors italic uppercase tracking-tighter">{v.title}</h4>
                       <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                          <span className="flex items-center gap-1.5"><Clock size={12} className="text-accent-cyan" /> {v.duration}</span>
                          <span className="flex items-center gap-1">Learn <ChevronRight size={14} /></span>
                       </div>
                    </div>
                  </GlassCard>
                </Link>
              ))}
           </div>
        </section>

        {/* 4. Bottom Navigation */}
        <div className="mt-32 flex flex-col sm:flex-row justify-between gap-6 border-t border-white/10 pt-12">
            {prev ? (
              <button 
                onClick={() => navigate(`/video/${prev.id}`)}
                className="flex items-center gap-6 group hover:-translate-x-2 transition-transform text-left"
              >
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-accent-purple transition-all">
                   <ChevronLeft size={24} className="text-accent-purple" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Previous Module</div>
                  <div className="text-lg font-black text-white italic group-hover:text-accent-purple transition-colors uppercase tracking-tight">{prev.title}</div>
                </div>
              </button>
            ) : <div />}

            {next ? (
              <button 
                onClick={() => navigate(`/video/${next.id}`)}
                className="flex items-center gap-6 group hover:translate-x-2 transition-transform text-right sm:flex-row-reverse"
              >
                <div className="p-4 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 group-hover:border-accent-blue transition-all">
                   <ChevronRight size={24} className="text-accent-blue" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Next Module</div>
                  <div className="text-lg font-black text-white italic group-hover:text-accent-blue transition-colors uppercase tracking-tight">{next.title}</div>
                </div>
              </button>
            ) : <div />}
        </div>
      </section>
    </div>
  );
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}
