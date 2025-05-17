"use client";

import AssistantMessage from "@/components/assistant-message";
import SendMessageForm from "@/components/send-message-form";
import UserMessage from "@/components/user-message";
import { useChat } from '@ai-sdk/react';
import { Fragment, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/button";

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit, status, setMessages } = useChat();
  const [isFirstInteraction, setIsFirstInteraction] = useState(true);

  const handleFirstMessage = async () => {
    setIsFirstInteraction(false);
    await handleSubmit();
  };

  const handleNewChat = () => {
    setMessages([]);
    setIsFirstInteraction(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full border-b">
        <div className="w-full px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">NutriChef</h1>
          <Button
            onClick={handleNewChat}
            className="h-10 w-10 p-0 rounded-full bg-white/50 hover:bg-white/80"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 py-6">
        {isFirstInteraction ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 mt-16">
            <h1 className="text-4xl font-bold">NutriChef</h1>
            <p className="text-xl text-gray-600">Seu assistente nutricionista</p>
            <div className="w-full max-w-2xl mt-8">
              <SendMessageForm 
                isThinking={status === 'streaming' || status === 'submitted'} 
                message={input}
                setMessage={handleInputChange}
                onSendMessage={handleFirstMessage}
                rows={5}
              />
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
            <div className="fixed inset-x-0 bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-20 pb-4">
              <div className="container max-w-screen-md">
                <SendMessageForm 
                  isThinking={status === 'streaming' || status === 'submitted'} 
                  message={input}
                  setMessage={handleInputChange}
                  onSendMessage={async () => {
                    handleSubmit();
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
