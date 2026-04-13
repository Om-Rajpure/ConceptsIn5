import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Layers, 
    ArrowLeft,
    Save,
    X,
    Image as ImageIcon,
    Database,
    Tag,
    ChevronRight,
    Search,
    Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';

const AdminCategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        icon: '',
        background_image: null,
        theme_color: '#7B61FF'
    });
    
    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/admin/categories/');
            setCategories(response.data.results || response.data);
        } catch (error) {
            console.error('Failed to fetch categories', error);
            toast.error('System synchronization failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('icon', formData.icon);
        data.append('theme_color', formData.theme_color);
        if (formData.background_image) {
            data.append('background_image', formData.background_image);
        }

        try {
            if (editingCategory) {
                await axios.put(`/api/admin/categories/${editingCategory.id}/`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Category protocol updated');
            } else {
                await axios.post('/api/admin/categories/', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('New category initialized');
            }
            fetchCategories();
            setShowForm(false);
            setEditingCategory(null);
            setFormData({ name: '', icon: '', background_image: null, theme_color: '#7B61FF' });
        } catch (error) {
            console.error('Save failed', error);
            toast.error(error.response?.data?.error || 'Access denied / Synthesis failure');
        }
    };

    const handleDelete = (category) => {
        setCategoryToDelete(category);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!categoryToDelete) return;
        setDeleteLoading(true);
        try {
            await axios.delete(`/api/admin/categories/${categoryToDelete.id}//`);
            toast.success('Category purged from database');
            fetchCategories();
            setShowDeleteModal(false);
        } catch (error) {
            toast.error('Purge failed. Check linked dependencies.');
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 md:pt-16 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-6">
                        <Link to="/om" className="group p-4 glass-card border-white/5 hover:border-accent-purple/40 text-gray-400 hover:text-white transition-all duration-500">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="h-[1px] w-8 bg-accent-purple/50"></span>
                                <span className="text-[10px] uppercase font-black tracking-[0.4em] text-accent-purple">Master Control</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-gradient">
                                Category Matrix
                            </h1>
                        </div>
                    </div>

                    <button 
                        onClick={() => { setShowForm(true); setEditingCategory(null); setFormData({ name: '', icon: '', background_image: null, theme_color: '#7B61FF' }); }}
                        className="px-8 py-4 bg-accent-purple rounded-2xl text-white font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-[0_10px_25px_rgba(123,97,255,0.25)] hover:scale-105 active:scale-95 transition-all relative overflow-hidden group"
                    >
                        <Plus size={18} /> 
                        <span>Add Category</span>
                    </button>
                </header>

                {/* Form */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-12 overflow-hidden"
                        >
                            <div className="glass-card border-accent-purple/20 p-8 md:p-10">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-xl font-black italic uppercase tracking-tight">
                                        {editingCategory ? 'Update Framework' : 'Initialize Category'}
                                    </h2>
                                    <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/5 rounded-lg transition-all"><X size={20}/></button>
                                </div>

                                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Identity Name</label>
                                            <input 
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                placeholder="e.g. Computer Science"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-accent-purple/50 transition-all"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Icon Library Ref</label>
                                            <input 
                                                type="text"
                                                value={formData.icon}
                                                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                                                placeholder="e.g. Code, Book, Cpu"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-accent-purple/50 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Background Atmosphere</label>
                                            <div className="flex items-center gap-4">
                                                <input 
                                                    type="file"
                                                    id="cat-bg"
                                                    onChange={(e) => setFormData({...formData, background_image: e.target.files[0]})}
                                                    className="hidden"
                                                />
                                                <label htmlFor="cat-bg" className="flex-1 bg-white/5 border-2 border-dashed border-white/10 rounded-xl py-4 px-6 text-center cursor-pointer hover:border-accent-purple/40 hover:bg-white/[0.07] transition-all flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-400">
                                                    <ImageIcon size={18} />
                                                    {formData.background_image ? 'Image Uploaded' : 'Upload Atmosphere'}
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">System Accent</label>
                                            <input 
                                                type="color"
                                                value={formData.theme_color}
                                                onChange={(e) => setFormData({...formData, theme_color: e.target.value})}
                                                className="w-full h-14 bg-white/5 border border-white/10 rounded-xl p-2 outline-none cursor-pointer"
                                            />
                                        </div>
                                        <div className="pt-2">
                                            <button 
                                                type="submit"
                                                className="w-full py-4 bg-white text-dark font-black uppercase tracking-widest text-xs rounded-xl hover:bg-accent-purple hover:text-white transition-all shadow-xl flex items-center justify-center gap-3"
                                            >
                                                <Save size={18} />
                                                Commit Data
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="glass-card h-48 animate-pulse bg-white/5"></div>
                        ))
                    ) : categories.map((cat, index) => (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            key={cat.id} 
                            className="group glass-card border-white/5 hover:border-accent-purple/30 p-8 flex flex-col justify-between transition-all duration-500 relative overflow-hidden"
                            style={{ '--accent': cat.theme_color }}
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-purple/5 rounded-bl-full -translate-y-8 translate-x-8 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                            
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-accent-purple group-hover:border-accent-purple/40 transition-colors">
                                        <Database size={20} />
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => { setEditingCategory(cat); setFormData({...cat, background_image: null}); setShowForm(true); }}
                                            className="p-2 glass-card hover:bg-accent-purple/20 transition-all text-gray-400 hover:text-white"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(cat)}
                                            className="p-2 glass-card hover:bg-red-500/20 transition-all text-gray-400 hover:text-red-500"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-xl font-black italic uppercase tracking-tight text-white group-hover:text-accent-purple transition-colors mb-2">{cat.name}</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">ID: {cat.slug}</p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-accent-purple bg-accent-purple/10 px-3 py-1 rounded-full">
                                    {cat.all_subcategories?.length || 0} Sub-sectors
                                </span>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Clock size={12} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">{new Date(cat.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <DeleteConfirmModal 
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                loading={deleteLoading}
                title="Purge Category"
                description={`Warning: This will permanently remove the "${categoryToDelete?.name}" sector and potentially affect linked data. Confirm erasure?`}
            />
        </div>
    );
};

export default AdminCategoryManager;
