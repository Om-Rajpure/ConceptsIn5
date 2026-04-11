/**
 * Utility functions for YouTube interactions in the frontend.
 */

/**
 * Extracts the 11-character YouTube video ID from various URL formats.
 * @param {string} url - The YouTube URL.
 * @returns {string|null} - The video ID or null if not found.
 */
export const extractVideoId = (url) => {
    if (!url) return null;
    
    const patterns = [
        /shorts\/([0-9A-Za-z_-]{11})/,
        /watch\?v=([0-9A-Za-z_-]{11})/,
        /(?:v=|\/|vi\/|youtu\.be\/|embed\/)([0-9A-Za-z_-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }

    return null;
};

/**
 * Generates the standard high-resolution YouTube thumbnail URL.
 * @param {string} url - The YouTube URL.
 * @returns {string} - The thumbnail URL.
 */
export const getYoutubeThumbnail = (url) => {
    const videoId = extractVideoId(url);
    if (!videoId) return 'https://via.placeholder.com/400x711?text=No+Preview';
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};
