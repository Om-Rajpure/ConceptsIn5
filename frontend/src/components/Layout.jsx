import { motion } from 'framer-motion';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-dark text-white relative overflow-hidden font-outfit">
      {/* Absolute Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Subtle Grid Lines */}
        <div className="absolute inset-0 bg-grid opacity-20" />
        
        {/* Large Floating Glowing Orbs */}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 80, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent-purple/10 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, -60, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-accent-blue/10 blur-[100px] rounded-full" 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-transparent via-dark/40 to-dark opacity-80" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full">
        {children}
      </div>

      {/* Subtle Noise / Particle Texture Overlay (Optional but nice) */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
    </div>
  );
}
