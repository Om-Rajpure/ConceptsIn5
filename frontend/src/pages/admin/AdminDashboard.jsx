import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
    Video, 
    BookOpen, 
    FileText, 
    Plus, 
    Settings, 
    LogOut,
    Eye,
    TrendingUp,
    LayoutDashboard
} from 'lucide-react';
import { useAdmin } from '../../utils/AdminContext';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total_videos: 0, total_subjects: 0, total_notes: 0 });
    const { logout, user } = useAdmin();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/admin/stats/');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch stats', error);
            }
        };
        fetchStats();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/om/login');
    };

    return (
        <div className="min-h-screen bg-dark text-white p-6 md:p-12 relative overflow-hidden">
            {/* Admin Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 relative z-10">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase text-gradient flex items-center gap-3">
                        <LayoutDashboard className="text-accent-blue" /> Control Center
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">
                        Logged in as <span className="text-white">{user?.username}</span>
                    </p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleLogout}
                        className="px-6 py-3 glass-card border-white/5 text-gray-400 hover:text-white hover:border-red-500/30 transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                    >
                        <LogOut size={14} /> Kill Session
                    </button>
                    <Link to="/" className="px-6 py-3 bg-accent-blue rounded-xl text-white font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-[0_5px_15px_rgba(0,240,255,0.2)]">
                        <Eye size={14} /> View Site
                    </Link>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 relative z-10">
                <StatCard 
                    label="Total Modules" 
                    value={stats.total_videos} 
                    icon={<Video className="text-accent-blue" />} 
                    color="cyan"
                />
                <StatCard 
                    label="Active Subjects" 
                    value={stats.total_subjects} 
                    icon={<BookOpen className="text-accent-purple" />} 
                    color="purple"
                />
                <StatCard 
                    label="Study Documents" 
                    value={stats.total_notes} 
                    icon={<FileText className="text-accent-cyan" />} 
                    color="blue"
                />
            </div>

            {/* Quick Actions */}
            <h3 className="text-xl font-black italic mb-8 opacity-60 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={20} className="text-accent-purple" /> Fast-Track Operations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                <ActionCard 
                    href="/om/videos" 
                    title="Manage Videos" 
                    desc="Edit, add or sync YouTube content" 
                    icon={<Video size={24} />}
                    color="blue"
                />
                <ActionCard 
                    href="/om/notes" 
                    title="Manage Notes" 
                    desc="Construct rich text study guides" 
                    icon={<FileText size={24} />}
                    color="purple"
                />
                <ActionCard 
                    href="#" 
                    title="System Logs" 
                    desc="Monitor API and server status" 
                    icon={<Settings size={24} />}
                    color="cyan"
                />
                <div 
                   onClick={() => navigate('/om/videos?add=true')}
                   className="glass-card p-8 border-accent-blue/30 bg-accent-blue/[0.02] border-dashed hover:border-solid hover:bg-accent-blue/5 cursor-pointer flex flex-col items-center justify-center text-center group transition-all"
                >
                    <div className="w-12 h-12 rounded-full bg-accent-blue/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Plus size={24} className="text-accent-blue" />
                    </div>
                    <span className="font-black uppercase tracking-widest text-xs">New Module</span>
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-full h-[30vh] bg-gradient-to-b from-accent-purple/5 to-transparent -z-0" />
        </div>
    );
};

const StatCard = ({ label, value, icon, color }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="glass-card p-10 border-white/5 bg-white/[0.01]"
    >
        <div className="flex justify-between items-start mb-6">
            <div className={`p-4 rounded-2xl bg-white/5 border border-white/10`}>
                {icon}
            </div>
        </div>
        <div className="text-5xl font-black tracking-tighter mb-2">{value}</div>
        <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{label}</div>
    </motion.div>
);

const ActionCard = ({ href, title, desc, icon, color }) => (
    <Link to={href}>
        <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`glass-card p-8 border-white/5 hover:border-accent-${color}/30 transition-all h-full`}
        >
            <div className={`mb-6 text-accent-${color}`}>{icon}</div>
            <h4 className="font-black text-lg italic uppercase tracking-tight mb-2">{title}</h4>
            <p className="text-gray-500 text-xs leading-relaxed font-medium">{desc}</p>
        </motion.div>
    </Link>
);

export default AdminDashboard;
