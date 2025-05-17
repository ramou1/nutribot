"use client";

import AssistantMessage from "@/components/assistant-message";
import SendMessageForm from "@/components/send-message-form";
import UserMessage from "@/components/user-message";
import { useChat } from '@ai-sdk/react';
import { Fragment, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/button";

const SUGGESTIONS = [
  {
    title: "Plano Alimentar",
    description: "Crie um plano alimentar semanal para mim",
    color: "#e63946"
  },
  {
    title: "Receitas",
    description: "Sugira receitas saudáveis para o almoço",
    color: "#457b9d"
  },
  {
    title: "Dicas",
    description: "Como melhorar minha alimentação?",
    color: "#1d3557"
  }
];

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat();
  const [isFirstInteraction, setIsFirstInteraction] = useState(true);

  const handleFirstMessage = async () => {
    setIsFirstInteraction(false);
    await handleSubmit(new Event('submit') as any);
  };

  const handleNewChat = () => {
    setMessages([]);
    setIsFirstInteraction(true);
  };

  const handleSuggestionClick = (description: string) => {
    handleInputChange({ target: { value: description } } as any);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {!isFirstInteraction && (
        <header className="w-full">
          <div className="w-full px-4 h-16 flex items-center justify-between">
            <h1 
              className="text-xl font-bold cursor-pointer hover:opacity-80 text-[#1d3557]" 
              onClick={handleNewChat}
            >
              NutriBot
            </h1>
            <Button
              onClick={handleNewChat}
              className="h-10 w-10 p-0 rounded-full bg-[#a8dadc] hover:bg-[#457b9d] hover:text-white"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </header>
      )}

      <div className="flex-1 py-8">
        {isFirstInteraction ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 mt-32">
            <h1 className="text-4xl font-bold text-[#1d3557]">NutriBot</h1>
            <p className="text-xl text-[#457b9d]">Seu assistente nutricionista</p>
            <div className="w-full max-w-2xl mt-8">
              <SendMessageForm 
                isThinking={isLoading} 
                message={input}
                setMessage={handleInputChange}
                onSendMessage={handleFirstMessage}
                rows={5}
              />
            </div>
            <div className="w-full max-w-2xl mt-12 grid grid-cols-3 gap-4">
              {SUGGESTIONS.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.description)}
                  className="p-4 rounded-lg text-left transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: suggestion.color,
                    color: '#f1faee'
                  }}
                >
                  <h3 className="font-bold mb-2">{suggestion.title}</h3>
                  <p className="text-sm opacity-90">{suggestion.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-6 pb-64">
              {messages.map((message, i) => (
                <Fragment key={i}>
                  {message.role === "user" ? (
                    <UserMessage>{message.content}</UserMessage>
                  ) : (
                    <AssistantMessage content={message.content} />
                  )}
                </Fragment>
              ))}
            </div>
            <div className="fixed inset-x-0 bottom-0 bg-gradient-to-t from-[#f1faee] via-[#f1faee] to-transparent pt-20 pb-4">
              <div className="container max-w-screen-md">
                <SendMessageForm 
                  isThinking={isLoading} 
                  message={input}
                  setMessage={handleInputChange}
                  onSendMessage={async () => {
                    handleSubmit(new Event('submit') as any);
                    return Promise.resolve();
                  }}
                  rows={1}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
