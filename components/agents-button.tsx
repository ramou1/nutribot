"use client";

import { Button } from "@/components/button";
import { Info } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useModal } from "@/lib/modal-context";

export default function AgentsButton() {
  const { activeModal, setActiveModal } = useModal();
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isOpen = activeModal === "agents";

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

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        onClick={() => setActiveModal(isOpen ? null : "agents")}
        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-[#3a5a40] hover:bg-[#344e41] dark:bg-[#344e41] dark:hover:bg-[#2d3a2d] flex items-center justify-center p-0"
      >
        <Info className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
      </Button>

      {/* Modal */}
      {isOpen && (
        <div 
          ref={cardRef}
          className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#2d3a2d] rounded-lg shadow-lg border border-[#344e41]/20 dark:border-[#a3b18a]/20 overflow-hidden z-50"
        >
          <div className="p-4">
            <h3 className="text-lg font-semibold text-[#344e41] dark:text-[#a3b18a] mb-4">
              Nossas Agentes
            </h3>
            <div className="space-y-6">
              {/* NutriBot */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-20 h-20">
                  <Image
                    src="/images/nutribot-avatar.png"
                    alt="NutriBot"
                    fill
                    className="rounded-full object-cover"
                    quality={100}
                    priority
                    unoptimized
                  />
                </div>
                <h4 className="text-lg font-semibold text-[#344e41] dark:text-[#a3b18a] mb-2">
                  NutriBot
                </h4>
                <p className="text-sm text-[#588157] dark:text-[#b0c4b1]">
                  Sua assistente nutricionista, pronta para ajudar com planos alimentares, 
                  dicas de nutrição e orientações sobre alimentação saudável.
                </p>
              </div>

              {/* ChefBot */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-20 h-20">
                  <Image
                    src="/images/chefbot-avatar.png"
                    alt="ChefBot"
                    fill
                    className="rounded-full object-cover"
                    quality={100}
                    priority
                    unoptimized
                  />
                </div>
                <h4 className="text-lg font-semibold text-[#344e41] dark:text-[#a3b18a] mb-2">
                  ChefBot
                </h4>
                <p className="text-sm text-[#588157] dark:text-[#b0c4b1]">
                  Sua assistente culinária, especialista em receitas, técnicas de cozinha 
                  e adaptações para diferentes necessidades alimentares.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 