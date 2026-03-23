import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X, AlertTriangle, Loader2 } from 'lucide-react';

const DeleteConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Delete Confirmation", 
    description = "Are you sure you want to delete this item? This action cannot be undone.",
    loading = false 
}) => {
    
    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // Prevent background scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Overlay */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={loading ? undefined : onClose}
                        className="absolute inset-0 bg-dark/80 backdrop-blur-md"
                    />

                    {/* Modal Card */}
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.3 }}
                        className="w-full max-w-md glass-card border-white/10 p-8 relative z-10 rounded-[32px] shadow-2xl overflow-hidden"
                    >
                        {/* Status Light at Top */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/50 via-red-500 to-red-500/50" />
                        
                        {/* Icon and Close Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                                <Trash2 className="text-red-500" size={24} />
                            </div>
                            <button 
                                onClick={onClose}
                                disabled={loading}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Text Content */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mb-3">
                                {title}
                            </h2>
                            <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                {description}
                            </p>
                            
                            {/* Danger Warning Box */}
                            <div className="mt-6 p-4 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center gap-3">
                                <AlertTriangle className="text-red-500/70" size={18} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-red-500/70">Warning: Terminal Execution</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 py-4 glass-card border-white/5 text-gray-400 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all rounded-xl hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Abort
                            </button>
                            <button 
                                onClick={onConfirm}
                                disabled={loading}
                                className="flex-[2] py-4 bg-red-500 rounded-xl text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-500/20 hover:bg-red-600 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" /> Purging...
                                    </>
                                ) : (
                                    "Confirm Purge"
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DeleteConfirmModal;
