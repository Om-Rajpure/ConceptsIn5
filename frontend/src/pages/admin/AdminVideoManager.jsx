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
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);

    // Subject/SubCategory Modal State
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [newSubject, setNewSubject] = useState({
        name: '',
        category: '',
        subcategory: ''
    });
    const [newSubCategoryName, setNewSubCategoryName] = useState('');
    const [modalLoading, setModalLoading] = useState(false);
    const location = useLocation();
    
    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        youtube_url: '',
        fetch_from_youtube: false,
        subject: '',
        type: 'Theory',
        important_topics: '',
        duration: '',
        thumbnail: '',
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

    const fetchModalData = async () => {
        try {
            const [cResponse, scResponse] = await Promise.all([
                axios.get('/api/public/categories/'),
                axios.get('/api/public/subcategories/')
            ]);
            setCategories(cResponse.data.results || cResponse.data);
            setSubCategories(scResponse.data.results || scResponse.data);
        } catch (error) {
            console.error('Failed to fetch modal data', error);
        }
    };

    useEffect(() => {
        if (showSubjectModal) {
            fetchModalData();
        }
    }, [showSubjectModal]);

    const handleAddSubject = async (e) => {
        e.preventDefault();
        if (!newSubject.name || !newSubject.subcategory) {
            alert('Please fill all required fields');
            return;
        }
        setModalLoading(true);
        try {
            const response = await axios.post('/api/admin/subjects/', {
                name: newSubject.name,
                subcategory: newSubject.subcategory
            });
            const createdSubject = response.data;
            
            // Update subjects list
            setSubjects(prev => [...prev, createdSubject]);
            // Select the new subject
            setFormData(prev => ({ ...prev, subject: createdSubject.id }));
            // Reset and close modal
            setNewSubject({ name: '', category: '', subcategory: '' });
            setShowSubjectModal(false);
        } catch (error) {
            console.error('Failed to add subject', error);
            alert(error.response?.data?.error || 'Failed to add subject');
        } finally {
            setModalLoading(false);
        }
    };

    const handleAddSubCategory = async (e) => {
        e.preventDefault();
        if (!newSubCategoryName || !newSubject.category) {
            alert('Name and category are required');
            return;
        }
        setModalLoading(true);
        try {
            const response = await axios.post('/api/admin/subcategories/', {
                name: newSubCategoryName,
                category: newSubject.category
            });
            const createdSubCategory = response.data;
            
            // Update subcategories list
            setSubCategories(prev => [...prev, createdSubCategory]);
            // Auto-select the new subcategory
            setNewSubject(prev => ({ ...prev, subcategory: createdSubCategory.id }));
            // Reset and close modal
            setNewSubCategoryName('');
            setShowSubCategoryModal(false);
        } catch (error) {
            console.error('Failed to add subcategory', error);
            alert(error.response?.data?.error || 'Failed to add sub-category');
        } finally {
            setModalLoading(false);
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


    const handleLocalFetch = () => {
        const url = formData.youtube_url;
        if (!url) return;

        // Simple frontend regex for ID extraction
        const patterns = [
            /(?:v=|\/|vi\/|youtu\.be\/|embed\/)([0-9A-Za-z_-]{11})/,
            /watch\?v=([0-9A-Za-z_-]{11})/,
            /shorts\/([0-9A-Za-z_-]{11})/
        ];

        let videoId = null;
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                videoId = match[1];
                break;
            }
        }

        if (videoId) {
            setFormData({
                ...formData,
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
            });
        } else {
            alert('Invalid YouTube URL format');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingVideo) {
                await axios.put(`/api/admin/videos/${editingVideo.id}/`, formData);
            } else {
                await axios.post('/api/admin/videos/', formData);
            }
            fetchData();
            setShowAddForm(false);
            setEditingVideo(null);
            setFormData({
                title: '', description: '', youtube_url: '', 
                fetch_from_youtube: false, subject: '', type: 'Theory',
                important_topics: '', duration: '', thumbnail: '',
                is_published: true, is_verified: false
            });
        } catch (error) {
            console.error('Save failed', error);
            alert('Failed to save video. Possible duplicate YouTube ID or invalid data.');
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
        <div className="min-h-screen bg-dark text-white font-sans selection:bg-accent-blue/30 selection:text-accent-blue">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-[20px] lg:pt-[60px] pb-20">
                <header className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <Link to="/om" className="p-3 glass-card border-white/5 hover:border-accent-blue/30 text-gray-400 hover:text-white transition-all rounded-xl">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase text-gradient">
                                Module Architect
                            </h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mt-1">Admin Command Center</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => { setShowAddForm(true); setEditingVideo(null); }}
                        className="w-full sm:w-auto px-8 py-4 bg-accent-blue rounded-2xl text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-[0_10px_25px_rgba(0,240,255,0.2)] hover:shadow-[0_15px_35px_rgba(0,240,255,0.3)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                    >
                        <Plus size={18} /> Deploy New Module
                    </button>
                </header>

            {/* Video List */}
            <div className="grid gap-6">
                {loading ? (
                    <div className="text-center py-20 opacity-50 uppercase tracking-[0.3em] font-black italic animate-pulse">Scanning Database...</div>
                ) : videos.map(video => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={video.id} 
                        className="glass-card p-4 sm:p-6 border-white/5 flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-8 group hover:border-accent-blue/30 hover:shadow-[0_0_30px_rgba(0,240,255,0.05)] transition-all duration-500 rounded-2xl sm:rounded-[24px]"
                    >
                        <div className="w-full md:w-56 lg:w-64 aspect-video rounded-xl overflow-hidden bg-gray-900 border border-white/5 relative group-hover:border-accent-blue/20 transition-all">
                            <img src={video.thumbnail} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
                            <p className="text-gray-500 text-sm line-clamp-1 font-medium">{video.quick_summary || video.description}</p>
                        </div>
                         <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                            <div className="flex-1 flex md:flex-col gap-2">
                                <button 
                                    onClick={() => handleToggle(video.id, 'is_published', video.is_published)}
                                    className={`flex-1 p-3 rounded-xl border transition-all flex items-center justify-center gap-2 text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${video.is_published ? 'border-green-500/30 text-green-500 bg-green-500/5 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'border-gray-500/30 text-gray-500'}`}
                                >
                                    {video.is_published ? <CheckCircle size={14} /> : <XCircle size={14} />} 
                                    <span className="hidden sm:inline">{video.is_published ? 'Live' : 'Draft'}</span>
                                </button>
                                <button 
                                    onClick={() => handleToggle(video.id, 'is_verified', video.is_verified)}
                                    className={`flex-1 p-3 rounded-xl border transition-all flex items-center justify-center gap-2 text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${video.is_verified ? 'border-accent-purple/30 text-accent-purple bg-accent-purple/5 shadow-[0_0_15px_rgba(123,97,255,0.1)]' : 'border-gray-500/30 text-gray-500'}`}
                                >
                                    {video.is_verified ? <CheckCircle size={14} /> : <XCircle size={14} />} 
                                    <span className="hidden sm:inline">{video.is_verified ? 'Verified' : 'Pending'}</span>
                                </button>
                            </div>
                            <div className="flex md:flex-col gap-2">
                                <button 
                                    onClick={() => handleEdit(video)}
                                    className="p-3 glass-card border-white/5 hover:border-accent-cyan/40 text-gray-400 hover:text-accent-cyan transition-all rounded-xl"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(video.id)}
                                    className="p-3 glass-card border-white/5 hover:border-red-500/40 text-gray-400 hover:text-red-500 transition-all rounded-xl"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                         </div>
                    </motion.div>
                ))}
            </div>
            
            {/* Closing the container div */}
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
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="w-full max-w-5xl glass-card border-white/10 p-6 sm:p-10 relative z-10 max-h-[90vh] overflow-y-auto rounded-[32px] shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-2xl sm:text-3xl font-black italic uppercase text-gradient">
                                    {editingVideo ? 'Update Operations' : 'Deploy New Module'}
                                </h2>
                                <button 
                                    onClick={() => setShowAddForm(false)}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white"
                                >
                                    <XCircle size={24} />
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Subject Anchor</label>
                                        <div className="flex items-center gap-3">
                                            <div className="relative group flex-1">
                                                <select 
                                                    value={formData.subject}
                                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 px-4 text-white appearance-none outline-none focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/5 transition-all cursor-pointer"
                                                    required
                                                >
                                                    <option value="" disabled className="bg-dark">Select Subject</option>
                                                    {subjects.map(s => <option key={s.id} value={s.id} className="bg-dark">{s.name}</option>)}
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-accent-blue transition-colors pointer-events-none" size={16} />
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => setShowSubjectModal(true)}
                                                className="px-4 py-4 bg-accent-blue/10 text-accent-blue border border-accent-blue/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent-blue hover:text-white transition-all shadow-lg"
                                            >
                                                + Add
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-6 glass-card border-accent-blue/20 bg-accent-blue/[0.02] rounded-2xl">
                                        <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-gray-400 mb-4">
                                            <Youtube size={16} className="text-red-500" /> Paste YouTube Link
                                        </span>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <input 
                                                type="url"
                                                value={formData.youtube_url}
                                                onChange={(e) => setFormData({...formData, youtube_url: e.target.value})}
                                                placeholder="Paste YouTube video link (optional)"
                                                className="flex-1 bg-dark/50 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all"
                                            />
                                            <button 
                                                type="button"
                                                onClick={handleLocalFetch}
                                                className="sm:w-auto w-full px-6 py-3 bg-accent-blue/10 text-accent-blue border border-accent-blue/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent-blue hover:text-white transition-all shadow-lg shadow-accent-blue/5"
                                            >
                                                Fetch
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Module Title</label>
                                        <input 
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            placeholder="Enter module title..."
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Intel Brief (Description)</label>
                                        <textarea 
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            placeholder="Detailed module briefing..."
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-4 text-white outline-none focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 transition-all h-32 resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Topic Flow (Comma Separated)</label>
                                        <textarea 
                                            value={formData.important_topics}
                                            onChange={(e) => setFormData({...formData, important_topics: e.target.value})}
                                            placeholder="Array, Sorting, Big O..."
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-4 text-white outline-none focus:border-accent-purple focus:ring-4 focus:ring-accent-purple/10 transition-all h-32 resize-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Module Class</label>
                                                <div className="relative">
                                                    <select 
                                                        value={formData.type}
                                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-accent-purple appearance-none"
                                                    >
                                                        <option value="Theory">Theory</option>
                                                        <option value="Numerical">Numerical</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Duration</label>
                                                <div className="relative">
                                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                                    <input 
                                                        type="text"
                                                        value={formData.duration}
                                                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                                        placeholder="5:00"
                                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-accent-purple"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="pt-2 space-y-4">
                                                <div className="flex items-center justify-between p-3 glass-card border-white/5 bg-white/5 rounded-xl">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Published Status</span>
                                                    <button 
                                                        type="button"
                                                        onClick={() => setFormData({...formData, is_published: !formData.is_published})}
                                                        className={`w-10 h-5 rounded-full transition-all relative ${formData.is_published ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-white/10'}`}
                                                    >
                                                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${formData.is_published ? 'left-5.5' : 'left-0.5'}`} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between p-3 glass-card border-white/5 bg-white/5 rounded-xl">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Verified Badge</span>
                                                    <button 
                                                        type="button"
                                                        onClick={() => setFormData({...formData, is_verified: !formData.is_verified})}
                                                        className={`w-10 h-5 rounded-full transition-all relative ${formData.is_verified ? 'bg-accent-purple shadow-[0_0_10px_rgba(123,97,255,0.3)]' : 'bg-white/10'}`}
                                                    >
                                                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${formData.is_verified ? 'left-5.5' : 'left-0.5'}`} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 md:mt-6 pt-6 flex flex-col sm:flex-row-reverse gap-4">
                                        <button 
                                            type="submit"
                                            className="flex-[2] py-5 bg-gradient-to-r from-accent-blue to-accent-purple rounded-2xl text-white font-black uppercase tracking-widest text-xs shadow-[0_15px_35px_rgba(0,240,255,0.2)] hover:shadow-[0_20px_45px_rgba(0,240,255,0.3)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                                        >
                                            Verify & Deploy Module
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setShowAddForm(false)}
                                            className="flex-1 py-5 glass-card border-white/5 text-gray-400 hover:text-white font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all rounded-2xl"
                                        >
                                            Abort Operation
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Subject Creation Modal */}
            <AnimatePresence>
                {showSubjectModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-dark/90 backdrop-blur-md"
                            onClick={() => setShowSubjectModal(false)}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-md glass-card border-accent-blue/30 p-8 relative z-10 rounded-[24px] shadow-2xl"
                        >
                            <h2 className="text-2xl font-black italic uppercase text-gradient mb-8">Add New Subject</h2>
                            
                            <form onSubmit={handleAddSubject} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Subject Name</label>
                                    <input 
                                        type="text"
                                        value={newSubject.name}
                                        onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                                        placeholder="e.g. Data Structures"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-accent-blue transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Parent Category</label>
                                    <div className="relative">
                                        <select 
                                            value={newSubject.category}
                                            onChange={(e) => {
                                                setNewSubject({...newSubject, category: e.target.value, subcategory: ''});
                                            }}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white appearance-none outline-none focus:border-accent-blue"
                                            required
                                        >
                                            <option value="" disabled className="bg-dark">Select Category</option>
                                            {categories.map(c => <option key={c.id} value={c.id} className="bg-dark">{c.name}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Sub-Category Anchor</label>
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex-1">
                                            <select 
                                                value={newSubject.subcategory}
                                                onChange={(e) => setNewSubject({...newSubject, subcategory: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white appearance-none outline-none focus:border-accent-blue disabled:opacity-50"
                                                required
                                                disabled={!newSubject.category}
                                            >
                                                <option value="" disabled className="bg-dark">Select Sub-Category</option>
                                                {(() => {
                                                    const selectedCategoryName = categories.find(c => c.id === parseInt(newSubject.category))?.name;
                                                    if (selectedCategoryName === "Semester Subjects" || selectedCategoryName === "Semester") {
                                                        return [
                                                            { id: 3, name: "Sem 4" },
                                                            { id: 4, name: "Sem 5" },
                                                            { id: 5, name: "Sem 6" },
                                                            { id: 6, name: "Sem 7" },
                                                            { id: 7, name: "Sem 8" }
                                                        ].map(opt => <option key={opt.id} value={opt.id} className="bg-dark">{opt.name}</option>);
                                                    }
                                                    return subCategories
                                                        .filter(sc => sc.category === parseInt(newSubject.category))
                                                        .map(sc => <option key={sc.id} value={sc.id} className="bg-dark">{sc.name}</option>);
                                                })()}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => setShowSubCategoryModal(true)}
                                            disabled={!newSubject.category}
                                            className="px-4 py-4 bg-accent-blue/10 text-accent-blue border border-accent-blue/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent-blue hover:text-white transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            + Add
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="button"
                                        onClick={() => setShowSubjectModal(false)}
                                        className="flex-1 py-4 glass-card border-white/5 text-gray-400 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={modalLoading}
                                        className="flex-[2] py-4 bg-accent-blue rounded-xl text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-accent-blue/20 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                                    >
                                        {modalLoading ? 'Creating...' : 'Add Subject'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Sub-Category Creation Modal */}
            <AnimatePresence>
                {showSubCategoryModal && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-dark/90 backdrop-blur-md"
                            onClick={() => setShowSubCategoryModal(false)}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-md glass-card border-accent-purple/30 p-8 relative z-10 rounded-[24px] shadow-2xl"
                        >
                            <h2 className="text-2xl font-black italic uppercase text-gradient-purple mb-8">Add Sub-Category</h2>
                            
                            <form onSubmit={handleAddSubCategory} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Sub-Category Name</label>
                                    <input 
                                        type="text"
                                        value={newSubCategoryName}
                                        onChange={(e) => setNewSubCategoryName(e.target.value)}
                                        placeholder="e.g. Semester 5"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-accent-purple transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Category (Locked)</label>
                                    <div className="relative">
                                        <select 
                                            value={newSubject.category}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white appearance-none outline-none opacity-50 cursor-not-allowed"
                                            disabled
                                        >
                                            {categories.map(c => <option key={c.id} value={c.id} className="bg-dark">{c.name}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="button"
                                        onClick={() => setShowSubCategoryModal(false)}
                                        className="flex-1 py-4 glass-card border-white/5 text-gray-400 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={modalLoading}
                                        className="flex-[2] py-4 bg-accent-purple rounded-xl text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-accent-purple/20 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                                    >
                                        {modalLoading ? 'Adding...' : 'Add'}
                                    </button>
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
