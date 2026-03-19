/**
 * Performs a global search across subjects, videos, and notes.
 * @param {string} query - The search query.
 * @param {object} data - An object containing subjects, videos, and notes arrays.
 * @returns {object} - Categorized search results.
 */
export function globalSearch(query, { subjects, videos, notes }) {
  if (!query || query.trim() === "") {
    return { subjects: [], videos: [], notes: [] };
  }

  const q = query.toLowerCase();

  const videoResults = videos.filter(v =>
    v.title.toLowerCase().includes(q) ||
    v.description.toLowerCase().includes(q) ||
    (v.topicsCovered && v.topicsCovered.some(t => t.toLowerCase().includes(q))) ||
    (v.tags && v.tags.some(tag => tag.toLowerCase().includes(q)))
  );

  const subjectResults = subjects.filter(s =>
    s.title.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q) ||
    (s.tags && s.tags.some(tag => tag.toLowerCase().includes(q))) ||
    (s.subcategory && s.subcategory.toLowerCase().includes(q))
  );

  const noteResults = notes.filter(n =>
    n.title.toLowerCase().includes(q) ||
    n.description.toLowerCase().includes(q) ||
    (n.tags && n.tags.some(tag => tag.toLowerCase().includes(q))) ||
    (n.content && n.content.toLowerCase().includes(q))
  );

  return {
    videos: videoResults,
    subjects: subjectResults,
    notes: noteResults
  };
}
