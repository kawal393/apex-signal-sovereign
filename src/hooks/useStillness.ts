import { useState, useEffect, useCallback } from 'react';

interface UseStillnessOptions {
  requiredStillnessMs?: number;
  movementThreshold?: number;
}

export function useStillness({
  requiredStillnessMs = 3500,
  movementThreshold = 5,
}: UseStillnessOptions = {}) {
  const [isStill, setIsStill] = useState(false);
  const [stillnessProgress, setStillnessProgress] = useState(0);
  const [hasBeenStill, setHasBeenStill] = useState(false);

  useEffect(() => {
    // Skip on server
    if (typeof window === 'undefined') return;

    let lastX = 0;
    let lastY = 0;
    let stillnessStart = Date.now();
    let animationFrame: number;
    let isCurrentlyStill = true;

    const checkStillness = () => {
      const now = Date.now();
      const elapsed = now - stillnessStart;
      
      if (isCurrentlyStill) {
        const progress = Math.min(elapsed / requiredStillnessMs, 1);
        setStillnessProgress(progress);
        
        if (elapsed >= requiredStillnessMs && !hasBeenStill) {
          setIsStill(true);
          setHasBeenStill(true);
        }
      }
      
      animationFrame = requestAnimationFrame(checkStillness);
    };

    const handleMovement = (e: MouseEvent | TouchEvent) => {
      const x = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const y = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
      
      const distance = Math.sqrt(
        Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2)
      );
      
      if (distance > movementThreshold) {
        // Movement detected - reset stillness
        stillnessStart = Date.now();
        isCurrentlyStill = true;
        setIsStill(false);
        setStillnessProgress(0);
      }
      
      lastX = x;
      lastY = y;
    };

    const handleScroll = () => {
      stillnessStart = Date.now();
      isCurrentlyStill = true;
      setIsStill(false);
      setStillnessProgress(0);
    };

    // Start tracking
    animationFrame = requestAnimationFrame(checkStillness);
    
    window.addEventListener('mousemove', handleMovement);
    window.addEventListener('touchmove', handleMovement);
    window.addEventListener('scroll', handleScroll);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('mousemove', handleMovement);
      window.removeEventListener('touchmove', handleMovement);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [requiredStillnessMs, movementThreshold, hasBeenStill]);

  const reset = useCallback(() => {
    setIsStill(false);
    setStillnessProgress(0);
    setHasBeenStill(false);
  }, []);

  return { isStill, stillnessProgress, hasBeenStill, reset };
}
