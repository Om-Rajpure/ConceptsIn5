import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-32 pb-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div {...fadeInUp} className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 glass-card border-accent-blue/30 text-accent-blue text-[10px] font-black uppercase tracking-[0.2em]">
            <FileText size={12} /> Terms of Use
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Terms of Use
          </h1>
          <p className="text-gray-400 text-lg">Last updated: October 2026</p>
        </motion.div>

        <motion.div {...fadeInUp} className="space-y-8">
          <GlassCard className="p-10 border-white/5">
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">1. Acceptance of Terms</h2>
            <p className="text-gray-400 leading-relaxed">
              By accessing or using ConceptsIn5 ("the Platform"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Platform. These terms apply to all visitors, users, and others who access or use the Platform.
            </p>
          </GlassCard>

          <GlassCard className="p-10 border-white/5">
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">2. Use of the Platform</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              ConceptsIn5 provides educational content including videos, notes, and AI-powered learning assistance. You agree to:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>Use the Platform only for lawful educational purposes.</li>
              <li>Not reproduce, distribute, or commercialize any content from the Platform without written permission.</li>
              <li>Not attempt to reverse engineer, scrape, or abuse the Platform or its APIs.</li>
              <li>Not submit harmful, offensive, or misleading content through the AI Concept Tutor.</li>
            </ul>
          </GlassCard>

          <GlassCard className="p-10 border-white/5">
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">3. AI-Generated Content</h2>
            <p className="text-gray-400 leading-relaxed">
              The AI Concept Tutor feature uses Anthropic's Claude to generate educational explanations. AI-generated content is provided for educational assistance only and may not always be accurate. Do not rely on AI responses for critical academic assessments without independent verification. ConceptsIn5 is not responsible for errors in AI-generated responses.
            </p>
          </GlassCard>

          <GlassCard className="p-10 border-white/5">
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">4. Intellectual Property</h2>
            <p className="text-gray-400 leading-relaxed">
              All content on ConceptsIn5 — including videos, notes, text, graphics, and code — is the intellectual property of ConceptsIn5 or its content creators unless otherwise stated. You may use platform content for personal, non-commercial educational purposes only.
            </p>
          </GlassCard>

          <GlassCard className="p-10 border-white/5">
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">5. Disclaimer of Warranties</h2>
            <p className="text-gray-400 leading-relaxed">
              The Platform is provided "as is" without any warranties, express or implied. ConceptsIn5 does not guarantee that the Platform will be error-free, uninterrupted, or that content will always be current and accurate. Use the Platform at your own discretion.
            </p>
          </GlassCard>

          <GlassCard className="p-10 border-white/5">
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">6. Limitation of Liability</h2>
            <p className="text-gray-400 leading-relaxed">
              To the maximum extent permitted by applicable law, ConceptsIn5 shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the Platform or its content.
            </p>
          </GlassCard>

          <GlassCard className="p-10 border-white/5">
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">7. Changes to Terms</h2>
            <p className="text-gray-400 leading-relaxed">
              We reserve the right to update these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the revised Terms. The "last updated" date at the top of this page reflects the most recent revision.
            </p>
          </GlassCard>

          <GlassCard className="p-10 border-white/5">
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">8. Contact</h2>
            <p className="text-gray-400 leading-relaxed">
              Questions about these Terms? Reach us through our <a href="/contact" className="text-accent-blue hover:underline">Contact page</a>.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
