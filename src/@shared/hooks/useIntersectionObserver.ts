import { MutableRefObject, useEffect, useRef } from 'react';

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  onIntersect: () => void;
  enabled?: boolean;
}

/**
 * Custom hook for efficiently detecting when an element is visible in the viewport
 * Perfect for triggering infinite scroll loads without expensive scroll events
 * 
 * @param options Configuration options for the IntersectionObserver
 * @returns Ref to attach to the target element
 */
export function useIntersectionObserver<T extends Element>({
  root = null,
  rootMargin = '0px',
  threshold = 0.1,
  onIntersect,
  enabled = true,
}: IntersectionObserverOptions): MutableRefObject<T | null> {
  const targetRef = useRef<T | null>(null);
  
  useEffect(() => {
    if (!enabled) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        });
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );
    
    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }
    
    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [enabled, root, rootMargin, threshold, onIntersect]);
  
  return targetRef;
} 