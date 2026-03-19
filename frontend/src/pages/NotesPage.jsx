import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Download, 
  Play, 
  Clock, 
  Tag, 
  ChevronRight,
  X,
  Sparkles,
  Layers,
  Zap,
  Target
} from 'lucide-react';
import { notes } from '../data/notes';
import { subjects as allSubjects } from '../data/subjects';
import { videos } from '../data/videos';
import { categories } from '../data/categories';
import GlassCard from '../components/GlassCard';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.5, ease: "easeOut" }
};

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState("All"); // This is subjectId
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Extract unique values for filters from centralized data
  const categoryOptions = ["All", ...new Set(categories.map(c => c.id))];
  const subcategoryOptions = ["All", ...new Set(allSubjects.map(s => s.subcategory))];
  const subjectOptions = useMemo(() => {
    const subs = allSubjects
      .filter(s => (selectedCategory === "All" || s.category === selectedCategory) && 
                   (selectedSubcategory === "All" || s.subcategory === selectedSubcategory));
    return ["All", ...subs.map(s => s.id)];
  }, [selectedCategory, selectedSubcategory]);
  
  const types = ["All", ...new Set(notes.map(n => n.type).filter(Boolean))];

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const subject = allSubjects.find(s => s.id === note.subjectId);
      if (!subject) return false;

      const matchesSearch = 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "All" || subject.category === selectedCategory;
      const matchesSubcategory = selectedSubcategory === "All" || subject.subcategory === selectedSubcategory;
      const matchesSubject = selectedSubject === "All" || note.subjectId === selectedSubject;
      const matchesType = selectedType === "All" || note.type === selectedType;

      return matchesSearch && matchesCategory && matchesSubcategory && matchesSubject && matchesType;
    });
  }, [searchQuery, selectedCategory, selectedSubcategory, selectedSubject, selectedType]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedSubcategory("All");
    setSelectedSubject("All");
    setSelectedType("All");
  };

  return (
    <div className="min-h-screen pb-32 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-10 -z-10" />
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-accent-blue/10 blur-[150px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-accent-purple/10 blur-[150px] animate-pulse-glow" />

      {/* 1. Hero Section */}
      <section className="pt-48 pb-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 glass-card border-accent-purple/30 text-accent-purple text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <Sparkles className="w-4 h-4" /> Neural Data Repository
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-black mb-8 italic tracking-tighter leading-tight"
          >
            All <span className="text-gradient">Notes</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed mb-12"
          >
            Find high-octane, structured notes for quick understanding and exam-lethal revision.
          </motion.p>
        </div>
      </section>

      {/* 2. Search & Filter Bar */}
      <section className="px-6 mb-20 sticky top-24 z-50">
        <div className="max-w-7xl mx-auto">
          <GlassCard className="p-4 md:p-6 border-white/5 bg-dark/40 backdrop-blur-2xl">
            <div className="flex flex-col gap-6">
              {/* Search */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-blue transition-colors" />
                <input 
                  type="text"
                  placeholder="Search topics, subjects, or keywords..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-gray-600 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/50 transition-all font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FilterSelect 
                  label="Category" 
                  value={selectedCategory} 
                  options={categoryOptions} 
                  onChange={setSelectedCategory} 
                />
                <FilterSelect 
                  label="Subcategory" 
                  value={selectedSubcategory} 
                  options={subcategoryOptions} 
                  onChange={setSelectedSubcategory} 
                />
                <FilterSelect 
                  label="Subject" 
                  value={selectedSubject} 
                  options={subjectOptions} 
                  onChange={setSelectedSubject} 
                  displayMap={Object.fromEntries(allSubjects.map(s => [s.id, s.title]))}
                />
                <FilterSelect 
                  label="Type" 
                  value={selectedType} 
                  options={types} 
                  onChange={setSelectedType} 
                />
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mr-2">Shortcuts:</span>
                <QuickFilter label="Most Important" onClick={() => setSearchQuery("Normalization")} />
                <QuickFilter label="Recently Added" onClick={() => setSelectedCategory("AI/ML")} />
                <QuickFilter label="Exam Topics" onClick={() => setSelectedType("Theory")} />
                {(searchQuery || selectedCategory !== "All" || selectedSubcategory !== "All" || selectedSubject !== "All" || selectedType !== "All") && (
                  <button 
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors ml-auto"
                  >
                    <X size={14} /> Clear System
                  </button>
                )}
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* 3. Notes Grid */}
      <section className="px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black italic glow-text tracking-tighter">
                {filteredNotes.length} Results Found
              </h2>
            </div>
            <div className="text-xs text-gray-500 font-black tracking-widest uppercase hidden md:block">
              Verified Knowledge Stream
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredNotes.length > 0 ? (
              <motion.div 
                layout
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredNotes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                {...fadeInUp}
                className="py-32 text-center glass-card border-dashed border-white/10"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8 border border-white/5">
                  <Layers className="text-gray-600" size={32} />
                </div>
                <h3 className="text-3xl font-black mb-4 italic">No Data Packets Found</h3>
                <p className="text-gray-400 max-w-md mx-auto mb-10">
                  Our search agents couldn't find any results matching your current filters. 
                  Try adjusting your query or resetting the system.
                </p>
                <button 
                  onClick={clearFilters}
                  className="px-8 py-4 bg-accent-blue text-white rounded-xl font-bold hover:scale-105 active:scale-95 transition-all"
                >
                  Reset All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange, displayMap = {} }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{label}</span>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-accent-purple transition-all appearance-none cursor-pointer uppercase tracking-tighter"
      >
        {options.map(opt => (
          <option key={opt} value={opt} className="bg-dark text-white">
            {displayMap[opt] || opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function QuickFilter({ label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-gray-400 hover:text-white hover:border-accent-blue transition-all uppercase tracking-widest"
    >
      {label}
    </button>
  );
}

function NoteCard({ note }) {
  const subject = allSubjects.find(s => s.id === note.subjectId);
  const video = videos.find(v => v.id === note.videoId);

  return (
    <motion.div
      layout
      {...fadeInUp}
    >
      <GlassCard className="p-0 border-white/5 group h-full flex flex-col hover:border-accent-blue/30 overflow-hidden">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={note.thumbnail || video?.thumbnail || "/images/hero_bg.png"} 
            alt={note.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent" />
          <div className="absolute top-4 right-4 flex gap-2">
            <div className="px-2 py-1 bg-dark/80 backdrop-blur-md rounded border border-white/10 text-[9px] font-black text-white flex items-center gap-1 uppercase tracking-widest">
              <Clock size={10} className="text-accent-cyan" /> {note.time || video?.duration}
            </div>
            <div className="px-2 py-1 bg-dark/80 backdrop-blur-md rounded border border-white/10 text-[9px] font-black text-white flex items-center gap-1 uppercase tracking-widest">
              <Target size={10} className="text-accent-purple" /> {subject?.title}
            </div>
          </div>
          
          {/* Hover Play/View Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-accent-blue/20 backdrop-blur-md border border-accent-blue/40 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.4)]">
              <BookOpen className="text-white ml-0.5" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-8 flex flex-col flex-1">
          <div className="flex gap-2 mb-4">
            {(note.tags || []).slice(0, 2).map((tag, i) => (
              <span key={i} className="text-[9px] font-black text-accent-blue/60 uppercase tracking-widest flex items-center gap-1">
                <Tag size={8} /> {tag}
              </span>
            ))}
          </div>

          <h3 className="text-xl font-black mb-4 italic group-hover:text-accent-blue transition-colors line-clamp-1 uppercase tracking-tight">
            {note.title}
          </h3>
          
          <p className="text-gray-400 text-sm font-light leading-relaxed line-clamp-2 mb-8">
            {note.description}
          </p>

          <div className="mt-auto grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 bg-white/[0.03] border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all text-gray-300 hover:text-white">
              <Download size={14} className="text-accent-cyan" /> PDF
            </button>
            {note.videoId && (
              <Link to={`/video/${note.videoId}`} className="flex items-center justify-center gap-2 py-3 bg-accent-purple/10 border border-accent-purple/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent-purple hover:text-white transition-all text-accent-purple">
                <Play size={14} /> Video
              </Link>
            )}
          </div>
          
          <div className="mt-6 flex items-center justify-between pt-6 border-t border-white/5">
             <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">{subject?.subcategory}</span>
             <Link to={`/notes?id=${note.id}`} className="flex items-center gap-2 text-accent-blue font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-3 group-hover:translate-x-0">
                Detailed View <ChevronRight size={14} />
             </Link>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
