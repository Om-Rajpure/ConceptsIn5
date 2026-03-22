import React from 'react';
import { Inbox, SearchX, Layers, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlassCard from './GlassCard';

/**
 * EmptyState Component
 * @param {Object} props
 * @param {string} props.title - Main heading
 * @param {string} props.message - Descriptive text
 * @param {React.ReactNode} props.icon - Custom icon
 * @param {React.ReactNode} props.action - Action button/Link
 * @param {string} props.type - Preset type ('search', 'data', 'neutral')
 */
export default function EmptyState({ 
  title = "No Data Ripples Detected", 
  message = "The neural archive for this sector is currently empty.", 
  icon, 
  action,
  type = "data" 
}) {
  const navigate = useNavigate();

  const getIcon = () => {
    if (icon) return icon;
    switch (type) {
      case 'search': return <SearchX size={48} className="text-accent-cyan" />;
      case 'neutral': return <Layers size={48} className="text-accent-purple" />;
      default: return <Inbox size={48} className="text-accent-blue" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center py-24 text-center px-6"
    >
      <GlassCard className="max-w-md w-full p-12 border-white/5 bg-white/[0.01] relative overflow-hidden group">
        {/* Animated Background Decor */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 via-transparent to-accent-purple/5 opacity-50" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-blue/40 to-transparent" />
        
        <div className="relative z-10">
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8 flex justify-center text-accent-blue opacity-80"
          >
            {getIcon()}
          </motion.div>

          <h2 className="text-2xl font-black italic mb-4 glow-text tracking-tighter uppercase">
            {title}
          </h2>

          <p className="text-gray-400 font-light mb-10 leading-relaxed">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {action ? action : (
              <button 
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 text-gray-300"
              >
                <ArrowLeft size={14} /> Back to Nexus
              </button>
            )}
          </div>
        </div>

        {/* HUD Elements */}
        <div className="absolute bottom-4 right-4 text-[8px] font-black text-gray-700 tracking-[0.2em] uppercase">
          Status: Empty_Archive_00
        </div>
        <div className="absolute top-4 left-4 w-4 h-[1px] bg-white/10" />
        <div className="absolute top-4 left-4 w-[1px] h-4 bg-white/10" />
      </GlassCard>
    </motion.div>
  );
}
