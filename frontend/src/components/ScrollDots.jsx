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
/**
 * ScrollDots Component
 * 
 * @param {Object} props
 * @param {number} props.count - Total number of items/pages
 * @param {number} props.activeIndex - Current active index
 * @param {string} props.color - Neon color theme (blue or purple)
 * @param {function} props.onDotClick - Optional click handler (index)
 * @param {boolean} props.hideOnDesktop - Whether to hide on md screens (default true)
 */
const ScrollDots = ({ count, activeIndex, color = 'blue', onDotClick, hideOnDesktop = true }) => {
  if (count <= 1) return null;

  const dotColor = color === 'blue' ? '#00F0FF' : '#7B61FF';
  const glowShadow = color === 'blue' 
    ? '0 0 10px rgba(0, 240, 255, 0.5)' 
    : '0 0 10px rgba(123, 97, 255, 0.5)';

  return (
    <div className={`flex justify-center items-center gap-2.5 mt-6 mb-2 ${hideOnDesktop ? 'md:hidden' : ''}`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.button
          key={i}
          onClick={() => onDotClick && onDotClick(i)}
          initial={false}
          animate={{
            scale: i === activeIndex ? 1.3 : 1,
            backgroundColor: i === activeIndex ? dotColor : 'rgba(255, 255, 255, 0.2)',
            boxShadow: i === activeIndex ? glowShadow : 'none',
            opacity: i === activeIndex ? 1 : 0.4
          }}
          whileHover={{ scale: 1.4, opacity: 0.8 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="w-1.5 h-1.5 rounded-full cursor-pointer focus:outline-none"
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
};

export default ScrollDots;
