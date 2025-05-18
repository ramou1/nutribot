"use client";

import { Button } from "@/components/button";
import { Settings, Sun, Moon, Type } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSettings } from "@/lib/settings-context";

export default function SettingsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { fontSize, isDarkMode, setFontSize, toggleDarkMode } = useSettings();
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        cardRef.current && 
        !cardRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFontSizeChange = (increment: boolean) => {
    const newSize = increment ? fontSize + 1 : fontSize - 1;
    if (newSize >= 12 && newSize <= 18) {
      setFontSize(newSize);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-4 sm:left-4 top-4 right-4 sm:top-auto sm:right-auto z-50">
      <Button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#1d3557] hover:bg-[#1d3557]/90 dark:bg-white dark:hover:bg-white/90 flex items-center justify-center p-0 ml-auto sm:ml-0"
      >
        <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-white dark:text-[#1d3557]" />
      </Button>

      <div 
        ref={cardRef}
        className={`absolute bottom-16 left-0 sm:left-0 right-0 sm:right-auto w-full sm:w-72 bg-white dark:bg-gray-700 rounded-lg shadow-lg p-4 space-y-4 transition-all duration-200 ${
          isOpen 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Type className="h-5 w-5 sm:h-4 sm:w-4 text-[#1d3557] dark:text-white" />
              <span className="text-base sm:text-sm text-[#1d3557] dark:text-white">Tamanho da Fonte</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleFontSizeChange(false)}
                disabled={fontSize <= 12}
                className="h-9 w-9 sm:h-8 sm:w-8 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 flex items-center justify-center p-0 text-gray-700 dark:text-white"
              >
                -
              </Button>
              <span className="text-base sm:text-sm text-[#1d3557] dark:text-white">{fontSize}px</span>
              <Button
                onClick={() => handleFontSizeChange(true)}
                disabled={fontSize >= 18}
                className="h-9 w-9 sm:h-8 sm:w-8 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 flex items-center justify-center p-0 text-gray-700 dark:text-white"
              >
                +
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isDarkMode ? (
                <Moon className="h-5 w-5 sm:h-4 sm:w-4 text-[#1d3557] dark:text-white" />
              ) : (
                <Sun className="h-5 w-5 sm:h-4 sm:w-4 text-[#1d3557] dark:text-white" />
              )}
              <span className="text-base sm:text-sm text-[#1d3557] dark:text-white">Modo {isDarkMode ? 'Escuro' : 'Claro'}</span>
            </div>
            <Button
              onClick={toggleDarkMode}
              className="h-9 px-4 sm:h-8 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-base sm:text-sm text-gray-700 dark:text-white"
            >
              {isDarkMode ? 'Claro' : 'Escuro'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 