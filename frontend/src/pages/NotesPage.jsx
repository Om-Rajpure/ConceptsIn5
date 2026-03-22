import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
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
  Target,
  Loader2
} from 'lucide-react';
import { globalSearch } from '../utils/search';
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

  const [notes, setNotes] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [nRes, sRes, vRes, cRes, scRes] = await Promise.all([
        axios.get('/api/public/notes/'),
        axios.get('/api/public/subjects/'),
        axios.get('/api/public/videos/'),
        axios.get('/api/public/categories/'),
        axios.get('/api/public/subcategories/')
      ]);

      // Map API data to UI structure if needed
      const mappedNotes = (nRes.data.results || nRes.data).map(note => ({
        ...note,
        subjectId: note.subject,
        videoId: note.video,
        description: note.content.substring(0, 150) + '...'
      }));

      const mappedSubjects = (sRes.data.results || sRes.data).map(s => ({
        ...s,
        title: s.name // globalSearch expects title
      }));

      const mappedVideos = (vRes.data.results || vRes.data).map(v => ({
        ...v,
        title: v.title // already title? Let's check serializer
      }));

      setNotes(mappedNotes);
      setAllSubjects(mappedSubjects);
      setVideos(mappedVideos);
      setCategories(cRes.data.results || cRes.data);
      setSubcategories(scRes.data.results || scRes.data);
    } catch (error) {
      console.error("Critical failure in neural data link:", error);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique values for filters from dynamic data
  const categoryOptions = useMemo(() => ["All", ...categories.map(c => ({ id: c.id, name: c.name }))], [categories]);
  
  const subcategoryOptions = useMemo(() => {
    const list = subcategories
      .filter(sc => selectedCategory === "All" || sc.category === parseInt(selectedCategory))
      .map(sc => ({ id: sc.id, name: sc.name }));
    return ["All", ...list];
  }, [subcategories, selectedCategory]);

  const subjectOptions = useMemo(() => {
    const subs = allSubjects
      .filter(s => {
        const matchesCategory = selectedCategory === "All" || 
          subcategories.find(sc => sc.id === s.subcategory)?.category === parseInt(selectedCategory);
        const matchesSubcategory = selectedSubcategory === "All" || s.subcategory === parseInt(selectedSubcategory);
        return matchesCategory && matchesSubcategory;
      });
    return ["All", ...subs.map(s => ({ id: s.id, name: s.name }))];
  }, [allSubjects, selectedCategory, selectedSubcategory, subcategories]);
  
  const types = ["All", ...new Set(notes.map(n => n.type).filter(Boolean))];

  const filteredNotes = useMemo(() => {
    if (loading) return [];
    
    // If no search query, use all notes as the base
    let baseNotes = notes;
    if (searchQuery && searchQuery.trim() !== "") {
      const searchResults = globalSearch(searchQuery, { subjects: allSubjects, videos, notes });
      baseNotes = searchResults.notes;
    }
    
    // Further filter by other dropdowns
    return baseNotes.filter(note => {
      const subject = allSubjects.find(s => s.id === note.subjectId);
      if (!subject) return false;

      const subcat = subcategories.find(sc => sc.id === subject.subcategory);
      const matchesCategory = selectedCategory === "All" || subcat?.category === parseInt(selectedCategory);
      const matchesSubcategory = selectedSubcategory === "All" || subject.subcategory === parseInt(selectedSubcategory);
      const matchesSubject = selectedSubject === "All" || note.subjectId === parseInt(selectedSubject);
      const matchesType = selectedType === "All" || note.type === selectedType;

      return matchesCategory && matchesSubcategory && matchesSubject && matchesType;
    });
  }, [searchQuery, selectedCategory, selectedSubcategory, selectedSubject, selectedType, notes, allSubjects, subcategories, videos, loading]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedSubcategory("All");
    setSelectedSubject("All");
    setSelectedType("All");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-12 h-12 text-accent-purple animate-spin" />
          <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-xs">Synchronizing Neural Link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 relative overflow-hidden bg-dark">
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
                  onChange={(val) => { setSelectedCategory(val); setSelectedSubcategory("All"); setSelectedSubject("All"); }} 
                />
                <FilterSelect 
                  label="Subcategory" 
                  value={selectedSubcategory} 
                  options={subcategoryOptions} 
                  onChange={(val) => { setSelectedSubcategory(val); setSelectedSubject("All"); }}
                  disabled={selectedCategory === "All"}
                />
                <FilterSelect 
                  label="Subject" 
                  value={selectedSubject} 
                  options={subjectOptions} 
                  onChange={setSelectedSubject} 
                  disabled={selectedSubcategory === "All"}
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
                <QuickFilter label="Recently Added" onClick={() => clearFilters()} />
                <QuickFilter label="Quick Revise" onClick={() => setSelectedType("Theory")} />
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
                  <NoteCard key={note.id} note={note} allSubjects={allSubjects} videos={videos} />
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

function FilterSelect({ label, value, options, onChange, disabled }) {
  return (
    <div className={`flex flex-col gap-2 ${disabled ? 'opacity-30 pointer-events-none' : ''}`}>
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{label}</span>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-accent-purple transition-all appearance-none cursor-pointer uppercase tracking-tighter w-full"
      >
        {options.map((opt, i) => (
          <option key={i} value={typeof opt === 'object' ? opt.id : opt} className="bg-dark text-white">
            {typeof opt === 'object' ? opt.name : opt}
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

function NoteCard({ note, allSubjects, videos }) {
  const subject = allSubjects.find(s => s.id === note.subjectId);
  const video = videos.find(v => v.id === note.videoId);

  return (
    <motion.div
      layout
      {...fadeInUp}
    >
      <GlassCard className="p-0 border-white/5 group h-full flex flex-col hover:border-accent-blue/30 overflow-hidden bg-white/[0.01]">
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
              <Clock size={10} className="text-accent-cyan" /> {note.time || video?.duration || '10:00'}
            </div>
            <div className="px-2 py-1 bg-dark/80 backdrop-blur-md rounded border border-white/10 text-[9px] font-black text-white flex items-center gap-1 uppercase tracking-widest">
              <Target size={10} className="text-accent-purple" /> {subject?.name || 'Knowledge'}
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
            {(note.tags || 'Intel').split(',').slice(0, 2).map((tag, i) => (
              <span key={i} className="text-[9px] font-black text-accent-blue/60 uppercase tracking-widest flex items-center gap-1">
                <Tag size={8} /> {tag.trim()}
              </span>
            ))}
          </div>

          <h3 className="text-xl font-black mb-4 italic group-hover:text-accent-blue transition-colors line-clamp-1 uppercase tracking-tight">
            {note.title}
          </h3>
          
          <p className="text-gray-400 text-sm font-light leading-relaxed line-clamp-2 mb-8">
            {note.content}
          </p>

          <div className="mt-auto grid grid-cols-2 gap-4">
            {note.pdf_file ? (
                <a href={note.pdf_file} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 bg-white/[0.03] border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all text-gray-300 hover:text-white">
                  <Download size={14} className="text-accent-cyan" /> PDF
                </a>
            ) : (
                <button disabled className="flex items-center justify-center gap-2 py-3 bg-white/[0.01] border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-700 cursor-not-allowed">
                  No PDF
                </button>
            )}
            
            {note.videoId && (
              <Link to={`/video/${note.videoId}`} className="flex items-center justify-center gap-2 py-3 bg-accent-purple/10 border border-accent-purple/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent-purple hover:text-white transition-all text-accent-purple">
                <Play size={14} /> Video
              </Link>
            )}
          </div>
          
          <div className="mt-6 flex items-center justify-between pt-6 border-t border-white/5">
             <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">Intel Stream</span>
             <Link to={`/notes?id=${note.id}`} className="flex items-center gap-2 text-accent-blue font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-3 group-hover:translate-x-0">
                Detailed View <ChevronRight size={14} />
             </Link>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
