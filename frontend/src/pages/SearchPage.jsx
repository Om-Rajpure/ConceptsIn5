import { useMemo, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Video, 
  BookOpen, 
  Target, 
  ArrowRight,
  TrendingUp,
  Clock,
  Tag,
  ChevronRight,
  Layers,
  Zap,
  Download,
  Play
} from 'lucide-react';
import { subjects } from '../data/subjects';
import { videos } from '../data/videos';
import { notes } from '../data/notes';
import { globalSearch } from '../utils/search';
import GlassCard from '../components/GlassCard';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function SearchPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || "";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [query]);

  const results = useMemo(() => {
    return globalSearch(query, { subjects, videos, notes });
  }, [query]);

  const totalResults = results.videos.length + results.subjects.length + results.notes.length;

  return (
    <div className="min-h-screen pb-32 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-10 -z-10" />
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-accent-blue/10 blur-[150px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-accent-purple/10 blur-[150px] animate-pulse-glow" />

      {/* Header */}
      <section className="pt-48 pb-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 glass-card border-accent-blue/30 text-accent-blue text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <Search className="w-4 h-4" /> Global Intelligence Scan
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black mb-8 italic tracking-tighter leading-tight"
          >
            Search <span className="text-gradient">Results</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 max-w-2xl font-light leading-relaxed mb-6"
          >
            Displaying <span className="text-white font-bold">{totalResults}</span> packets matching <span className="text-accent-blue font-bold italic">"{query}"</span>
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 space-y-32">
        {totalResults > 0 ? (
          <>
            {/* 1. Subjects Section */}
            {results.subjects.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-12">
                  <Target className="text-accent-purple w-8 h-8" />
                  <h2 className="text-3xl font-black italic uppercase tracking-tight">Subjects</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {results.subjects.map(subject => (
                    <SubjectSearchCard key={subject.id} subject={subject} />
                  ))}
                </div>
              </section>
            )}

            {/* 2. Videos Section */}
            {results.videos.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-12">
                  <Video className="text-accent-blue w-8 h-8" />
                  <h2 className="text-3xl font-black italic uppercase tracking-tight">Videos</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {results.videos.map(video => (
                    <VideoSearchCard key={video.id} video={video} />
                  ))}
                </div>
              </section>
            )}

            {/* 3. Notes Section */}
            {results.notes.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-12">
                  <BookOpen className="text-accent-cyan w-8 h-8" />
                  <h2 className="text-3xl font-black italic uppercase tracking-tight">Notes</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {results.notes.map(note => (
                    <NoteSearchCard key={note.id} note={note} />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <motion.div 
            {...fadeInUp}
            className="py-32 text-center glass-card border-dashed border-white/10"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8 border border-white/5">
              <Layers className="text-gray-600" size={32} />
            </div>
            <h3 className="text-3xl font-black mb-4 italic uppercase">No Data Packets Found</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-10">
              Our search agents couldn't find any results matching your current query. 
              Try using different keywords or exploring categories.
            </p>
            <Link 
              to="/"
              className="px-8 py-4 bg-accent-blue text-white rounded-xl font-bold hover:scale-105 active:scale-95 transition-all inline-block"
            >
              Return to Base
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function SubjectSearchCard({ subject }) {
  const videoCount = videos.filter(v => v.subjectId === subject.id).length;
  
  return (
    <Link to={`/subject/${subject.id}`}>
      <GlassCard className="p-8 border-white/5 group hover:border-accent-purple/30 transition-all h-full flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-accent-purple/10 rounded-xl text-accent-purple border border-accent-purple/20">
            <Target size={24} />
          </div>
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{subject.subcategory}</div>
        </div>
        <h3 className="text-2xl font-black mb-4 italic group-hover:text-accent-purple transition-colors uppercase tracking-tight">{subject.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-2">{subject.description}</p>
        <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
            <Video size={12} className="text-accent-blue" /> {videoCount} Modules
          </div>
          <ChevronRight className="text-accent-purple transition-transform group-hover:translate-x-1" size={18} />
        </div>
      </GlassCard>
    </Link>
  );
}

function VideoSearchCard({ video }) {
  const subject = subjects.find(s => s.id === video.subjectId);

  return (
    <Link to={`/video/${video.id}`}>
      <GlassCard className="p-0 border-white/5 group hover:border-accent-blue/30 overflow-hidden h-full flex flex-col">
        <div className="relative aspect-video">
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
          <div className="absolute bottom-4 left-4 flex gap-2">
            <div className="px-2 py-1 bg-dark/80 backdrop-blur-md rounded border border-white/10 text-[9px] font-black text-white flex items-center gap-1 uppercase tracking-widest">
              <Clock size={10} className="text-accent-cyan" /> {video.duration}
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
            <div className="w-12 h-12 rounded-full bg-accent-blue/20 backdrop-blur-md border border-accent-blue/40 flex items-center justify-center">
              <Play className="text-white fill-current ml-0.5" size={20} />
            </div>
          </div>
        </div>
        <div className="p-8 flex flex-col flex-1">
          <div className="text-[9px] font-black text-accent-blue/60 uppercase tracking-widest mb-3">{subject?.title}</div>
          <h3 className="text-xl font-black mb-4 italic group-hover:text-accent-blue transition-colors line-clamp-1 uppercase tracking-tight">{video.title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-8">{video.quick_summary}</p>
          <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5 text-accent-blue font-black text-[10px] uppercase tracking-widest">
            Watch Module <ChevronRight size={14} />
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}

function NoteSearchCard({ note }) {
  const subject = subjects.find(s => s.id === note.subjectId);

  return (
    <Link to={note.videoId ? `/video/${note.videoId}` : `/notes?id=${note.id}`}>
      <GlassCard className="p-8 border-white/5 group hover:border-accent-cyan/30 transition-all h-full flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-accent-cyan/10 rounded-xl text-accent-cyan border border-accent-cyan/20">
            <BookOpen size={24} />
          </div>
          <div className="flex gap-2">
            {note.tags?.slice(0, 1).map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-white/5 rounded text-[8px] font-black text-gray-500 uppercase tracking-widest">{tag}</span>
            ))}
          </div>
        </div>
        <h3 className="text-xl font-black mb-4 italic group-hover:text-accent-cyan transition-colors uppercase tracking-tight">{note.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-2">{note.description}</p>
        <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5 text-accent-cyan font-black text-[10px] uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Download size={12} /> {note.type || 'Study Note'}
          </div>
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </GlassCard>
    </Link>
  );
}
