import React, { useState, useEffect } from 'react';
import api from '../../api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    ArrowLeft,
    Save,
    X,
    Database,
    Tag,
    PlusCircle,
    Layers,
    ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';

const AdminSubjectManager = () => {
    const [subjects, setSubjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);
    
    // Inline creation state
    const [showQuickCat, setShowQuickCat] = useState(false);
    const [showQuickSub, setShowQuickSub] = useState(false);
    const [quickName, setQuickName] = useState('');
    const [quickLoading, setQuickLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        subcategory: ''
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [subjectToDelete, setSubjectToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [sRes, cRes, scRes] = await Promise.all([
                api.get('/api/admin/subjects/'),
                api.get('/api/admin/categories/'),
                api.get('/api/admin/subcategories/')
            ]);
            setSubjects(sRes.data.results || sRes.data);
            setCategories(cRes.data.results || cRes.data);
            setSubcategories(scRes.data.results || scRes.data);
        } catch (error) {
            toast.error('Global matrix fetch failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSubject) {
                await api.put(`/api/admin/subjects/${editingSubject.id}/`, formData);
                toast.success('Subject coordinates updated');
            } else {
                await api.post('/api/admin/subjects/', formData);
                toast.success('Subject sector established');
            }
            fetchData();
            setShowForm(false);
            setEditingSubject(null);
            setFormData({ name: '', description: '', category: '', subcategory: '' });
        } catch (error) {
            toast.error(error.response?.data?.error || 'Validation failure');
        }
    };

    const handleQuickAdd = async (type) => {
        if (!quickName.trim()) return;
        setQuickLoading(true);
        try {
            let res;
            if (type === 'category') {
                res = await api.post('/api/admin/categories/', { name: quickName });
                await fetchData(); // Refresh all lists
                setFormData(prev => ({ ...prev, category: res.data.id }));
                setShowQuickCat(false);
            } else {
                if (!formData.category) {
                    toast.error('Parent category required');
                    return;
                }
                res = await api.post('/api/admin/subcategories/', { 
                    name: quickName, 
                    category: formData.category 
                });
                await fetchData(); // Refresh all lists
                setFormData(prev => ({ ...prev, subcategory: res.data.id }));
                setShowQuickSub(false);
            }
            setQuickName('');
            toast.success(`${type === 'category' ? 'Category' : 'Sub-category'} synthesized and synchronized`);
        } catch (error) {
            console.error('Quick add failed', error);
            toast.error(error.response?.data?.error || 'Quick synth failed');
        } finally {
            setQuickLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!subjectToDelete) return;
        setDeleteLoading(true);
        try {
            await api.delete(`/api/admin/subjects/${subjectToDelete.id}/`);
            toast.success('Subject purged');
            fetchData();
            setShowDeleteModal(false);
        } catch (error) {
            toast.error('Purge error');
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 md:pt-16 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-6">
                        <Link to="/om" className="group p-4 glass-card border-white/5 hover:border-accent-cyan/40 text-gray-400 hover:text-white transition-all duration-500">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="h-[1px] w-8 bg-accent-cyan/50"></span>
                                <span className="text-[10px] uppercase font-black tracking-[0.4em] text-accent-cyan">Data Anchors</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-gradient">
                                Subject Portal
                            </h1>
                        </div>
                    </div>

                    <button 
                        onClick={() => { setShowForm(true); setEditingSubject(null); setFormData({ name: '', description: '', category: '', subcategory: '' }); }}
                        className="px-8 py-4 bg-accent-cyan rounded-2xl text-dark font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-[0_10px_25px_rgba(34,211,238,0.25)] hover:scale-105 active:scale-95 transition-all group"
                    >
                        <Plus size={18} /> 
                        <span>Establish Subject</span>
                    </button>
                </header>

                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="mb-12"
                        >
                            <div className="glass-card border-accent-cyan/20 p-8 md:p-10 relative">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Tag size={120} />
                                </div>
                                <div className="flex justify-between items-center mb-10">
                                    <h2 className="text-2xl font-black italic uppercase text-white">
                                        {editingSubject ? 'Update Coordinates' : 'Initialize Anchor'}
                                    </h2>
                                    <button onClick={() => setShowForm(false)} className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all"><X size={20}/></button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Identity Name</label>
                                                <input 
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                    placeholder="e.g. Data Structures"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-accent-cyan/50 transition-all font-bold"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-end gap-3">
                                                    <div className="flex-1">
                                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Grid Category</label>
                                                        <select 
                                                            value={formData.category}
                                                            onChange={(e) => setFormData({...formData, category: e.target.value, subcategory: ''})}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 outline-none appearance-none focus:border-accent-cyan/50"
                                                        >
                                                            <option value="" className="bg-dark">Unlinked</option>
                                                            {categories.map(c => <option key={c.id} value={c.id} className="bg-dark">{c.name}</option>)}
                                                        </select>
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setShowQuickCat(true)}
                                                        className="p-5 bg-white/5 border border-white/10 rounded-2xl text-accent-cyan hover:bg-accent-cyan/10 transition-all"
                                                    >
                                                        <PlusCircle size={24} />
                                                    </button>
                                                </div>

                                                <div className="flex items-end gap-3">
                                                    <div className="flex-1">
                                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Sub-Sector</label>
                                                        <select 
                                                            value={formData.subcategory}
                                                            onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 outline-none appearance-none focus:border-accent-cyan/50"
                                                            disabled={!formData.category}
                                                        >
                                                            <option value="" className="bg-dark">Unlinked</option>
                                                            {subcategories.filter(sc => sc.category == formData.category).map(sc => (
                                                                <option key={sc.id} value={sc.id} className="bg-dark">{sc.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => { if(formData.category) setShowQuickSub(true); else toast.error('Select Grid first'); }}
                                                        className="p-5 bg-white/5 border border-white/10 rounded-2xl text-accent-cyan hover:bg-accent-cyan/10 transition-all disabled:opacity-20"
                                                    >
                                                        <PlusCircle size={24} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="h-full flex flex-col">
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Data Scope / Description</label>
                                                <textarea 
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                                    placeholder="Define the scope of this subject anchor..."
                                                    className="w-full flex-1 bg-white/5 border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-accent-cyan/50 transition-all resize-none min-h-[250px] font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        type="submit"
                                        className="w-full py-5 bg-white text-dark font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-accent-cyan hover:text-dark transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.99]"
                                    >
                                        <Save size={18} />
                                        Commit Subject to Central Grid
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Quick Modals */}
                <AnimatePresence>
                    {(showQuickCat || showQuickSub) && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-dark/90 backdrop-blur-xl">
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-full max-w-sm glass-card border-accent-cyan/30 p-10"
                            >
                                <h3 className="text-xl font-black italic uppercase text-accent-cyan mb-6">Quick Synth</h3>
                                <input 
                                    autoFocus
                                    type="text"
                                    value={quickName}
                                    onChange={(e) => setQuickName(e.target.value)}
                                    placeholder={showQuickCat ? "Category Name" : "Sub-Category Name"}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 mb-6 outline-none focus:border-accent-cyan"
                                />
                                <div className="flex gap-4">
                                    <button onClick={() => { setShowQuickCat(false); setShowQuickSub(false); }} className="flex-1 py-3 bg-white/5 rounded-xl font-black uppercase tracking-widest text-[10px]">Abort</button>
                                    <button 
                                        onClick={() => handleQuickAdd(showQuickCat ? 'category' : 'subcategory')}
                                        className="flex-[2] py-3 bg-accent-cyan text-dark rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-accent-cyan/20"
                                    >
                                        {quickLoading ? 'Synthesizing...' : 'Initialize'}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        Array(9).fill(0).map((_, i) => <div key={i} className="glass-card h-52 animate-pulse bg-white/5"></div>)
                    ) : subjects.map((sub, index) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.02 }}
                            key={sub.id} 
                            className="group glass-card border-white/5 hover:border-accent-cyan/30 p-8 transition-all duration-300 flex flex-col justify-between"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan">
                                    <Layers size={18} />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setEditingSubject(sub); setFormData(sub); setShowForm(true); }} className="p-2 hover:text-accent-cyan transition-colors"><Edit2 size={16} /></button>
                                    <button onClick={() => { setSubjectToDelete(sub); setShowDeleteModal(true); }} className="p-2 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-black italic uppercase text-white mb-2 group-hover:text-accent-cyan transition-colors">{sub.name}</h3>
                                <p className="text-gray-500 text-xs line-clamp-2 mb-6 font-medium leading-relaxed">{sub.description || 'No data scope defined.'}</p>
                            </div>
                            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                                    {sub.subcategory ? 'Link Established' : 'Standalone'}
                                </span>
                                <ChevronRight className="text-gray-700 group-hover:text-accent-cyan transition-colors" size={16} />
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
                title="Wipe Anchor"
                description={`Erasure of subject "${subjectToDelete?.name}" requested. All associated data will become unanchored. Confirm?`}
            />
        </div>
    );
};

export default AdminSubjectManager;
