"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "socratic-focus-mode";

type FocusModeContextType = {
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  setFocusMode: (value: boolean) => void;
};

const FocusModeContext = createContext<FocusModeContextType | undefined>(undefined);

export function FocusModeProvider({ children }: { children: React.ReactNode }) {
  const [isFocusMode, setIsFocusMode] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setIsFocusMode(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  const setFocusMode = (value: boolean) => {
    setIsFocusMode(value);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, String(value));
    }
  };

  const toggleFocusMode = () => {
    setFocusMode(!isFocusMode);
  };

  return (
    <FocusModeContext.Provider value={{ isFocusMode, toggleFocusMode, setFocusMode }}>
      {children}
    </FocusModeContext.Provider>
  );
}

export function useFocusMode() {
  const context = useContext(FocusModeContext);

  if (!context) {
    throw new Error("useFocusMode must be used within FocusModeProvider");
  }

  return context;
}
