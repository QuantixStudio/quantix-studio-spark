import { useEffect, useRef, useState } from "react";

interface ScrollRevealOptions {
  threshold?: number;
  triggerOnce?: boolean;
}

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { threshold = 0.2, triggerOnce = false } = options;

  useEffect(() => {
    // Check if element is already visible on mount
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (isInViewport) {
        setIsVisible(true);
        if (triggerOnce) {
          return; // Don't set up observer if already visible and triggerOnce is true
        }
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, triggerOnce]);

  return { isVisible, ref };
}
