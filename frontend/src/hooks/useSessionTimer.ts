"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const getStorageKey = (sessionId: string) => `socratic-session-timer-${sessionId}`;

type TimerSnapshot = {
  accumulatedSeconds: number;
  lastStartedAt: number | null;
  isRunning: boolean;
};

const readSnapshot = (sessionId: string): TimerSnapshot => {
  const rawValue = localStorage.getItem(getStorageKey(sessionId));
  if (!rawValue) {
    return {
      accumulatedSeconds: 0,
      lastStartedAt: null,
      isRunning: false,
    };
  }

  try {
    return JSON.parse(rawValue) as TimerSnapshot;
  } catch {
    return {
      accumulatedSeconds: 0,
      lastStartedAt: null,
      isRunning: false,
    };
  }
};

const writeSnapshot = (sessionId: string, snapshot: TimerSnapshot) => {
  localStorage.setItem(getStorageKey(sessionId), JSON.stringify(snapshot));
};

const calculateElapsedSeconds = (snapshot: TimerSnapshot) => {
  if (!snapshot.isRunning || !snapshot.lastStartedAt) {
    return snapshot.accumulatedSeconds;
  }

  return snapshot.accumulatedSeconds + Math.floor((Date.now() - snapshot.lastStartedAt) / 1000);
};

export function useSessionTimer(sessionId: string, enabled = true) {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const snapshotRef = useRef<TimerSnapshot>({
    accumulatedSeconds: 0,
    lastStartedAt: null,
    isRunning: false,
  });

  useEffect(() => {
    if (!enabled || !sessionId || typeof window === "undefined") {
      return;
    }

    const resumeTimer = () => {
      const nextSnapshot = readSnapshot(sessionId);
      if (!nextSnapshot.isRunning) {
        nextSnapshot.isRunning = true;
        nextSnapshot.lastStartedAt = Date.now();
      }

      snapshotRef.current = nextSnapshot;
      writeSnapshot(sessionId, nextSnapshot);
      setStartTime(nextSnapshot.lastStartedAt);
      setElapsedSeconds(calculateElapsedSeconds(nextSnapshot));
    };

    const pauseTimer = () => {
      const currentSnapshot = snapshotRef.current;
      if (!currentSnapshot.isRunning || !currentSnapshot.lastStartedAt) {
        return;
      }

      const nextSnapshot: TimerSnapshot = {
        accumulatedSeconds: calculateElapsedSeconds(currentSnapshot),
        lastStartedAt: null,
        isRunning: false,
      };

      snapshotRef.current = nextSnapshot;
      writeSnapshot(sessionId, nextSnapshot);
      setElapsedSeconds(nextSnapshot.accumulatedSeconds);
    };

    resumeTimer();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseTimer();
      } else {
        resumeTimer();
      }
    };

    const timer = window.setInterval(() => {
      setElapsedSeconds(calculateElapsedSeconds(snapshotRef.current));
    }, 1000);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      pauseTimer();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, sessionId]);

  const resetTimer = () => {
    if (typeof window !== "undefined" && sessionId) {
      localStorage.removeItem(getStorageKey(sessionId));
    }
    snapshotRef.current = {
      accumulatedSeconds: 0,
      lastStartedAt: null,
      isRunning: false,
    };
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
