import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Search, Play, BookOpen, Target, Lock, ShieldCheck, Youtube, Instagram, Linkedin } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdmin } from '../utils/AdminContext';
import { globalSearch } from '../utils/search';
import { subjects } from '../data/subjects';
import { videos } from '../data/videos';
import { notes } from '../data/notes';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAdmin();

  // Live suggestions logic
  const suggestions = useMemo(() => {
    if (searchQuery.length < 2) return { subjects: [], videos: [], notes: [] };
    const results = globalSearch(searchQuery, { subjects, videos, notes });
    return {
      subjects: results.subjects.slice(0, 2),
      videos: results.videos.slice(0, 2),
      notes: results.notes.slice(0, 2)
    };
  }, [searchQuery]);

  const hasSuggestions = suggestions.subjects.length > 0 || suggestions.videos.length > 0 || suggestions.notes.length > 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchFocused(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Notes', href: '/notes' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav 
      className={`fixed top-0 w-full z-[100] transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-dark/80 backdrop-blur-xl border-white/10 py-3 shadow-lg shadow-purple-500/5' 
          : 'bg-transparent border-transparent py-5'
      }`}
    >
      {/* Animated Glowing Border Bottom */}
      <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-purple to-transparent opacity-0 transition-opacity duration-500 ${isScrolled ? 'opacity-30' : ''}`} />

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4 md:gap-8">
        {/* Logo - Left */}
        <Link to="/" className="flex-none">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-black tracking-tighter cursor-pointer group"
          >
            <span className="text-gradient drop-shadow-[0_0_10px_rgba(123,97,255,0.3)] whitespace-nowrap">ConceptsIn5</span>
          </motion.div>
        </Link>

        {/* Search Bar - Center (Desktop) */}
        <div className="hidden md:flex flex-1 justify-center max-w-xl mx-auto">
          <div className="relative w-full group">
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text"
                placeholder="Search topics..."
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-[11px] text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/50 transition-all"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-accent-blue transition-colors" />
            </form>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {isSearchFocused && hasSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 w-full mt-2 bg-dark/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl z-50 overflow-hidden"
                >
                  <div className="space-y-4">
                    {suggestions.subjects.map(s => (
                      <Link key={s.id} to={`/subject/${s.id}`} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors group">
                        <div className="p-1.5 bg-accent-purple/10 rounded text-accent-purple border border-accent-purple/20">
                          <Target size={14} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="text-[10px] text-white font-bold truncate">{s.title}</div>
                          <div className="text-[8px] text-gray-500 uppercase tracking-widest">{s.subcategory}</div>
                        </div>
                      </Link>
                    ))}
                    {suggestions.videos.map(v => (
                      <Link key={v.id} to={`/video/${v.id}`} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <div className="p-1.5 bg-accent-blue/10 rounded text-accent-blue border border-accent-blue/20">
                          <Play size={14} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="text-[10px] text-white font-bold truncate">{v.title}</div>
                          <div className="text-[8px] text-gray-500 uppercase tracking-widest">Video Module</div>
                        </div>
                      </Link>
                    ))}
                    {suggestions.notes.map(n => (
                      <Link key={n.id} to={`/notes?id=${n.id}`} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <div className="p-1.5 bg-accent-cyan/10 rounded text-accent-cyan border border-accent-cyan/20">
                          <BookOpen size={14} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="text-[10px] text-white font-bold truncate">{n.title}</div>
                          <div className="text-[8px] text-gray-500 uppercase tracking-widest">Study Note</div>
                        </div>
                      </Link>
                    ))}
                    <button 
                      onClick={handleSearch}
                      className="w-full pt-2 mt-2 border-t border-white/5 text-[9px] font-black text-accent-blue uppercase tracking-[0.2em] text-center hover:text-white transition-colors"
                    >
                      View All Results
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Links - Right (Desktop) */}
        <div className="hidden md:flex flex-none items-center gap-8 ml-auto">
          {navLinks.map((link, i) => {
            const isActive = link.href === '/' 
              ? location.pathname === '/' || location.pathname === '/home'
              : location.pathname.startsWith(link.href);
            
            return (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={link.href}
                  className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors relative group whitespace-nowrap ${
                    isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-[2px] bg-accent-purple transition-all duration-300 ${
                    isActive ? 'w-full shadow-[0_0_8px_#7B61FF]' : 'w-0 group-hover:w-full group-hover:shadow-[0_0_8px_#7B61FF]'
                  }`} />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center">
          <button 
            className="text-white p-2 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="md:hidden bg-dark/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col gap-6 p-8">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input 
                  type="text"
                  placeholder="Scan topics..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-accent-blue transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              </form>

              {/* Mobile Links */}
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => {
                  const isActive = link.href === '/' 
                    ? location.pathname === '/' || location.pathname === '/home'
                    : location.pathname.startsWith(link.href);
                  
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      className={`text-lg font-black uppercase tracking-widest transition-colors py-2 border-b border-white/5 last:border-0 ${
                        isActive ? 'text-accent-purple' : 'text-gray-300 hover:text-accent-purple'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              <Link 
                to="/notes" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-5 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl font-black text-white text-center uppercase tracking-widest text-sm shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
              >
                Start Learning
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>

  );
}
