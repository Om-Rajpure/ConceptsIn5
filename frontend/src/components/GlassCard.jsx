import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function GlassCard({ children, className, glow = false, neonColor = "purple" }) {
  const glowClasses = {
    purple: "neon-border-purple",
    blue: "neon-border-blue",
    cyan: "neon-border-blue" // Using blue for cyan for now unless we need a specific cyan class
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "glass-card p-6 relative overflow-hidden group transition-all duration-500",
        "energy-sweep-parent hover:bg-white/[0.05]",
        glow && glowClasses[neonColor],
        className
      )}
    >
      <div className="absolute inset-0 bg-glass-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
