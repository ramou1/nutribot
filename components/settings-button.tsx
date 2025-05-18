"use client";

import { useSettings } from "@/lib/settings-context";
import { Button } from "@/components/button";
import { Settings, Sun, Moon, Type } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useModal } from "@/lib/modal-context";

export default function SettingsButton() {
  const { activeModal, setActiveModal } = useModal();
  const { fontSize, isDarkMode, setFontSize, toggleDarkMode } = useSettings();
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isOpen = activeModal === "settings";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        cardRef.current && 
        !cardRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setActiveModal(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setActiveModal]);

  const handleFontSizeChange = (increment: boolean) => {
    const newSize = increment ? fontSize + 1 : fontSize - 1;
    if (newSize >= 12 && newSize <= 18) {
      setFontSize(newSize);
    }
  };

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        onClick={() => setActiveModal(isOpen ? null : "settings")}
        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-[#588157] hover:bg-[#3a5a40] dark:bg-[#3a5a40] dark:hover:bg-[#344e41] flex items-center justify-center p-0"
      >
        <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
      </Button>

      {/* Modal */}
      {isOpen && (
        <div 
          ref={cardRef}
          className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-[#2d3a2d] rounded-lg shadow-lg border border-[#344e41]/20 dark:border-[#a3b18a]/20 overflow-hidden"
        >
          <div className="p-4">
            <h3 className="text-lg font-semibold text-[#344e41] dark:text-[#a3b18a] mb-4">
              Configurações
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Type className="h-5 w-5 sm:h-4 sm:w-4 text-[#344e41] dark:text-[#a3b18a]" />
                  <span className="text-base sm:text-sm text-[#344e41] dark:text-[#a3b18a]">Tamanho da Fonte</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleFontSizeChange(false)}
                    disabled={fontSize <= 12}
                    className="h-9 w-9 sm:h-8 sm:w-8 rounded-full bg-[#588157] hover:bg-[#3a5a40] dark:bg-[#3a5a40] dark:hover:bg-[#344e41] flex items-center justify-center p-0 text-white"
                  >
                    -
                  </Button>
                  <span className="text-base sm:text-sm text-[#344e41] dark:text-[#a3b18a]">{fontSize}px</span>
                  <Button
                    onClick={() => handleFontSizeChange(true)}
                    disabled={fontSize >= 18}
                    className="h-9 w-9 sm:h-8 sm:w-8 rounded-full bg-[#588157] hover:bg-[#3a5a40] dark:bg-[#3a5a40] dark:hover:bg-[#344e41] flex items-center justify-center p-0 text-white"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isDarkMode ? (
                    <Moon className="h-5 w-5 sm:h-4 sm:w-4 text-[#344e41] dark:text-[#a3b18a]" />
                  ) : (
                    <Sun className="h-5 w-5 sm:h-4 sm:w-4 text-[#344e41] dark:text-[#a3b18a]" />
                  )}
                  <span className="text-base sm:text-sm text-[#344e41] dark:text-[#a3b18a]">Modo {isDarkMode ? 'Escuro' : 'Claro'}</span>
                </div>
                <Button
                  onClick={toggleDarkMode}
                  className="h-9 px-4 sm:h-8 rounded-full bg-[#588157] hover:bg-[#3a5a40] dark:bg-[#3a5a40] dark:hover:bg-[#344e41] text-base sm:text-sm text-white"
                >
                  {isDarkMode ? 'Claro' : 'Escuro'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 