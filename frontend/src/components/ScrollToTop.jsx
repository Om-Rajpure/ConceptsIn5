import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop Component
 * Resets the window scroll position to (0,0) whenever the pathname changes.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediate scroll to top with smooth behavior
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    
    // Fallback for some browsers/layouts that might need a tiny delay
    const timeout = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 0);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
