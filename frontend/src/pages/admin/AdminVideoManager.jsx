import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, 
    Search, 
    Filter, 
    Edit2, 
    Trash2, 
    Youtube, 
    Settings, 
    CheckCircle, 
    XCircle,
    ArrowLeft,
    Clock,
    Tag,
    ChevronDown
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const AdminVideoManager = () => {
    const [videos, setVideos] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);
    const location = useLocation();
    
    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        youtube_url_input: '',
        fetch_from_youtube: false,
        subject: '',
        type: 'Theory',
        important_topics: '',
        is_published: true,
        is_verified: false
    });

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('add') === 'true') {
            setShowAddForm(true);
        }
        fetchData();
    }, [location]);

    const fetchData = async () => {
        try {
            const [vResponse, sResponse] = await Promise.all([
                axios.get('/api/admin/videos/'),
                axios.get('/api/public/subjects/')
            ]);
            setVideos(vResponse.data.results || vResponse.data);
            setSubjects(sResponse.data.results || sResponse.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (id, field, value) => {
        try {
            await axios.patch(`/api/admin/videos/${id}/`, { [field]: !value });
            setVideos(videos.map(v => v.id === id ? { ...v, [field]: !value } : v));
        } catch (error) {
            console.error('Toggle failed', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? This action is permanent.')) return;
        try {
            await axios.delete(`/api/admin/videos/${id}/`);
            setVideos(videos.filter(v => v.id !== id));
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (editingVideo) {
                response = await axios.put(`/api/admin/videos/${editingVideo.id}/`, formData);
            } else {
                response = await axios.post('/api/admin/videos/', formData);
            }
            fetchData();
            setShowAddForm(false);
            setEditingVideo(null);
            setFormData({
                title: '', description: '', youtube_url_input: '', 
                fetch_from_youtube: false, subject: '', type: 'Theory',
                important_topics: '', is_published: true, is_verified: false
            });
        } catch (error) {
            console.error('Save failed', error);
            alert('Failed to save video. Check if YouTube URL is valid or duplicate.');
        }
    };

    const handleEdit = (video) => {
        setEditingVideo(video);
        setFormData({
            title: video.title,
            description: video.description,
            youtube_url_input: video.video_url || '',
            fetch_from_youtube: false,
            subject: video.subject,
            type: video.type,
            important_topics: video.important_topics,
            is_published: video.is_published,
            is_verified: video.is_verified
        });
        setShowAddForm(true);
    };

    return (
        <div className="min-h-screen bg-dark text-white p-6 md:p-12">
            <header className="mb-12 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link to="/om" className="p-3 glass-card border-white/5 hover:border-accent-blue/30 text-gray-400 hover:text-white transition-all">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase text-gradient">
                        Module Architect
                    </h1>
                </div>
                <button 
                    onClick={() => { setShowAddForm(true); setEditingVideo(null); }}
                    className="px-6 py-3 bg-accent-blue rounded-xl text-white font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-[0_5px_15px_rgba(0,240,255,0.2)] hover:scale-105 transition-all"
                >
                    <Plus size={16} /> Deploy New Module
                </button>
            </header>

            {/* Video List */}
            <div className="grid gap-6">
                {loading ? (
                    <div className="text-center py-20 opacity-50 uppercase tracking-[0.3em] font-black italic">Scanning Database...</div>
                ) : videos.map(video => (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={video.id} 
                        className="glass-card p-6 border-white/5 flex flex-col md:flex-row items-center gap-8 group hover:border-white/10"
                    >
                        <div className="w-full md:w-48 aspect-video rounded-xl overflow-hidden bg-gray-900 border border-white/5">
                            <img src={video.thumbnail} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-accent-blue/30 text-accent-blue bg-accent-blue/5`}>
                                    {video.type}
                                </span>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <Clock size={12} /> {video.duration}
                                </span>
                            </div>
                            <h3 className="text-xl font-black italic uppercase tracking-tight mb-2 group-hover:text-accent-blue transition-colors">{video.title}</h3>
                            <p className="text-gray-500 text-sm line-clamp-1 font-medium">{video.description}</p>
                        </div>
                        <div className="flex gap-4">
                             <div className="flex flex-col gap-2">
                                <button 
                                    onClick={() => handleToggle(video.id, 'is_published', video.is_published)}
                                    className={`p-3 rounded-xl border transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${video.is_published ? 'border-green-500/30 text-green-500 bg-green-500/5' : 'border-gray-500/30 text-gray-500'}`}
                                >
                                    {video.is_published ? <CheckCircle size={14} /> : <XCircle size={14} />} 
                                    {video.is_published ? 'Live' : 'Draft'}
                                </button>
                                <button 
                                    onClick={() => handleToggle(video.id, 'is_verified', video.is_verified)}
                                    className={`p-3 rounded-xl border transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${video.is_verified ? 'border-accent-purple/30 text-accent-purple bg-accent-purple/5' : 'border-gray-500/30 text-gray-500'}`}
                                >
                                    {video.is_verified ? <CheckCircle size={14} /> : <XCircle size={14} />} 
                                    {video.is_verified ? 'Verified' : 'Pending'}
                                </button>
                             </div>
                             <div className="flex flex-col gap-2">
                                <button 
                                    onClick={() => handleEdit(video)}
                                    className="p-3 glass-card border-white/5 hover:border-accent-cyan/40 text-gray-400 hover:text-accent-cyan transition-all"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(video.id)}
                                    className="p-3 glass-card border-white/5 hover:border-red-500/40 text-gray-400 hover:text-red-500 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                             </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal Form */}
            <AnimatePresence>
                {showAddForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
                            onClick={() => setShowAddForm(false)}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-4xl glass-card border-white/10 p-8 sm:p-12 relative z-10 max-h-[90vh] overflow-y-auto"
                        >
                            <h2 className="text-3xl font-black italic uppercase text-gradient mb-8">
                                {editingVideo ? 'Update Operations' : 'Deploy New Module'}
                            </h2>
                            
                            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Subject Anchor</label>
                                        <div className="relative">
                                            <select 
                                                value={formData.subject}
                                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white appearance-none outline-none focus:border-accent-blue transition-colors"
                                                required
                                            >
                                                <option value="" disabled>Select Subject</option>
                                                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                        </div>
                                    </div>

                                    <div className="p-6 glass-card border-accent-blue/20 bg-accent-blue/[0.02]">
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2"><Youtube className="text-red-500" /> Sync from YouTube</span>
                                            <button 
                                                type="button"
                                                onClick={() => setFormData({...formData, fetch_from_youtube: !formData.fetch_from_youtube})}
                                                className={`w-12 h-6 rounded-full transition-all relative ${formData.fetch_from_youtube ? 'bg-accent-blue' : 'bg-white/10'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.fetch_from_youtube ? 'left-7' : 'left-1'}`} />
                                            </button>
                                        </div>
                                        
                                        {formData.fetch_from_youtube && (
                                            <input 
                                                type="url"
                                                value={formData.youtube_url_input}
                                                onChange={(e) => setFormData({...formData, youtube_url_input: e.target.value})}
                                                placeholder="Paste YouTube Module URL"
                                                className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-accent-blue outline-none"
                                                required={formData.fetch_from_youtube}
                                            />
                                        )}
                                    </div>

                                    {!formData.fetch_from_youtube && (
                                        <>
                                            <div>
                                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Module Title</label>
                                                <input 
                                                    type="text"
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-accent-blue transition-colors"
                                                    required={!formData.fetch_from_youtube}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Intel Brief (Description)</label>
                                                <textarea 
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-accent-blue transition-colors h-32"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Topic Flow (Comma Separated)</label>
                                        <textarea 
                                            value={formData.important_topics}
                                            onChange={(e) => setFormData({...formData, important_topics: e.target.value})}
                                            placeholder="Array, Sorting, Big O..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-accent-purple transition-colors h-32"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Module Class</label>
                                            <select 
                                                value={formData.type}
                                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-accent-purple appearance-none"
                                            >
                                                <option value="Theory">Theory</option>
                                                <option value="Numerical">Numerical</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col justify-end gap-2">
                                            <div className="flex items-center gap-3">
                                                <button 
                                                    type="button"
                                                    onClick={() => setFormData({...formData, is_published: !formData.is_published})}
                                                    className={`w-10 h-5 rounded-full transition-all relative ${formData.is_published ? 'bg-green-500' : 'bg-white/10'}`}
                                                >
                                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${formData.is_published ? 'left-5.5' : 'left-0.5'}`} />
                                                </button>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Published</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button 
                                                    type="button"
                                                    onClick={() => setFormData({...formData, is_verified: !formData.is_verified})}
                                                    className={`w-10 h-5 rounded-full transition-all relative ${formData.is_verified ? 'bg-accent-purple' : 'bg-white/10'}`}
                                                >
                                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${formData.is_verified ? 'left-5.5' : 'left-0.5'}`} />
                                                </button>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Verified</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 flex gap-4">
                                        <button 
                                            type="button"
                                            onClick={() => setShowAddForm(false)}
                                            className="flex-1 py-4 glass-card border-white/5 text-gray-400 hover:text-white font-black uppercase tracking-widest text-xs transition-all"
                                        >
                                            Abort
                                        </button>
                                        <button 
                                            type="submit"
                                            className="flex-[2] py-4 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl text-white font-black uppercase tracking-widest text-xs shadow-[0_10px_30px_rgba(123,97,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                                        >
                                            Verify & Deploy
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminVideoManager;
