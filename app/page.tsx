"use client";

import AssistantMessage from "@/components/assistant-message";
import SendMessageForm from "@/components/send-message-form";
import UserMessage from "@/components/user-message";
import SettingsButton from "@/components/settings-button";
import AgentsButton from "@/components/agents-button";
import DevelopersMarquee from "@/components/developers-marquee";
import { useChat } from "@ai-sdk/react";
import { Fragment, useState } from "react";
import { Button } from "@/components/button";
import { Calendar, Utensils, ChefHat } from "lucide-react";
import Image from "next/image";
import { ModalProvider } from "@/lib/modal-context";

const SUGGESTIONS = [
  {
    title: "Plano Alimentar",
    description: "Crie um plano alimentar para o dia para mim que sou diabético",
    color: "#588157",
    icon: Calendar,
  },
  {
    title: "Restaurantes",
    description: "Encontre restaurantes com opções veganas ou vegetarianas",
    color: "#3a5a40",
    icon: Utensils,
  },
  {
    title: "Receitas",
    description: "Me sugira uma receita simples sem lactose e sem glúten e monte uma dieta que inclua essa receita",
    color: "#344e41",
    icon: ChefHat,
  },
];

export default function Page() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    error
  } = useChat();
  const [isFirstInteraction, setIsFirstInteraction] = useState(true);

  const handleFirstMessage = async () => {
    setIsFirstInteraction(false);
    await handleSubmit(new Event("submit") as any);
  };

  const handleNewChat = () => {
    setMessages([]);
    setIsFirstInteraction(true);
  };

  const handleSuggestionClick = (description: string) => {
    handleInputChange({ target: { value: description } } as any);
  };

  return (
    <ModalProvider>
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#1a1a1a]">
        <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-[#fafafa] via-[#f8f8f8] to-[#f5f5f5] dark:from-[#1a1a1a] dark:via-[#2d3a2d] dark:to-[#344e41] -z-10" />
        <DevelopersMarquee />
        
        <div className="fixed top-4 right-4 sm:top-16 sm:right-12 flex flex-row sm:flex-col gap-2 z-[60]">
          <AgentsButton />
          <SettingsButton />
        </div>

        {!isFirstInteraction && (
          <header className="fixed top-0 inset-x-0 z-50">
            <div className="w-full px-4 h-16 flex items-center justify-between bg-gradient-to-b from-[#fafafa] via-[#fafafa] to-transparent dark:from-[#1a1a1a] dark:via-[#1a1a1a] dark:to-transparent">
              <div
                className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                onClick={handleNewChat}
              >
                <Image
                  src="/images/icone-32.png"
                  alt="NutriBot"
                  width={32}
                  height={32}
                  className="rounded-full"
                  quality={100}
                  priority
                  unoptimized
                />
                <h1 className="text-2xl font-bold text-[#344e41] dark:text-[#a3b18a]">
                  NutriBot
                </h1>
              </div>
            </div>
          </header>
        )}

        <div className="flex-1 py-8">
          {isFirstInteraction ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-1 mt-40">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/icone.png"
                  alt="NutriBot"
                  width={48}
                  height={48}
                  className="rounded-full"
                  quality={100}
                  priority
                  unoptimized
                />
                <h1 className="text-6xl font-bold text-[#344e41] dark:text-[#a3b18a]">
                  NutriBot
                </h1>
              </div>
              <p className="text-xl text-[#588157] dark:text-[#b0c4b1] mt-2">
                Seu assistente nutricionista
              </p>
              <div className="w-full max-w-2xl mt-8 px-4 sm:px-0">
                <SendMessageForm
                  isThinking={isLoading}
                  message={input}
                  setMessage={handleInputChange}
                  onSendMessage={handleFirstMessage}
                  rows={5}
                />
              </div>
              <div className="w-full max-w-2xl mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 sm:px-0">
                {SUGGESTIONS.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion.description)}
                    className="p-4 rounded-lg text-left transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1 shadow-[#3a5a40]/20 flex flex-col items-start"
                    style={{
                      backgroundColor: suggestion.color,
                      color: "#f1faee",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <suggestion.icon className="h-5 w-5" />
                      <h3 className="font-bold text-xl sm:text-lg">
                        {suggestion.title}
                      </h3>
                    </div>
                    <p className="text-base sm:text-sm opacity-90">
                      {suggestion.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-6 pb-64 pt-16">
                <div className="container max-w-screen-md mx-auto px-4 space-y-6">
                  {messages.map((message, i) => (
                    <Fragment key={i}>
                      {message.role === "user" ? (
                        <UserMessage>{message.content}</UserMessage>
                      ) : (
                        <AssistantMessage 
                          content={message.content} 
                          isTyping={isLoading && i === messages.length - 1}
                          error={error && i === messages.length - 1 ? "Desculpe, estou enfrentando problemas para processar sua solicitação. Por favor, tente novamente." : undefined}
                        />
                      )}
                    </Fragment>
                  ))}
                </div>
              </div>
              <div className="fixed inset-x-0 bottom-0 bg-gradient-to-t from-[#fafafa] via-[#fafafa] to-transparent dark:from-[#1a1a1a] dark:via-[#1a1a1a] dark:to-transparent pt-20 pb-4">
                <div className="container max-w-screen-md mx-auto">
                  <SendMessageForm
                    isThinking={isLoading}
                    message={input}
                    setMessage={handleInputChange}
                    onSendMessage={async () => {
                      await handleSubmit(new Event("submit") as any);
                    }}
                    rows={1}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ModalProvider>
  );
}
