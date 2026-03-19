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
    Type,
    Save,
    X,
    ChevronDown,
    Paperclip
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminNoteManager = () => {
    const [notes, setNotes] = useState([]);
    const [videos, setVideos] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        video: '',
        subject: '',
        tags: '',
        pdf_file: null
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [nResponse, vResponse, sResponse] = await Promise.all([
                axios.get('/api/admin/notes/'),
                axios.get('/api/admin/videos/'),
                axios.get('/api/public/subjects/')
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

    const handleDelete = async (id) => {
        if (!window.confirm('Erase this intel block?')) return;
        try {
            await axios.delete(`/api/admin/notes/${id}/`);
            setNotes(notes.filter(n => n.id !== id));
        } catch (error) {
            console.error('Delete failed', error);
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
            setFormData({ title: '', content: '', video: '', subject: '', tags: '', pdf_file: null });
        } catch (error) {
            console.error('Save failed', error);
            alert('Transfer failed. Verify all sectors are correctly filled.');
        }
    };

    return (
        <div className="min-h-screen bg-dark text-white p-6 md:p-12">
            <header className="mb-12 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link to="/om" className="p-3 glass-card border-white/5 hover:border-accent-purple/30 text-gray-400 hover:text-white transition-all">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase text-gradient">
                        Intel Repository
                    </h1>
                </div>
                <button 
                    onClick={() => { setShowForm(true); setEditingNote(null); }}
                    className="px-6 py-3 bg-accent-purple rounded-xl text-white font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-[0_5px_15px_rgba(123,97,255,0.2)] hover:scale-105 transition-all"
                >
                    <Plus size={16} /> Forge Intel Block
                </button>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-20 opacity-50 uppercase tracking-[0.3em] font-black italic">Deciphering Logs...</div>
                ) : notes.map(note => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={note.id} 
                        className="glass-card p-8 border-white/5 hover:border-accent-purple/30 transition-all flex flex-col h-full bg-white/[0.01]"
                    >
                        <div className="mb-6 flex justify-between items-start">
                            <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center border border-accent-purple/20">
                                <FileText className="text-accent-purple" size={18} />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { setEditingNote(note); setFormData({...note, pdf_file: null}); setShowForm(true); }} className="p-2 hover:text-accent-purple transition-colors"><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(note.id)} className="p-2 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <h3 className="text-xl font-black italic uppercase tracking-tight mb-4 line-clamp-2">{note.title}</h3>
                        <p className="text-gray-500 text-sm line-clamp-3 mb-6 font-medium leading-relaxed">{note.content}</p>
                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                             <span className="flex items-center gap-2"><Tag size={12} className="text-accent-purple" /> {note.tags.split(',')[0] || 'Intel'}</span>
                             {note.pdf_file && <span className="flex items-center gap-1.5 text-accent-cyan"><Paperclip size={12} /> Encrypted.pdf</span>}
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-dark/80 backdrop-blur-sm overflow-y-auto">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full max-w-2xl glass-card border-white/10 p-8 sm:p-12 relative"
                        >
                            <button onClick={() => setShowForm(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"><X /></button>
                            <h2 className="text-3xl font-black italic uppercase text-gradient mb-10">
                                {editingNote ? 'Modify Intel' : 'New Intel Entry'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Subject Anchor</label>
                                    <select 
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white appearance-none outline-none focus:border-accent-purple"
                                        required
                                    >
                                        <option value="" disabled>Target Subject</option>
                                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Connected Module</label>
                                    <select 
                                        value={formData.video}
                                        onChange={(e) => setFormData({...formData, video: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white appearance-none outline-none focus:border-accent-purple"
                                        required
                                    >
                                        <option value="" disabled>Target Module</option>
                                        {videos.map(v => <option key={v.id} value={v.id}>{v.title}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <input 
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        placeholder="Entry Headline"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-accent-purple"
                                        required
                                    />
                                </div>
                                <div>
                                    <textarea 
                                        value={formData.content}
                                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                                        placeholder="Detailed Content (Markdown Supported)"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-accent-purple h-48"
                                        required
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <input 
                                        type="text"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                                        placeholder="Identification Tags (Tags, Tags...)"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-sm"
                                    />
                                    <div className="relative">
                                        <input 
                                            type="file"
                                            onChange={(e) => setFormData({...formData, pdf_file: e.target.files[0]})}
                                            className="hidden"
                                            id="pdf-upload"
                                        />
                                        <label htmlFor="pdf-upload" className="w-full bg-white/5 border border-dashed border-white/20 rounded-xl py-4 px-4 text-xs font-black uppercase tracking-widest text-gray-500 cursor-pointer hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                            {formData.pdf_file ? 'Payload Locked' : 'Attach PDF Document'} <Paperclip size={14} />
                                        </label>
                                    </div>
                                </div>
                                <button 
                                    type="submit"
                                    className="w-full py-5 bg-accent-purple rounded-xl text-white font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(123,97,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                >
                                    Commit to Database <Save size={18} />
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
