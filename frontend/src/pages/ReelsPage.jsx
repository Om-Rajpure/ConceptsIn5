import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Zap, Play, ArrowLeft, Search, Database } from 'lucide-react';
import { getYoutubeThumbnail } from '../utils/youtubeUtils';
import { Link } from 'react-router-dom';
import SkeletonCard from '../components/SkeletonCard';
import ErrorState from '../components/ErrorState';

export default function ReelsPage() {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchReels = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/public/reels/');
                setReels(response.data.results || response.data);
            } catch (err) {
                console.error('Failed to fetch reels', err);
                setError('Neural synchronization with the Reels nexus failed.');
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

    if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

    return (
        <div className="min-h-screen bg-dark text-white pt-24 md:pt-32 px-6 md:px-12 pb-24 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-full h-[30vh] bg-gradient-to-b from-accent-purple/10 to-transparent -z-0" style={{ willChange: "opacity" }} />
            
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
                    <div className="max-w-2xl">
                        <Link to="/" className="flex items-center gap-2 text-accent-blue hover:text-white transition-colors mb-6 group font-black uppercase tracking-widest text-[10px]">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Return to Base
                        </Link>
                        <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase glow-text mb-6">
                            Nexus <span className="text-gradient">Reels</span>
                        </h1>
                        <p className="text-gray-400 text-lg font-light leading-relaxed">
                            High-density concepts delivered in explosive 60-second bursts. 
                            Optimized for rapid knowledge ingestion.
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
                                href={reel.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={reel.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                style={{ willChange: "transform, opacity" }}
                                className="group relative aspect-[9/16] rounded-2xl overflow-hidden border border-white/5 bg-dark shadow-2xl transition-all hover:border-accent-blue/30"
                            >
                                <img 
                                    src={reel.thumbnail || getYoutubeThumbnail(reel.link)} 
                                    alt={reel.title}
                                    className="w-full h-full object-cover opacity-70 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />
                                
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity">
                                    <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center pl-1">
                                        <Play size={24} fill="white" />
                                    </div>
                                </div>

                                <div className="absolute inset-x-0 bottom-0 p-6 z-10">
                                    <div className="w-8 h-8 rounded-full bg-accent-blue/20 backdrop-blur-md flex items-center justify-center mb-3 group-hover:bg-accent-blue transition-all border border-accent-blue/30">
                                        <Zap size={14} className="text-white fill-current" />
                                    </div>
                                    <h3 className="text-sm md:text-base font-black italic uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-accent-blue transition-colors">
                                        {reel.title}
                                    </h3>
                                </div>
                            </motion.a>
                        ))
                    ) : (
                        <div className="col-span-full py-40 text-center glass-card border-dashed border-white/10">
                             <div className="text-5xl mb-6 opacity-40">🛸</div>
                             <h3 className="text-2xl font-black italic uppercase tracking-widest opacity-40">Concept Not Found</h3>
                             <p className="text-gray-600 mt-2 font-medium">The specific neural data point does not exist in our active archives.</p>
                             <button 
                                onClick={() => setSearchQuery('')}
                                className="mt-8 text-accent-blue font-black uppercase tracking-widest text-[10px] hover:text-white transition-all underline underline-offset-8"
                             >
                                 Clear Search Parameters
                             </button>
                        </div>
                    )}
                </div>

                {/* Footer Stats */}
                {!loading && filteredReels.length > 0 && (
                    <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-accent-blue/10 border border-accent-blue/20">
                                <Database className="text-accent-blue" size={20} />
                            </div>
                            <div>
                                <div className="text-xl font-black tracking-tighter">{reels.length}</div>
                                <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Nexus Units Synced</div>
                            </div>
                        </div>
                        <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">
                            End of Transmission — More Units Pending
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
