import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-32 pb-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div {...fadeInUp} className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 glass-card border-accent-blue/30 text-accent-blue text-[10px] font-black uppercase tracking-[0.2em]">
            <Shield size={12} /> Privacy Policy
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-lg">Last updated: October 2026</p>
        </motion.div>

        <motion.div {...fadeInUp} className="space-y-8">
          <GlassCard className="p-10 border-white/5">
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">1. Information We Collect</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              ConceptsIn5 is a content platform. We collect minimal data to operate the service:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>Browser storage (localStorage) to save your learning progress locally on your device. This data never leaves your browser.</li>
              <li>Anonymous usage analytics via standard web analytics tools to understand how the platform is used.</li>
              <li>Any information you voluntarily submit through contact forms.</li>
            </ul>
          </GlassCard>

          <GlassCard className="p-10 border-white/5">
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">2. AI Features</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              ConceptsIn5 offers an AI-powered Concept Tutor feature powered by Anthropic's Claude API. When you use this feature:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>Your questions are sent to our backend server, which then queries the Claude API.</li>
              <li>Questions are processed to provide educational responses and are not stored permanently.</li>
              <li>Your API queries are subject to Anthropic's privacy policy at <a href="https://www.anthropic.com/privacy" className="text-accent-blue hover:underline" target="_blank" rel="noopener noreferrer">anthropic.com/privacy</a>.</li>
              <li>Do not submit personally identifiable information through the AI tutor.</li>
            </ul>
          </GlassCard>

          <GlassCard className="p-10 border-white/5">
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">3. Cookies</h2>
            <p className="text-gray-400 leading-relaxed">
              We use browser localStorage (not cookies) to save your study progress locally. No tracking cookies are set by ConceptsIn5. Third-party services embedded on this site (such as YouTube video players) may set their own cookies subject to their respective privacy policies.
            </p>
          </GlassCard>

          <GlassCard className="p-10 border-white/5">
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">4. Data Sharing</h2>
            <p className="text-gray-400 leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We do not share data with advertisers. We share data only with service providers necessary to operate the platform (cloud hosting, AI APIs) and only to the extent required to deliver the service.
            </p>
          </GlassCard>

          <GlassCard className="p-10 border-white/5">
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">5. Data Retention</h2>
            <p className="text-gray-400 leading-relaxed">
              Learning progress data is stored only in your browser's localStorage and can be cleared at any time by clearing browser data. Contact form submissions are retained only as long as necessary to respond to your inquiry.
            </p>
          </GlassCard>

          <GlassCard className="p-10 border-white/5">
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">6. Contact</h2>
            <p className="text-gray-400 leading-relaxed">
              If you have questions about this privacy policy, please contact us through our <a href="/contact" className="text-accent-blue hover:underline">Contact page</a>.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
