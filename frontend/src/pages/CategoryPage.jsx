import { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Layers, 
  Video, 
  Clock, 
  Play,
  ChevronRight,
  Sparkles,
  Library
} from 'lucide-react';
import { categories } from '../data/categories';
import GlassCard from '../components/GlassCard';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function CategoryPage() {
  const { id } = useParams();
  const category = useMemo(() => categories.find(c => c.id === id), [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-4xl font-black mb-4 italic">Category Not Found</h2>
          <Link to="/" className="text-accent-blue hover:underline uppercase tracking-widest text-sm font-black">Return to Base</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32">
      {/* 1. Category Hero */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-blue/10 blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-purple/10 blur-[150px] animate-pulse-glow" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 glass-card border-accent-cyan/30 text-accent-cyan text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <Library className="w-4 h-4" /> Knowledge Hive Section
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-black mb-8 italic tracking-tighter leading-none"
          >
            {category.name}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed mb-12"
          >
            {category.description}
          </motion.p>

          <div className="flex justify-center gap-8 text-xs font-black uppercase tracking-[0.3em] text-gray-500">
             <div className="flex items-center gap-2"><Sparkles size={14} className="text-accent-blue" /> Verified Content</div>
             <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-ping" /> Global Access</div>
          </div>
        </div>
      </section>

      {/* 2. Grouped Subjects Content */}
      <div className="max-w-7xl mx-auto px-6 space-y-32">
        {category.subcategories.map((group, groupIdx) => (
          <motion.section 
            key={group.name}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Group Title Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/5 pb-10">
              <div>
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  className="text-accent-purple text-[10px] font-black uppercase tracking-[0.4em] mb-4"
                >
                  PHASE {String(groupIdx + 1).padStart(2, '0')}
                </motion.div>
                <h2 className="text-4xl md:text-6xl font-black italic glow-text tracking-tighter">{group.name}</h2>
              </div>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                {group.items.length} Units Available
              </p>
            </div>

            {/* Subjects Grid/Scroll */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
              {group.items.map((subject, subIdx) => (
                <Link to={`/subject/${subject.id}`} key={subject.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: subIdx * 0.1 }}
                    className="group"
                  >
                    {/* 9:16 Subject Card */}
                    <GlassCard className="p-0 border-white/5 bg-white/[0.01] hover:border-accent-blue/30 transition-all overflow-hidden flex flex-col h-full">
                      {/* 16:9 Subject Card */}
                      <div className="relative aspect-video overflow-hidden">
                        <img 
                          src={subject.thumbnail || "/images/hero_bg.png"} 
                          alt={subject.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        {/* Gradient Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />
                        <div className="absolute inset-0 bg-accent-blue/5 group-hover:bg-accent-blue/10 transition-colors" />
                        
                        {/* Hover Play Icon Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                           <div className="w-16 h-16 rounded-full bg-accent-blue/20 backdrop-blur-md border border-accent-blue/40 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.4)]">
                             <Play className="text-white fill-current ml-1" />
                           </div>
                        </div>

                        {/* Subject Metadata Badges */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                           <div className="px-2 py-1 bg-dark/80 backdrop-blur-md rounded border border-white/10 text-[9px] font-black text-white flex items-center gap-1 uppercase tracking-widest">
                             <Video size={10} className="text-accent-blue" /> {subject.videoCount}
                           </div>
                           <div className="px-2 py-1 bg-dark/80 backdrop-blur-md rounded border border-white/10 text-[9px] font-black text-white flex items-center gap-1 uppercase tracking-widest">
                             <Clock size={10} className="text-accent-cyan" /> {subject.duration}
                           </div>
                        </div>
                      </div>

                      {/* Subject Info */}
                      <div className="p-6 md:p-8 flex flex-col flex-1">
                        <h3 className="text-xl md:text-2xl font-black mb-3 italic group-hover:text-accent-blue transition-colors line-clamp-1 uppercase tracking-tight">{subject.title}</h3>
                        <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-light line-clamp-2 mb-6">{subject.description}</p>
                        
                        <div className="mt-auto flex items-center justify-between text-accent-blue font-black text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all">
                           <span>Initialize</span>
                           <ChevronRight size={16} />
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* 3. Final Call to Action */}
      <section className="mt-40 px-6 max-w-4xl mx-auto text-center">
        <GlassCard className="p-16 border-accent-purple/20 bg-accent-purple/[0.02]">
           <h3 className="text-4xl font-black mb-8 italic glow-text">Missing Something?</h3>
           <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto font-light">
             Our AI search agents are constantly scanning for new subjects. 
             If you need a specific module, request it in the command center.
           </p>
           <button className="px-12 py-5 bg-white text-dark rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-[0_10px_40px_rgba(255,255,255,0.2)]">
             Request Subject
           </button>
        </GlassCard>
      </section>
    </div>
  );
}
