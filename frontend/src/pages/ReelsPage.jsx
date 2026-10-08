import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { Zap, Play, ArrowLeft, Search, Youtube } from 'lucide-react';
import { getYoutubeThumbnail } from '../utils/youtubeUtils';
import { Link } from 'react-router-dom';
import SkeletonCard from '../components/SkeletonCard';
import ErrorState from '../components/ErrorState';

const fallbackReels = [
  { id: 1, title: 'Linear Regression in ML', video_url: 'https://www.youtube.com/shorts/2_-boldmaFQ', description: 'How linear regression models relationships and optimizes loss.' },
  { id: 2, title: 'How Best Fit Line is Calculated in Linear Regression', video_url: 'https://www.youtube.com/shorts/HiMaBCL-6Qg', description: 'Ordinary Least Squares analytical line of best fit derivation.' },
  { id: 3, title: 'Categorical Data Types: Nominal, Ordinal, Binary', video_url: 'https://www.youtube.com/shorts/-Rs2pnuBJF4', description: 'Encoding categorical features without introducing false numerical order.' },
  { id: 4, title: 'Machine Learning: Learning from Data', video_url: 'https://www.youtube.com/shorts/SKKJ9rC3dSg', description: 'Supervised vs Unsupervised learning core intuition.' },
  { id: 5, title: 'AI vs ML vs Deep Learning Hierarchy', video_url: 'https://www.youtube.com/shorts/5Ajp5oPinJs', description: 'Concentric hierarchy of modern artificial intelligence.' },
  { id: 6, title: 'SQL & Cloud Database Architectures', video_url: 'https://www.youtube.com/shorts/SbTs57YD1CA', description: 'Relational database fundamentals and managed Cloud SQL.' },
  { id: 7, title: 'Git Commit & Version Control for Developers', video_url: 'https://www.youtube.com/shorts/gQC91u6Sdt0', description: 'Essential version control practices for engineering projects.' }
];

export default function ReelsPage() {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchReels = async () => {
            setLoading(true);
            try {
                const response = await api.get('/api/public/reels/');
                const data = response.data.results || response.data;
                if (Array.isArray(data) && data.length > 0) {
                    setReels(data);
                } else {
                    setReels(fallbackReels);
                }
            } catch (err) {
                console.warn('Using verified fallback reels:', err);
                setReels(fallbackReels);
            } finally {
                setLoading(false);
            }
        };
        fetchReels();
    }, []);

    const filteredReels = reels.filter(reel => 
        reel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (reel.description && reel.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-dark text-white pt-24 md:pt-32 px-6 md:px-12 pb-24 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-full h-[30vh] bg-gradient-to-b from-accent-purple/10 to-transparent -z-0" style={{ willChange: "opacity" }} />
            
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
                    <div className="max-w-2xl">
                        <Link to="/" className="flex items-center gap-2 text-accent-blue hover:text-white transition-colors mb-6 group font-black uppercase tracking-widest text-[10px]">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
                        </Link>
                        <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase glow-text mb-6">
                            Quick <span className="text-gradient">Concepts</span>
                        </h1>
                        <p className="text-gray-400 text-lg font-light leading-relaxed">
                            Concise 60-second concept summaries designed for rapid understanding and exam revision.
                        </p>
                    </div>

                    <div className="w-full md:w-96 relative group">
                        <div className="absolute -inset-1 bg-accent-blue/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search concepts..." 
                            className="relative w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-accent-blue/30 transition-all font-medium backdrop-blur-md"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                    {loading ? (
                        [...Array(10)].map((_, i) => (
                            <div key={i} className="aspect-[9/16] animate-pulse glass-card bg-white/5" />
                        ))
                    ) : filteredReels.length > 0 ? (
                        filteredReels.map((reel, i) => (
                            <motion.a 
                                href={reel.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={reel.id || i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                style={{ willChange: "transform, opacity" }}
                                className="group relative aspect-[9/16] rounded-2xl overflow-hidden border border-white/5 bg-dark shadow-2xl transition-all hover:border-accent-blue/30"
                            >
                                <img 
                                    src={reel.thumbnail || getYoutubeThumbnail(reel.video_url)} 
                                    alt={reel.title}
                                    className="w-full h-full object-cover opacity-70 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />
                                
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-12 h-12 rounded-full bg-accent-purple/80 backdrop-blur-md flex items-center justify-center shadow-lg">
                                        <Play size={20} className="text-white fill-current ml-0.5" />
                                    </div>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-dark/95 via-dark/70 to-transparent">
                                    <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-accent-cyan mb-1">
                                        <Youtube size={10} className="text-red-500" /> YouTube Shorts
                                    </div>
                                    <h4 className="font-bold text-xs text-white group-hover:text-accent-cyan transition-colors leading-snug line-clamp-2">
                                        {reel.title}
                                    </h4>
                                </div>
                            </motion.a>
                        ))
                    ) : (
                        <div className="col-span-full py-16 text-center glass-card border-dashed border-white/10">
                            <p className="text-gray-400 font-medium text-sm">No concept videos found matching "{searchQuery}".</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
