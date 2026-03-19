import React from 'react';
import { motion } from 'framer-motion';

/**
 * ScrollDots Component
 * 
 * @param {Object} props
 * @param {number} props.count - Total number of items/pages
 * @param {number} props.activeIndex - Current active index
 * @param {string} props.color - Neon color theme (blue or purple)
 */
const ScrollDots = ({ count, activeIndex, color = 'blue' }) => {
  if (count <= 1) return null;

  const dotColor = color === 'blue' ? '#00F0FF' : '#7B61FF';
  const glowShadow = color === 'blue' 
    ? '0 0 10px rgba(0, 240, 255, 0.5)' 
    : '0 0 10px rgba(123, 97, 255, 0.5)';

  return (
    <div className="flex justify-center items-center gap-2 mt-4 md:hidden">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{
            scale: i === activeIndex ? 1.2 : 1,
            backgroundColor: i === activeIndex ? dotColor : 'rgba(255, 255, 255, 0.2)',
            boxShadow: i === activeIndex ? glowShadow : 'none',
          }}
          transition={{ duration: 0.3 }}
          className="w-1.5 h-1.5 rounded-full"
        />
      ))}
    </div>
  );
};

export default ScrollDots;
