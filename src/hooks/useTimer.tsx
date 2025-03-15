
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerOptions {
  initialTime?: number;
  autoStart?: boolean;
  onComplete?: () => void;
}

export function useTimer({
  initialTime = 0,
  autoStart = false,
  onComplete,
}: UseTimerOptions = {}) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Start timer
  const start = useCallback(() => {
    if (isRunning) return;
    
    setIsRunning(true);
    setIsComplete(false);
    startTimeRef.current = Date.now() - time * 1000; // account for already elapsed time
    
    timerRef.current = window.setInterval(() => {
      if (startTimeRef.current === null) return;
      
      const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setTime(elapsedSeconds);
      
      if (initialTime > 0 && elapsedSeconds >= initialTime) {
        setIsComplete(true);
        setIsRunning(false);
        if (timerRef.current) clearInterval(timerRef.current);
        if (onComplete) onComplete();
      }
    }, 200);
  }, [initialTime, isRunning, onComplete, time]);

  // Pause timer
  const pause = useCallback(() => {
    if (!isRunning) return;
    
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [isRunning]);

  // Reset timer
  const reset = useCallback(() => {
    setTime(initialTime);
    setIsRunning(false);
    setIsComplete(false);
    
    if (timerRef.current) clearInterval(timerRef.current);
  }, [initialTime]);

  // Format time to display
  const formattedTime = useCallback(() => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    
    return {
      hours,
      minutes,
      seconds,
      formatted: `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
    };
  }, [time]);

  return {
    time,
    isRunning,
    isComplete,
    start,
    pause,
    reset,
    formattedTime: formattedTime(),
  };
}
