import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if a CSS media query matches the current viewport.
 * 
 * @param query - Any valid CSS media query, e.g. '(min-width: 768px)' or '(max-width: 1024px)'
 * @returns boolean indicating if the condition is met
 */
export function useMediaQuery(query: string): boolean {
  // Default to false for SSR; will update on the client
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQueryList = window.matchMedia(query);
    
    setMatches(mediaQueryList.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', listener);
    } else {
      mediaQueryList.addListener(listener);
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', listener);
      } else {
        mediaQueryList.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}
