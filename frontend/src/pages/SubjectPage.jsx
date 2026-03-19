import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Clock, 
  Zap, 
  ChevronRight, 
  BookOpen,
  Layout as LayoutIcon,
  Target,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { subjects } from '../data/subjects';
import GlassCard from '../components/GlassCard';

export default function SubjectPage() {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All');
  
  // Find current subject
  const subject = useMemo(() => subjects.find(s => s.id === id), [id]);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Filtering Logic
  const filteredTopics = useMemo(() => {
    if (!subject) return [];
    return subject.topics.filter(topic => {
      const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'All' || topic.difficulty === difficultyFilter;
      const matchesTime = timeFilter === 'All' || 
                         (timeFilter === '5 min' && topic.time === '5 min') || 
                         (timeFilter === '10 min+' && (topic.time === '10 min' || topic.time === '15 min'));
      return matchesSearch && matchesDifficulty && matchesTime;
    });
  }, [subject, searchQuery, difficultyFilter, timeFilter]);

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-4xl font-black mb-4">Subject Not Found</h2>
          <Link to="/" className="text-accent-blue hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="pt-32 pb-20 px-6">
      {/* Subject Hero Section */}
      <section className="max-w-7xl mx-auto mb-20 relative">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-accent-blue/10 blur-[120px] rounded-full animate-pulse-glow" />
        
        <div className="relative z-10">
          <motion.div {...fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-accent-purple/30 text-accent-purple text-[10px] font-black uppercase tracking-widest rounded bg-accent-purple/5">
             <Target className="w-3 h-3" /> Learning Path Initialized
          </motion.div>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
            <div className="max-w-3xl">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight"
              >
                {subject.name}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-400 font-light leading-relaxed"
              >
                {subject.description}
              </motion.p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4"
            >
              <div className="glass-card px-6 py-4 border-white/5 bg-white/[0.02]">
                <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Topics</div>
                <div className="text-2xl font-black text-white">{subject.topics.length}</div>
              </div>
              <div className="glass-card px-6 py-4 border-white/5 bg-white/[0.02]">
                <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Duration</div>
                <div className="text-2xl font-black text-accent-cyan">{subject.duration}</div>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-wrap gap-4 mt-12">
            <button 
              onClick={() => document.getElementById('roadmap').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-accent-purple rounded-xl font-black text-white shadow-lg shadow-accent-purple/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              Start Mission <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 border border-white/10 glass-card rounded-xl font-bold text-gray-300 hover:text-white transition-all">
              Important Topics
            </button>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="max-w-7xl mx-auto mb-16 relative z-20">
        <div className="glass-card p-4 md:p-6 border-white/10 bg-white/[0.03] flex flex-col md:flex-row gap-6 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-blue transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search topic in database..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/10 transition-all placeholder:text-gray-600"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative group flex-1 md:w-40">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
              <select 
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent-purple/50 appearance-none cursor-pointer"
              >
                <option value="All">Difficulty: All</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronRight className="rotate-90" size={16} />
              </div>
            </div>

            <div className="relative group flex-1 md:w-40">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
              <select 
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent-cyan/50 appearance-none cursor-pointer"
              >
                <option value="All">Time: All</option>
                <option value="5 min">5 min</option>
                <option value="10 min+">10 min+</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronRight className="rotate-90" size={16} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Roadmap & Topics Container */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
        
        {/* Roadmap Visualization (Left) */}
        <aside id="roadmap" className="lg:w-1/3 relative">
          <div className="sticky top-32">
            <h3 className="text-2xl font-black mb-10 flex items-center gap-3">
              <LayoutIcon className="text-accent-purple" /> Roadmap
            </h3>
            
            <div className="space-y-0 relative pl-4">
              {/* Connecting Line */}
              <div className="absolute left-[23px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-accent-purple via-accent-blue to-accent-cyan opacity-20" />
              
              {subject.topics.map((topic, i) => (
                <motion.div 
                  key={topic.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pb-10 group cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div className="relative z-10 w-5 h-5 rounded-full bg-dark border-2 border-accent-purple group-hover:scale-125 group-hover:bg-accent-purple group-hover:shadow-[0_0_15px_#7B61FF] transition-all duration-300">
                      <div className="absolute inset-0 bg-accent-purple rounded-full animate-ping opacity-0 group-hover:opacity-30" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-black text-gray-500 tracking-[0.2em] mb-1">STEP {i + 1}</div>
                      <h4 className="font-bold text-gray-300 group-hover:text-white group-hover:translate-x-1 transition-all">
                        {topic.title}
                      </h4>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 p-8 glass-card border-accent-blue/10 bg-accent-blue/[0.02]">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="text-accent-blue" />
                <span className="font-black text-sm uppercase tracking-widest text-white">Efficiency Meter</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '85%' }}
                  className="h-full bg-gradient-to-r from-accent-blue to-accent-purple" 
                />
              </div>
              <p className="mt-4 text-xs text-gray-500 font-medium italic">You are following an optimized path designed for 3x retention.</p>
            </div>
          </div>
        </aside>

        {/* Topics Grid (Right) */}
        <main className="lg:w-2/3">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black">All Topics</h3>
            <div className="text-sm text-gray-500 font-medium">Showing {filteredTopics.length} Results</div>
          </div>

          <AnimatePresence mode="popLayout">
            <div className="grid gap-6">
              {filteredTopics.length > 0 ? (
                filteredTopics.map((topic, i) => (
                  <motion.div
                    key={topic.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link to={`/topic/${topic.id}`}>
                      <GlassCard 
                        glow 
                        neonColor={topic.difficulty === 'Hard' ? 'purple' : 'blue'}
                        className="p-8 border-white/5 group bg-white/[0.02] hover:bg-white/[0.04]"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                                topic.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                topic.difficulty === 'Medium' ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20' :
                                'bg-accent-purple/10 text-accent-purple border border-accent-purple/20'
                              }`}>
                                {topic.difficulty}
                              </div>
                              <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                <Clock size={12} className="text-accent-cyan" /> {topic.time}
                              </div>
                            </div>
                            <h3 className="text-2xl font-black mb-3 text-white group-hover:text-accent-blue transition-colors italic">
                              {topic.title}
                            </h3>
                            <p className="text-gray-400 text-base leading-relaxed font-light">
                              {topic.description}
                            </p>
                          </div>
                          
                          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/[0.05] group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-[0_0_20px_rgba(0,240,255,0.05)] border border-white/5 group-hover:border-accent-purple/30">
                            <Zap className="text-accent-purple" size={24} />
                          </div>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                              {[1,2,3].map(j => (
                                <div key={j} className="w-6 h-6 rounded-full border border-dark bg-gray-800" />
                              ))}
                            </div>
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">4.2k Students Learned</span>
                           </div>
                           <div className="flex items-center gap-2 text-accent-cyan group-hover:text-white transition-colors font-black text-[10px] uppercase tracking-widest">
                             Deploy Knowledge <ChevronRight size={14} />
                           </div>
                        </div>
                      </GlassCard>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center glass-card border-dashed border-white/10"
                >
                  <p className="text-gray-500 font-bold mb-4">No topics match your current filters.</p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setDifficultyFilter('All');
                      setTimeFilter('All');
                    }}
                    className="text-accent-blue hover:underline font-black text-xs uppercase"
                  >
                    Clear Database Filters
                  </button>
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
