import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  Linkedin, 
  Youtube, 
  Instagram,
  Lock,
  ShieldCheck
} from 'lucide-react';
import Navbar from './components/Navbar';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import SubjectPage from './pages/SubjectPage';
import CategoryPage from './pages/CategoryPage';
import TopicPage from './pages/TopicPage';
import NotesPage from './pages/NotesPage';
import VideoPage from './pages/VideoPage';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';

// Admin Pages
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminVideoManager from './pages/admin/AdminVideoManager';
import AdminNoteManager from './pages/admin/AdminNoteManager';


export default function App() {
  return (
    <Router>
      <Layout>
        <Navbar />
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/subject/:id" element={<SubjectPage />} />
          <Route path="/topic/:id" element={<TopicPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/video/:id" element={<VideoPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/search" element={<SearchPage />} />

          {/* Admin Routes */}
          <Route path="/om/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
              <Route path="/om" element={<AdminDashboard />} />
              <Route path="/om/videos" element={<AdminVideoManager />} />
              <Route path="/om/notes" element={<AdminNoteManager />} />
          </Route>
        </Routes>

        {/* Global Footer (Common to all pages) */}
        <footer className="py-20 px-6 border-t border-white/5 relative z-10 bg-dark/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="text-3xl font-black tracking-tighter text-gradient mb-6">
                ConceptsIn5
              </div>
              <p className="text-gray-500 text-lg max-w-sm leading-relaxed">
                We provide high-octane engineering knowledge in 5-minute packets. 
                Designed for the modern student who values time.
              </p>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-widest mb-8 text-white">Navigation</h4>
              <div className="flex flex-col gap-4 text-gray-500 text-base">
                <a href="#" className="hover:text-accent-blue transition-colors">Subjects</a>
                <a href="#" className="hover:text-accent-blue transition-colors">AI Tools</a>
                <a href="#" className="hover:text-accent-blue transition-colors">Study Guides</a>
              </div>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-widest mb-8 text-white">System</h4>
              <div className="flex flex-col gap-4 text-gray-500 text-base">
                <a href="#" className="hover:text-accent-purple transition-colors">Status</a>
                <a href="#" className="hover:text-accent-purple transition-colors">Support</a>
                <a href="#" className="hover:text-accent-purple transition-colors">Contact</a>
              </div>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-gray-600 font-medium uppercase tracking-[0.2em]">
              © 2026 ConceptsIn5. Initializing Success.
            </div>
            <div className="flex gap-10 text-gray-500 items-center">
              <a href="https://youtube.com/@conceptsin5" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/conceptsin5" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/om-rajpure" target="_blank" rel="noopener noreferrer" className="hover:text-accent-blue transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <Link to="/om/login" className="hover:text-accent-purple transition-colors p-2 glass-card border-white/5 border">
                 <Lock className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </footer>
      </Layout>
    </Router>
  );
}
