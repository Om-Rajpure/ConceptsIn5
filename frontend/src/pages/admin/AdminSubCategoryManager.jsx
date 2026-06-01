import React, { useState, useEffect } from 'react';
import api from '../../api';
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
    ChevronRight,
    Search,
    Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';

const AdminSubCategoryManager = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingSubCategory, setEditingSubCategory] = useState(null);
    const [filterCategory, setFilterCategory] = useState('');
    
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        icon: '',
        background_image: null
    });
    
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchSubCategories();
        fetchCategories();
    }, []);

    const fetchSubCategories = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/admin/subcategories/');
            setSubcategories(response.data.results || response.data);
        } catch (error) {
            toast.error('Sector data retrieval failed');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/api/admin/categories/');
            setCategories(response.data.results || response.data);
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('category', formData.category);
        data.append('icon', formData.icon);
        if (formData.background_image) {
            data.append('background_image', formData.background_image);
        }

        try {
            if (editingSubCategory) {
                await api.put(`/api/admin/subcategories/${editingSubCategory.id}/`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Sub-sector updated');
            } else {
                await api.post('/api/admin/subcategories/', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Sub-sector initialized');
            }
            fetchSubCategories();
            fetchCategories();
            setShowForm(false);
            setEditingSubCategory(null);
            setFormData({ name: '', category: '', icon: '', background_image: null });
        } catch (error) {
            toast.error(error.response?.data?.error || 'Synthesis failure');
        }
    };

    const handleDelete = (sc) => {
        setSubCategoryToDelete(sc);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!subCategoryToDelete) return;
        setDeleteLoading(true);
        try {
            await api.delete(`/api/admin/subcategories/${subCategoryToDelete.id}/`);
            toast.success('Sub-sector purged');
            fetchSubCategories();
            setShowDeleteModal(false);
        } catch (error) {
            toast.error('Purge failed');
        } finally {
            setDeleteLoading(false);
        }
    };

    const getCategoryName = (id) => {
        return categories.find(c => c.id === id)?.name || 'Unknown Grid';
    };

    const filteredSubCategories = filterCategory 
        ? subcategories.filter(sc => sc.category === parseInt(filterCategory))
        : subcategories;

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 md:pt-16 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-6">
                        <Link to="/om" className="group p-4 glass-card border-white/5 hover:border-accent-blue/40 text-gray-400 hover:text-white transition-all duration-500">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="h-[1px] w-8 bg-accent-blue/50"></span>
                                <span className="text-[10px] uppercase font-black tracking-[0.4em] text-accent-blue">Classification</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-gradient">
                                Sub-Sector Matrix
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <select 
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-accent-blue/50"
                        >
                            <option value="" className="bg-dark">All Grids</option>
                            {categories.map(c => <option key={c.id} value={c.id} className="bg-dark">{c.name}</option>)}
                        </select>
                        <button 
                            onClick={() => { setShowForm(true); setEditingSubCategory(null); setFormData({ name: '', category: '', icon: '', background_image: null }); }}
                            className="px-8 py-4 bg-accent-blue rounded-2xl text-white font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-[0_10px_25px_rgba(0,194,255,0.25)] hover:scale-105 active:scale-95 transition-all group"
                        >
                            <Plus size={18} /> 
                            <span>Add Sub-Sector</span>
                        </button>
                    </div>
                </header>

                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-12"
                        >
                            <div className="glass-card border-accent-blue/20 p-8 md:p-10">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-xl font-black italic uppercase tracking-tight">
                                        {editingSubCategory ? 'Refine Identity' : 'Synthesize Sub-Sector'}
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
                                                placeholder="e.g. Operating Systems"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-accent-blue/50"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Parent Grid</label>
                                            <select 
                                                value={formData.category}
                                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none appearance-none focus:border-accent-blue/50"
                                                required
                                            >
                                                <option value="" disabled className="bg-dark">Select Primary Grid</option>
                                                {categories.map(c => <option key={c.id} value={c.id} className="bg-dark">{c.name}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Atmosphere Overlay</label>
                                            <div className="flex items-center gap-4">
                                                <input 
                                                    type="file"
                                                    id="sc-bg"
                                                    onChange={(e) => setFormData({...formData, background_image: e.target.files[0]})}
                                                    className="hidden"
                                                />
                                                <label htmlFor="sc-bg" className="flex-1 bg-white/5 border-2 border-dashed border-white/10 rounded-xl py-4 px-6 text-center cursor-pointer hover:border-accent-blue/40 hover:bg-white/[0.07] transition-all flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-400">
                                                    <ImageIcon size={18} />
                                                    {formData.background_image ? 'Atmosphere Loaded' : 'Upload Backdrop'}
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Ref Icon</label>
                                            <input 
                                                type="text"
                                                value={formData.icon}
                                                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                                                placeholder="e.g. Folder, FileCode"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-accent-blue/50"
                                            />
                                        </div>
                                        <div className="pt-2">
                                            <button 
                                                type="submit"
                                                className="w-full py-4 bg-white text-dark font-black uppercase tracking-widest text-xs rounded-xl hover:bg-accent-blue hover:text-white transition-all shadow-xl flex items-center justify-center gap-3"
                                            >
                                                <Save size={18} />
                                                Authorize Link
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        Array(6).fill(0).map((_, i) => <div key={i} className="glass-card h-40 animate-pulse bg-white/5"></div>)
                    ) : filteredSubCategories.map((sc, index) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            key={sc.id} 
                            className="group glass-card border-white/5 hover:border-accent-blue/30 p-6 transition-all duration-300"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-accent-blue bg-accent-blue/10 px-3 py-1 rounded-full">
                                    {getCategoryName(sc.category)}
                                </span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditingSubCategory(sc); setFormData({...sc, background_image: null}); setShowForm(true); }} className="p-2 hover:text-accent-blue"><Edit2 size={14} /></button>
                                    <button onClick={() => handleDelete(sc)} className="p-2 hover:text-red-500"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <h3 className="text-lg font-black italic uppercase text-white mb-2 group-hover:text-accent-blue transition-colors">
                                {sc.name}
                            </h3>
                            <div className="flex items-center gap-4 text-gray-600 text-[10px] font-black uppercase tracking-widest">
                                <Database size={12} />
                                <span>{sc.subjects?.length || 0} Subjects</span>
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
                title="Wipe Sub-Sector"
                description={`Erasure of "${subCategoryToDelete?.name}" requested. This will break inheritance for linked subjects. Purge?`}
            />
        </div>
    );
};

export default AdminSubCategoryManager;
