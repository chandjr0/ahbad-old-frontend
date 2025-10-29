"use client";
import { useEffect } from "react";

export default function useScrollRestoration() {
  useEffect(() => {
    // Store scroll position in localStorage when navigating away
    const handleClick = (event) => {
      // Check if this is a link click that will navigate to a new page
      if (event.target.tagName === 'A' || event.target.closest('a')) {
        // Save current scroll position with timestamp to avoid stale data
        localStorage.setItem('lastScrollPosition', JSON.stringify({
          position: window.scrollY,
          time: Date.now()
        }));
      }
    };

    // When user navigates back, restore the scroll position
    const handlePopState = () => {
      try {
        const savedData = JSON.parse(localStorage.getItem('lastScrollPosition'));
        
        // Only restore if saved data exists and is recent (within 5 minutes)
        if (savedData && (Date.now() - savedData.time < 5 * 60 * 1000)) {
          // Use setTimeout to ensure the DOM has updated
          setTimeout(() => {
            window.scrollTo({
              top: savedData.position,
              behavior: 'auto'
            });
          }, 100);
        }
      } catch (e) {
        console.error('Error restoring scroll position:', e);
      }
    };

    // Force the browser to allow scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Add event listeners
    document.addEventListener('click', handleClick);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return null;
} 