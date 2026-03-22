import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, ChevronRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full relative z-10"
      >
        <GlassCard className="p-16 border-white/5 bg-white/[0.02] text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent animate-shimmer" />
          
          <div className="mb-12 flex justify-center">
            <div className="relative">
              <AlertTriangle size={80} className="text-red-500 opacity-80" />
              <div className="absolute inset-0 bg-red-500/20 blur-2xl animate-pulse" />
            </div>
          </div>

          <h1 className="text-8xl font-black italic mb-4 glow-text tracking-tighter text-white opacity-90">
            404
          </h1>
          
          <h2 className="text-2xl font-black italic mb-6 text-accent-blue uppercase tracking-widest">
            Neural Roadmap Fragment Missing
          </h2>

          <p className="text-gray-400 font-light mb-12 max-w-md mx-auto leading-relaxed">
            The archive path you are attempting to access has been corrupted or does not exist in the current knowledge nexus.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/" 
              className="px-10 py-4 bg-accent-blue text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center gap-3 shadow-[0_10px_30px_rgba(0,240,255,0.3)] hover:scale-105 active:scale-95 transition-all"
            >
              <Home size={18} /> Initialize Home Sync
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="px-10 py-4 bg-white/5 border border-white/10 text-gray-300 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-white/10 hover:border-white/20 transition-all"
            >
              Back To Previous <ChevronRight size={18} />
            </button>
          </div>

          {/* Scifi Details */}
          <div className="mt-16 pt-8 border-t border-white/5 flex justify-between items-center text-[8px] font-black text-gray-700 tracking-[0.3em] uppercase">
            <span>Err_Code: ARCHIVE_NOT_FOUND</span>
            <span>ConceptsIn5 // Nexus_OS</span>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
