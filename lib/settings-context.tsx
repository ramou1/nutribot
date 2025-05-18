"use client";

import { createContext, useContext, useState, useEffect } from "react";

type SettingsContextType = {
  fontSize: number;
  isDarkMode: boolean;
  setFontSize: (size: number) => void;
  toggleDarkMode: () => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState(15);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Aplicar modo escuro
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <SettingsContext.Provider value={{ fontSize, isDarkMode, setFontSize, toggleDarkMode }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
} 