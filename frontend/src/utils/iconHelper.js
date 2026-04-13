import * as LucideIcons from 'lucide-react';

/**
 * Maps a string name to a Lucide icon component.
 * Fallback to 'Box' if not found.
 */
export const getIcon = (iconName) => {
    if (!iconName) return LucideIcons.Layers;
    
    // Normalize string: capitalize first letter of each word if needed
    // Lucide names are PascalCase: 'BookOpen', 'FileText'
    const name = iconName.charAt(0).toUpperCase() + iconName.slice(1);
    
    const Icon = LucideIcons[name] || LucideIcons[name.replace(/\s+/g, '')] || LucideIcons.Layers;
    return Icon;
};
