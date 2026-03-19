import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, FileText, CheckCircle } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function TopicPage() {
  const { id } = useParams();

  return (
    <div className="pt-40 pb-20 px-6 max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-accent-blue mb-8 hover:translate-x-[-4px] transition-transform font-bold text-sm uppercase tracking-widest">
        <ArrowLeft size={16} /> Back to Base
      </Link>
      
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight italic">
          Topic: <span className="text-gradient uppercase">{id?.replace(/-/g, ' ')}</span>
        </h1>
        <p className="text-xl text-gray-400 font-light">
          This is a placeholder for the specialized topic learning interface. 
          Soon, you'll find high-octane 5-minute videos and exam-ready notes here.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <GlassCard className="text-center p-8 bg-white/[0.02]">
          <Play className="mx-auto mb-4 text-accent-purple" size={32} />
          <h3 className="font-bold mb-2">Video Lesson</h3>
          <p className="text-xs text-gray-500">5 Min High-Density Content</p>
        </GlassCard>
        <GlassCard className="text-center p-8 bg-white/[0.02]">
          <FileText className="mx-auto mb-4 text-accent-blue" size={32} />
          <h3 className="font-bold mb-2">Study Notes</h3>
          <p className="text-xs text-gray-500">Exam-Focused Gists</p>
        </GlassCard>
        <GlassCard className="text-center p-8 bg-white/[0.02]">
          <CheckCircle className="mx-auto mb-4 text-accent-cyan" size={32} />
          <h3 className="font-bold mb-2">Quick Quiz</h3>
          <p className="text-xs text-gray-500">Test Your Knowledge</p>
        </GlassCard>
      </div>
      
      <div className="mt-20 p-12 glass-card text-center border-accent-purple/20 bg-accent-purple/[0.02]">
        <h2 className="text-2xl font-black mb-4 uppercase tracking-[0.2em] text-accent-purple">Content Incoming</h2>
        <p className="text-gray-400">Our AI agents are currently distilling this topic into a 5-minute masterpiece.</p>
      </div>
    </div>
  );
}
