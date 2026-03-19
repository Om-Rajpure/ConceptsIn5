import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../utils/AdminContext';
import { motion } from 'framer-motion';
import { Lock, User, Sparkles } from 'lucide-react';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAdmin();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const result = await login(username, password);
        if (result.success) {
            navigate('/om');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-accent-blue/10 blur-[120px] animate-pulse-glow" />
            <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-accent-purple/10 blur-[120px] animate-pulse-glow" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 glass-card border-white/10 z-10"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-accent-cyan/30 text-accent-cyan text-[10px] font-black uppercase tracking-widest rounded bg-accent-cyan/5">
                        <Sparkles size={12} /> Secure Access
                    </div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase text-gradient">
                        Om's Dashboard
                    </h1>
                    <p className="text-gray-500 text-sm mt-2 uppercase tracking-widest font-bold">
                        ConceptsIn5 CMS
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Username</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                <User size={18} />
                            </span>
                            <input 
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-accent-blue outline-none transition-colors"
                                placeholder="Enter admin username"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Password</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                <Lock size={18} />
                            </span>
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-accent-purple outline-none transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest rounded-xl text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl font-black text-white uppercase tracking-widest shadow-[0_10px_30px_rgba(123,97,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Enter System'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
