import { useEffect, useState } from 'react';

// Custom hook to animate counting up from 0 to target value
export function useCountUp(target: number, duration: number = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        // Calculate current count based on progress
        const currentCount = Math.floor(target * progress);
        setCount(currentCount);
        animationFrame = requestAnimationFrame(animate);
      } else {
        // Animation complete, set to target
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [target, duration]);

  return count;
}
