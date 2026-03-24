"use client";

import { useEffect, useMemo, useState } from "react";

const getStorageKey = (sessionId: string) => `socratic-session-start-${sessionId}`;

export function useSessionTimer(sessionId: string, enabled = true) {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!enabled || !sessionId || typeof window === "undefined") {
      return;
    }

    const storageKey = getStorageKey(sessionId);
    const storedStartTime = localStorage.getItem(storageKey);
    const resolvedStartTime = storedStartTime ? Number(storedStartTime) : Date.now();

    localStorage.setItem(storageKey, String(resolvedStartTime));
    setStartTime(resolvedStartTime);
    setElapsedSeconds(Math.floor((Date.now() - resolvedStartTime) / 1000));

    const timer = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - resolvedStartTime) / 1000));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [enabled, sessionId]);

  const resetTimer = () => {
    if (typeof window !== "undefined" && sessionId) {
      localStorage.removeItem(getStorageKey(sessionId));
    }
    setStartTime(null);
    setElapsedSeconds(0);
  };

  return useMemo(
    () => ({
      startTime,
      elapsedSeconds,
      resetTimer,
    }),
    [elapsedSeconds, startTime]
  );
}

export function formatSessionTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
  }

  return [minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}
