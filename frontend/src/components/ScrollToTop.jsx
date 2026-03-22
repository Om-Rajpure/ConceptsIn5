import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop Component
 * Resets the window scroll position to (0,0) whenever the pathname changes.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediate scroll to top
    window.scrollTo(0, 0);
    
    // Fallback for some browsers/layouts that might need a tiny delay
    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
