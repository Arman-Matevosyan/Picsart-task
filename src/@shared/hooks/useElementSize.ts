import { useCallback, useEffect, useRef, useState } from "react";

interface Size {
  width: number;
  height: number;
}

export const useElementSize = <T extends HTMLElement = HTMLDivElement>(): [
  (node: T | null) => void,
  Size
] => {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const elementRef = useRef<T | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  const measuredRef = useCallback((node: T | null) => {
    elementRef.current = node;
  }, []);

  useEffect(() => {
    if (!elementRef.current) return;

    // initialize the observer one time
    if (!observerRef.current) {
      observerRef.current = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;

        const size = entry.borderBoxSize?.[0]
          ? {
              width: entry.borderBoxSize[0].inlineSize,
              height: entry.borderBoxSize[0].blockSize,
            }
          : {
              width: entry.contentRect.width,
              height: entry.contentRect.height,
            };

        setSize(size);
      });
    }

    const currentObserver = observerRef.current;
    const currentElement = elementRef.current;

    currentObserver.observe(currentElement);

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, []);

  return [measuredRef, size];
};
