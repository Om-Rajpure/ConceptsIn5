import React from 'react';
import { RefreshCw, AlertTriangle, DatabaseZap } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

/**
 * Premium Error State Component
 * @param {string} message - User-friendly error message
 * @param {function} onRetry - Function to trigger re-fetch
 * @param {boolean} isFullPage - If true, adds centered padding/min-height
 */
export default function ErrorState({ message, onRetry, isFullPage = true }) {
  return (
    <div className={isFullPage ? "min-h-[60vh] flex items-center justify-center px-6" : "p-6"}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        <GlassCard className="p-10 border-red-500/20 bg-red-500/[0.02] text-center overflow-hidden relative group">
          {/* Animated Glow Background */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-red-500/10 blur-[80px] group-hover:bg-red-500/20 transition-all duration-700" />
          
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_-12px_rgba(239,68,68,0.3)]">
              <DatabaseZap size={40} className="text-red-500 animate-pulse" />
            </div>

            <h2 className="text-3xl font-black mb-4 italic tracking-tighter uppercase text-white">
              Neural Link Interrupted
            </h2>

            <p className="text-gray-400 text-lg mb-10 font-light leading-relaxed">
              {message || "Our data streams have encountered a disruption. The synchronization with the backend core failed."}
            </p>

            <button
              onClick={onRetry}
              className="group relative px-8 py-4 bg-red-500 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_-5px_rgba(239,68,68,0.5)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center justify-center gap-3">
                <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                Initialize Retry
              </span>
            </button>
            
            <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-red-500/40">
              <AlertTriangle size={10} />
              Error Code: 503_DATA_SYNC_FAILURE
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
