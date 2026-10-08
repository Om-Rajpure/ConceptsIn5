import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { 
  Linkedin, 
  Youtube, 
  Instagram,
  Github
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
import ReelsPage from './pages/ReelsPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';

// Admin Pages
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminVideoManager from './pages/admin/AdminVideoManager';
import AdminNoteManager from './pages/admin/AdminNoteManager';
import AdminReelManager from './pages/admin/AdminReelManager';
import AdminCategoryManager from './pages/admin/AdminCategoryManager';
import AdminSubCategoryManager from './pages/admin/AdminSubCategoryManager';
import AdminSubjectManager from './pages/admin/AdminSubjectManager';


export default function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Layout>
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/subject/:slug" element={<SubjectPage />} />
          <Route path="/topic/:id" element={<TopicPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/video/:id" element={<VideoPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/reels" element={<ReelsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin Routes — hidden from public navigation */}
          <Route path="/admin-portal/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
              <Route path="/admin-portal" element={<AdminDashboard />} />
              <Route path="/admin-portal/videos" element={<AdminVideoManager />} />
              <Route path="/admin-portal/notes" element={<AdminNoteManager />} />
              <Route path="/admin-portal/reels" element={<AdminReelManager />} />
              <Route path="/admin-portal/categories" element={<AdminCategoryManager />} />
              <Route path="/admin-portal/subcategories" element={<AdminSubCategoryManager />} />
              <Route path="/admin-portal/subjects" element={<AdminSubjectManager />} />
          </Route>

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Global Footer */}
        <footer className="py-20 px-6 border-t border-white/5 relative z-10 bg-dark/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="text-3xl font-black tracking-tighter text-gradient mb-6">
                ConceptsIn5
              </div>
              <p className="text-gray-500 text-lg max-w-sm leading-relaxed">
                An AI-powered micro-learning platform that helps engineering students 
                understand complex technical concepts in 5 minutes.
              </p>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-widest mb-8 text-white">Learn</h4>
              <div className="flex flex-col gap-4 text-gray-500 text-base">
                <Link to="/notes" className="hover:text-accent-blue transition-colors">Study Notes</Link>
                <Link to="/reels" className="hover:text-accent-blue transition-colors">Quick Concepts</Link>
                <Link to="/about" className="hover:text-accent-blue transition-colors">About</Link>
              </div>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-widest mb-8 text-white">Company</h4>
              <div className="flex flex-col gap-4 text-gray-500 text-base">
                <Link to="/contact" className="hover:text-accent-purple transition-colors">Contact</Link>
                <Link to="/privacy" className="hover:text-accent-purple transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-accent-purple transition-colors">Terms of Use</Link>
              </div>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-gray-600 font-medium">
              © 2026 ConceptsIn5. All rights reserved.
            </div>
            <div className="flex gap-8 justify-center lg:justify-start grayscale hover:grayscale-0 transition-all items-center">
              <a href="https://instagram.com/conceptsin5" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors">
                <Instagram size={24} />
              </a>
              <a href="https://youtube.com/@conceptsin5" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
                <Youtube size={24} />
              </a>
              <a href="https://linkedin.com/in/om-rajpure" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="https://github.com/Om-Rajpure" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Github size={24} />
              </a>
            </div>
          </div>
        </footer>
      </Layout>
    </Router>
  );
}
