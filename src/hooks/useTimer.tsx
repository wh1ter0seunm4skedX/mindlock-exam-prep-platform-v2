import { useState, useEffect, useRef, useCallback, useMemo } from "react";

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

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, []);

  // Start timer
  const start = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);
    setIsComplete(false);
    startTimeRef.current = Date.now() - time * 1000; // Adjust for elapsed time

    const updateTimer = () => {
      if (!startTimeRef.current) return;

      const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setTime(elapsedSeconds);

      if (initialTime > 0 && elapsedSeconds >= initialTime) {
        setIsComplete(true);
        setIsRunning(false);
        if (onComplete) onComplete();
        return;
      }

      timerRef.current = requestAnimationFrame(updateTimer);
    };

    timerRef.current = requestAnimationFrame(updateTimer);
  }, [initialTime, isRunning, onComplete, time]);

  // Pause timer
  const pause = useCallback(() => {
    if (!isRunning) return;

    setIsRunning(false);
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
  }, [isRunning]);

  // Reset timer
  const reset = useCallback(() => {
    setTime(0); // Reset to 0 instead of initialTime to start fresh
    setIsRunning(false);
    setIsComplete(false);
    startTimeRef.current = null; // Reset start time reference
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
  }, []);

  // Format time
  const formattedTime = useMemo(() => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return {
      hours,
      minutes,
      seconds,
      formatted: `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
    };
  }, [time]);

  return {
    time,
    isRunning,
    isComplete,
    start,
    pause,
    reset,
    formattedTime,
  };
}
