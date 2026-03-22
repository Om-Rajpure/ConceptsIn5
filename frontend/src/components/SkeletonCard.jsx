import React from 'react';

/**
 * SkeletonCard - A futuristic pulse-animated placeholder for videos and notes.
 * Matches the glass-card aesthetic of ConceptsIn5.
 */
export default function SkeletonCard({ type = 'video' }) {
  return (
    <div className="relative overflow-hidden glass-card border-white/5 bg-white/[0.02] rounded-3xl animate-pulse">
      {/* Thumbnail Area */}
      <div className={`relative w-full ${type === 'video' ? 'aspect-video' : 'aspect-[4/3]'} bg-white/5`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
      </div>
      
      {/* Content Area */}
      <div className="p-6 space-y-4">
        {/* Meta tags skeleton */}
        <div className="flex gap-2">
          <div className="h-3 w-12 bg-white/5 rounded"></div>
          <div className="h-3 w-12 bg-white/5 rounded"></div>
        </div>
        
        {/* Title skeleton */}
        <div className="h-6 w-3/4 bg-white/10 rounded-lg"></div>
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-white/5 rounded"></div>
          <div className="h-3 w-5/6 bg-white/5 rounded"></div>
        </div>
        
        {/* Footer/Action skeleton */}
        <div className="pt-4 flex justify-between items-center border-t border-white/5">
          <div className="h-3 w-20 bg-white/5 rounded"></div>
          <div className="h-3 w-16 bg-accent-blue/10 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonSubject() {
  return (
    <div className="glass-card border-white/5 bg-white/[0.02] p-6 rounded-2xl animate-pulse flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-white/5"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/2 bg-white/10 rounded"></div>
        <div className="h-3 w-1/3 bg-white/5 rounded"></div>
      </div>
    </div>
  );
}
