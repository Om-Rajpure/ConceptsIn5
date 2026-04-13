import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Video, 
    ArrowLeft,
    Save,
    X,
    ExternalLink,
    Play,
    Database,
    Clock,
    Search,
    PlusCircle,
    Image as ImageIcon
} from 'lucide-react';
import { extractVideoId, getYoutubeThumbnail } from '../../utils/youtubeUtils';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';

const AdminReelManager = () => {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingReel, setEditingReel] = useState(null);
    const [pagination, setPagination] = useState({ next: null, previous: null, count: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    
    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reelToDelete, setReelToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    
    const [formData, setFormData] = useState({
        title: '',
        video_url: '',
        description: ''
    });

    useEffect(() => {
        fetchReels();
    }, [searchQuery]);

    const fetchReels = async (url = '/api/admin/reels/') => {
        setLoading(true);
        try {
            const response = await axios.get(url);
            if (response.data.results) {
                setReels(response.data.results);
                setPagination({
                    next: response.data.next,
                    previous: response.data.previous,
                    count: response.data.count
                });
            } else {
                setReels(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch reels', error);
            toast.error('Sector synchronization failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setThumbnailFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading(editingReel ? 'Updating Nexus Reel...' : 'Initializing New Reel...');
        
        const data = new FormData();
        data.append('title', formData.title);
        data.append('video_url', formData.video_url);
        data.append('description', formData.description);
        if (thumbnailFile) {
            data.append('thumbnail', thumbnailFile);
        }

        try {
            if (editingReel) {
                await axios.put(`/api/admin/reels/${editingReel.id}/`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Reel updated successfully.', { id: loadingToast });
            } else {
                await axios.post('/api/admin/reels/', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('New Reel initialized.', { id: loadingToast });
            }
            setShowForm(false);
            setEditingReel(null);
            setThumbnailFile(null);
            setFormData({ title: '', video_url: '', description: '' });
            fetchReels();
        } catch (error) {
            console.error('Operation failed', error);
            toast.error(error.response?.data?.detail || 'Operation aborted by system.', { id: loadingToast });
        }
    };

    const handleEdit = (reel) => {
        setEditingReel(reel);
        setFormData({
            title: reel.title,
            video_url: reel.video_url,
            description: reel.description || ''
        });
        setShowForm(true);
    };

    const handleDelete = (reel) => {
        setReelToDelete(reel);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!reelToDelete) return;
        
        setDeleteLoading(true);
        try {
            await axios.delete(`/api/admin/reels/${reelToDelete.id}/`);
            toast.success('Nexus unit terminated.');
            setShowDeleteModal(false);
            setReelToDelete(null);
            fetchReels();
        } catch (error) {
            console.error('Termination failed', error);
            toast.error('Termination sequence failed. Link operational.');
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark text-white pt-24 px-6 md:px-12 pb-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <Link to="/om" className="flex items-center gap-2 text-accent-blue hover:text-white transition-colors mb-4 group font-black uppercase tracking-widest text-[10px]">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase glow-text">
                            Quick Concepts <span className="text-accent-blue bg-accent-blue/10 px-3 py-1 rounded-lg not-italic text-2xl align-middle ml-2">REELS</span>
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium tracking-wide">Manage short-form Nexus units ({pagination.count} detected)</p>
                    </div>

                    <button 
                        onClick={() => {
                            setEditingReel(null);
                            setFormData({ title: '', video_url: '', description: '' });
                            setShowForm(true);
                        }}
                        className="px-8 py-3 bg-accent-blue rounded-xl text-white font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-[0_10px_20px_rgba(0,240,255,0.2)] hover:shadow-[0_15px_30px_rgba(0,240,255,0.3)] hover:-translate-y-0.5 transition-all"
                    >
                        <PlusCircle size={18} /> Add New Reel
                    </button>
                </div>

                {/* Main Content Area */}
                <AnimatePresence mode="wait">
                    {showForm ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="glass-card p-8 border-accent-blue/20 bg-accent-blue/[0.02]">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-black italic uppercase tracking-tight flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center">
                                            <Video size={18} className="text-accent-blue" />
                                        </div>
                                        {editingReel ? 'Configure Reel' : 'Initialize Reel'}
                                    </h2>
                                    <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Unit Title</label>
                                        <input 
                                            type="text" 
                                            name="title"
                                            required
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-blue/50 transition-all font-medium"
                                            placeholder="e.g., Minimax Algorithm in 60s"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Nexus Link (YouTube Shorts / Reel)</label>
                                        <input 
                                            type="url" 
                                            name="video_url"
                                            required
                                            value={formData.video_url}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-blue/50 transition-all font-medium font-mono text-sm"
                                            placeholder="https://youtube.com/shorts/..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Brief Transmission (Description)</label>
                                        <textarea 
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-accent-blue/50 transition-all font-medium resize-none"
                                            placeholder="Quick breakdown of the concept..."
                                        ></textarea>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Thumbnail (Optional)</label>
                                        <div className="relative group/file">
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="thumbnail-upload"
                                            />
                                            <label 
                                                htmlFor="thumbnail-upload"
                                                className="w-full bg-white/5 border border-white/10 border-dashed rounded-xl px-4 py-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-accent-blue/50 hover:bg-accent-blue/[0.02] transition-all"
                                            >
                                                <ImageIcon size={24} className="text-gray-500 group-hover/file:text-accent-blue transition-colors" />
                                                <div className="text-center">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover/file:text-white transition-colors">
                                                        {thumbnailFile ? thumbnailFile.name : 'Upload Custom Image'}
                                                    </span>
                                                    <p className="text-[8px] text-gray-600 mt-1 uppercase tracking-[0.2em]">Accepts JPG, PNG, WEBP</p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-4">
                                        <button 
                                            type="submit"
                                            className="flex-1 bg-accent-blue py-4 rounded-xl text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(0,240,255,0.2)] hover:shadow-[0_15px_30px_rgba(0,240,255,0.3)] transition-all"
                                        >
                                            <Save size={18} /> {editingReel ? 'Confirm Changes' : 'Execute Creation'}
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="px-8 py-4 glass-card border-white/10 text-gray-400 font-black uppercase tracking-widest text-[10px] hover:text-white transition-all"
                                        >
                                            Abort
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8"
                        >
                            {/* Stats & Search */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                                <div className="glass-card p-6 border-white/5 bg-white/[0.01] flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-accent-blue/10 border border-accent-blue/20">
                                        <Database className="text-accent-blue" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black tracking-tighter">{reels.length}</div>
                                        <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Active Units</div>
                                    </div>
                                </div>
                                <div className="glass-card p-6 border-white/5 bg-white/[0.01] flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-accent-purple/10 border border-accent-purple/20">
                                        <Clock className="text-accent-purple" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black tracking-tighter">Fast</div>
                                        <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Delivery mode</div>
                                    </div>
                                </div>
                                <div className="md:col-span-2 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Search Nexus Archives..." 
                                        className="w-full h-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 focus:outline-none focus:border-accent-blue/30 transition-all font-medium"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Grid Display */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {loading && reels.length === 0 ? (
                                    [1,2,3,4].map(i => (
                                        <div key={i} className="animate-pulse glass-card aspect-[9/16] border-white/5 bg-white/5 opacity-50"></div>
                                    ))
                                ) : reels.length > 0 ? (
                                    reels.map((reel) => (
                                        <motion.div 
                                            key={reel.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="group relative h-[450px] rounded-2xl overflow-hidden border border-white/5 bg-dark shadow-2xl transition-all hover:border-accent-blue/30"
                                        >
                                            {/* Thumbnail Container */}
                                            <div className="absolute inset-0 z-0">
                                                <img 
                                                    src={reel.thumbnail || getYoutubeThumbnail(reel.video_url)} 
                                                    alt={reel.title}
                                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-105 transition-transform"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />
                                            </div>

                                            {/* Overlay Content */}
                                            <div className="absolute inset-x-0 bottom-0 p-6 z-10">
                                                <h3 className="text-xl font-black italic uppercase tracking-tight mb-2 group-hover:text-accent-blue transition-colors line-clamp-2">
                                                    {reel.title}
                                                </h3>
                                                <p className="text-gray-400 text-xs font-medium mb-6 line-clamp-2 opacity-80">
                                                    {reel.description || 'No data transmission attached to this unit.'}
                                                </p>
                                                
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => handleEdit(reel)}
                                                        className="flex-1 py-3 glass-card border-white/10 bg-white/5 hover:bg-accent-blue hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                                                    >
                                                        <Edit2 size={12} /> Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(reel)}
                                                        className="w-12 py-3 glass-card border-white/10 bg-white/5 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Preview Overlay */}
                                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <a 
                                                    href={reel.video_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="w-8 h-8 rounded-lg bg-accent-blue/80 backdrop-blur-sm flex items-center justify-center text-white"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                            </div>
                                            
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity">
                                                <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center pl-1">
                                                    <Play size={24} fill="white" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 text-center glass-card border-dashed border-white/10">
                                        <div className="text-4xl mb-4">📭</div>
                                        <h3 className="text-xl font-black italic opacity-40 uppercase tracking-widest">No Reels Detected in Archives</h3>
                                        <p className="text-gray-600 mt-2">Initialize your first short-form transmission to proceed.</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {pagination.count > 0 && (
                                <div className="flex justify-center items-center gap-4 mt-12 bg-dark/50 p-4 rounded-xl border border-white/5">
                                    <button 
                                        disabled={!pagination.previous}
                                        onClick={() => fetchReels(pagination.previous)}
                                        className="px-6 py-2 glass-card border-white/10 text-xs font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:text-accent-blue transition-all"
                                    >
                                        Prev
                                    </button>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                        Nexus Units: {reels.length} / {pagination.count}
                                    </span>
                                    <button 
                                        disabled={!pagination.next}
                                        onClick={() => fetchReels(pagination.next)}
                                        className="px-6 py-2 glass-card border-white/10 text-xs font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:text-accent-blue transition-all"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                loading={deleteLoading}
                title="Terminate Reel"
                description={`Are you sure you want to permanently erase "${reelToDelete?.title}"? This Nexus transmission will be lost.`}
            />
            </div>
        </div>
    );
};

export default AdminReelManager;
