import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    FileText, 
    ArrowLeft,
    Tag,
    Save,
    X,
    Paperclip,
    Database,
    Clock,
    User,
    ChevronRight,
    Search,
    Filter,
    Layers,
    PlusCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminNoteManager = () => {
    const [notes, setNotes] = useState([]);
    const [videos, setVideos] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        video: '',
        subject: '',
        tags: '',
        pdf_file: null
    });

    const [subjectFormData, setSubjectFormData] = useState({
        name: '',
        category: '',
        subcategory: ''
    });

    useEffect(() => {
        fetchData();
        fetchAuxiliaryData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [nResponse, vResponse, sResponse] = await Promise.all([
                axios.get('/api/admin/notes/'),
                axios.get('/api/admin/videos/'),
                axios.get('/api/admin/subjects/')
            ]);
            setNotes(nResponse.data.results || nResponse.data);
            setVideos(vResponse.data.results || vResponse.data);
            setSubjects(sResponse.data.results || sResponse.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAuxiliaryData = async () => {
        try {
            const [cResponse, scResponse] = await Promise.all([
                axios.get('/api/admin/categories/'),
                axios.get('/api/admin/subcategories/')
            ]);
            setCategories(cResponse.data.results || cResponse.data);
            setSubcategories(scResponse.data.results || scResponse.data);
        } catch (error) {
            console.error('Failed to fetch categories/subcategories', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;
        
        // Optimistic UI update
        const originalNotes = [...notes];
        setNotes(notes.filter(n => n.id !== id));

        try {
            await axios.delete(`/api/admin/notes/${id}/`);
        } catch (error) {
            console.error('Delete failed', error);
            setNotes(originalNotes);
            alert('Intel deletion failed. Sector synchronized.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('content', formData.content);
        data.append('video', formData.video);
        data.append('subject', formData.subject);
        data.append('tags', formData.tags);
        if (formData.pdf_file) {
            data.append('pdf_file', formData.pdf_file);
        }

        try {
            if (editingNote) {
                await axios.put(`/api/admin/notes/${editingNote.id}/`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post('/api/admin/notes/', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            fetchData();
            setShowForm(false);
            setEditingNote(null);
            setFormData({ title: '', content: '', video: '', subject: '', tags: '', pdf_file: null });
        } catch (error) {
            console.error('Save failed', error);
            alert('Transfer failed. Verify all sectors are correctly filled.');
        }
    };

    const handleSubjectSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/admin/subjects/', {
                name: subjectFormData.name,
                subcategory: subjectFormData.subcategory
            });
            const newSubject = response.data;
            setSubjects([...subjects, newSubject]);
            setFormData({ ...formData, subject: newSubject.id });
            setShowSubjectModal(false);
            setSubjectFormData({ name: '', category: '', subcategory: '' });
        } catch (error) {
            console.error('Subject creation failed', error);
            alert(error.response?.data?.error || 'Failed to create subject sector.');
        }
    };

    const getSubjectName = (id) => {
        const subject = subjects.find(s => s.id === parseInt(id));
        return subject ? subject.name : 'Unknown Sector';
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-8 md:pt-16 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-6">
                        <Link to="/om" className="group p-4 glass-card border-white/5 hover:border-accent-purple/40 text-gray-400 hover:text-white transition-all duration-500">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="h-[1px] w-8 bg-accent-purple/50"></span>
                                <span className="text-[10px] uppercase font-black tracking-[0.4em] text-accent-purple">System Management</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-gradient">
                                Intel Repository
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group hidden lg:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-purple transition-colors" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search intel database..." 
                                className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 outline-none focus:border-accent-purple/50 min-w-[300px] transition-all"
                            />
                        </div>
                        <button 
                            onClick={() => { setShowForm(true); setEditingNote(null); setFormData({ title: '', content: '', video: '', subject: '', tags: '', pdf_file: null }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="px-8 py-4 bg-accent-purple rounded-2xl text-white font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-[0_10px_25px_rgba(123,97,255,0.25)] hover:scale-105 active:scale-95 transition-all relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            <Plus size={18} /> 
                            <span>Forge Intel</span>
                        </button>
                    </div>
                </header>

                {/* Form Transition */}
                <AnimatePresence mode="wait">
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.98 }}
                            className="mb-12"
                        >
                            <div className="glass-card border-accent-purple/20 p-8 md:p-12 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Database size={120} />
                                </div>
                                
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mb-2">
                                            {editingNote ? 'Modify Data Object' : 'Register New Intel'}
                                        </h2>
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Sector: Intel Repository / Entry-Beta</p>
                                    </div>
                                    <button onClick={() => setShowForm(false)} className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="group">
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1 group-focus-within:text-accent-purple transition-colors">Data Title</label>
                                                <div className="relative">
                                                    <input 
                                                        type="text"
                                                        value={formData.title}
                                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                                        placeholder="Enter high-level classification..."
                                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 text-white outline-none focus:border-accent-purple/50 focus:bg-white/[0.05] transition-all"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="group">
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1 group-focus-within:text-accent-purple transition-colors">Subject Anchor</label>
                                                <div className="flex items-center gap-3">
                                                    <div className="relative flex-1">
                                                        <select 
                                                            value={formData.subject}
                                                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 text-white appearance-none outline-none focus:border-accent-purple/50 focus:bg-white/[0.05] transition-all"
                                                            required
                                                        >
                                                            <option value="" disabled className="bg-dark">Select Target Sector</option>
                                                            {subjects.map(s => <option key={s.id} value={s.id} className="bg-dark">{s.name}</option>)}
                                                        </select>
                                                        <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none rotate-90" size={16} />
                                                    </div>
                                                    <button 
                                                        type="button"
                                                        onClick={() => setShowSubjectModal(true)}
                                                        className="p-5 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-accent-purple hover:border-accent-purple/30 transition-all group/btn"
                                                        title="Add New Subject"
                                                    >
                                                        <PlusCircle size={24} className="group-hover/btn:scale-110 transition-transform" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="group">
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1 group-focus-within:text-accent-purple transition-colors">Module Association</label>
                                                <div className="relative">
                                                    <select 
                                                        value={formData.video}
                                                        onChange={(e) => setFormData({...formData, video: e.target.value})}
                                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 text-white appearance-none outline-none focus:border-accent-purple/50 focus:bg-white/[0.05] transition-all"
                                                        required
                                                    >
                                                        <option value="" disabled className="bg-dark">Linked Knowledge Block</option>
                                                        {videos.map(v => <option key={v.id} value={v.id} className="bg-dark">{v.title}</option>)}
                                                    </select>
                                                    <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none rotate-90" size={16} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="group h-full flex flex-col">
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1 group-focus-within:text-accent-purple transition-colors">Intel Core (Markdown)</label>
                                                <textarea 
                                                    value={formData.content}
                                                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                                                    placeholder="Input detailed intelligence reports..."
                                                    className="w-full flex-1 bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 text-white outline-none focus:border-accent-purple/50 focus:bg-white/[0.05] transition-all resize-none min-h-[220px]"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8 items-end">
                                        <div className="group">
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1 group-focus-within:text-accent-purple transition-colors">Classification Tags</label>
                                            <div className="relative">
                                                <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                                                <input 
                                                    type="text"
                                                    value={formData.tags}
                                                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                                                    placeholder="tag1, tag2, tag3"
                                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white outline-none focus:border-accent-purple/50 transition-all text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="relative flex-1">
                                                <input 
                                                    type="file"
                                                    onChange={(e) => setFormData({...formData, pdf_file: e.target.files[0]})}
                                                    className="hidden"
                                                    id="pdf-upload"
                                                />
                                                <label htmlFor="pdf-upload" className="w-full bg-white/[0.03] border-2 border-dashed border-white/10 rounded-2xl py-[18px] px-6 text-[10px] font-black uppercase tracking-widest text-gray-500 cursor-pointer hover:bg-white/5 hover:border-accent-purple/40 hover:text-white transition-all flex items-center justify-center gap-3">
                                                    {formData.pdf_file ? <span className="text-accent-cyan flex items-center gap-2"><Paperclip size={14} /> Artifact Locked</span> : <><Paperclip size={16} /> Attach PDF Document</>}
                                                </label>
                                            </div>
                                            <button 
                                                type="submit"
                                                className="px-10 py-[18px] bg-white text-dark rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-accent-purple hover:text-white transition-all shadow-xl active:scale-95"
                                            >
                                                <Save size={18} />
                                                <span>Commit</span>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content Info */}
                <div className="flex items-center justify-between mb-8 px-2">
                    <div className="flex items-center gap-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 flex items-center gap-3">
                            <Layers size={14} className="text-accent-purple" />
                            Active Records
                        </h3>
                        <div className="h-4 w-[1px] bg-white/10"></div>
                        <span className="text-[10px] font-black text-accent-purple bg-accent-purple/10 px-3 py-1 rounded-full">{notes.length} Total</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                            <button className="px-4 py-2 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">All</button>
                            <button className="px-4 py-2 text-gray-500 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">Recent</button>
                        </div>
                    </div>
                </div>

                {/* Notes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="glass-card h-64 animate-pulse bg-white/5 border-white/5"></div>
                        ))
                    ) : notes.length > 0 ? (
                        notes.map((note, index) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={note.id} 
                                className="group glass-card border-white/5 hover:border-accent-purple/30 transition-all duration-500 flex flex-col h-full bg-white/[0.01] hover:bg-white/[0.03] overflow-hidden"
                            >
                                {/* Card Header */}
                                <div className="p-8 pb-0 flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-accent-purple/10 flex items-center justify-center border border-accent-purple/20 group-hover:border-accent-purple/40 group-hover:bg-accent-purple/20 transition-all duration-500">
                                        <FileText className="text-accent-purple" size={20} />
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => { setEditingNote(note); setFormData({...note, pdf_file: null}); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                                            className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-accent-purple hover:bg-accent-purple/10 transition-all"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(note.id)} 
                                            className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="px-8 flex-1">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-accent-purple">{getSubjectName(note.subject)}</span>
                                        <span className="w-1 h-1 rounded-full bg-white/10"></span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{formatDate(note.created_at)}</span>
                                    </div>
                                    <h3 className="text-xl font-black italic uppercase tracking-tight mb-4 group-hover:text-accent-purple transition-colors duration-500 leading-tight line-clamp-2">
                                        {note.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm line-clamp-3 mb-8 font-medium leading-relaxed group-hover:text-gray-400 transition-colors">
                                        {note.content.substring(0, 100)}{note.content.length > 100 ? '...' : ''}
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="mt-auto px-8 py-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                                    <div className="flex flex-wrap gap-2">
                                        {(note.tags || 'Intel').split(',').slice(0, 2).map((tag, i) => (
                                            <span key={i} className="text-[9px] font-black uppercase tracking-widest text-gray-500 bg-white/5 px-2 py-1 rounded-md">
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                    {note.pdf_file && (
                                        <div className="flex items-center gap-1.5 text-accent-cyan animate-pulse">
                                            <Paperclip size={12} />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Doc</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center glass-card border-dashed border-white/10 bg-transparent">
                            <Database size={48} className="text-gray-700 mb-6" />
                            <p className="text-gray-600 font-black uppercase tracking-[0.3em] text-xs">No intelligence records found in this sector.</p>
                            <button onClick={() => setShowForm(true)} className="mt-8 text-accent-purple text-[10px] font-black uppercase tracking-[0.2em] hover:tracking-[0.3em] transition-all">Initialise First Entry</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Subject Creation Modal */}
            <AnimatePresence>
                {showSubjectModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-dark/90 backdrop-blur-md">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-lg glass-card border-accent-purple/30 p-8 md:p-10 relative"
                        >
                            <button onClick={() => setShowSubjectModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><X /></button>
                            
                            <div className="mb-10">
                                <h2 className="text-2xl font-black italic uppercase text-gradient mb-2">Initialize Sector</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Create new subject anchor point</p>
                            </div>

                            <form onSubmit={handleSubjectSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1">Sector Name</label>
                                    <input 
                                        type="text"
                                        value={subjectFormData.name}
                                        onChange={(e) => setSubjectFormData({...subjectFormData, name: e.target.value})}
                                        placeholder="e.g. Quantum Computing"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-accent-purple/50 transition-all"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1">Primary Grid</label>
                                        <select 
                                            value={subjectFormData.category}
                                            onChange={(e) => setSubjectFormData({...subjectFormData, category: e.target.value, subcategory: ''})}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white appearance-none outline-none focus:border-accent-purple/50"
                                            required
                                        >
                                            <option value="" disabled className="bg-dark">Select Category</option>
                                            {categories.map(c => <option key={c.id} value={c.id} className="bg-dark">{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1">Sub-Sector</label>
                                        <select 
                                            value={subjectFormData.subcategory}
                                            onChange={(e) => setSubjectFormData({...subjectFormData, subcategory: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white appearance-none outline-none focus:border-accent-purple/50"
                                            required
                                            disabled={!subjectFormData.category}
                                        >
                                            <option value="" disabled className="bg-dark">Select Subcategory</option>
                                            {subcategories.filter(sc => sc.category == subjectFormData.category).map(sc => (
                                                <option key={sc.id} value={sc.id} className="bg-dark">{sc.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full py-5 bg-accent-purple rounded-xl text-white font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
                                >
                                    Establish Link <Database size={18} />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminNoteManager;
