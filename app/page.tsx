"use client";

import AssistantMessage from "@/components/assistant-message";
import SendMessageForm from "@/components/send-message-form";
import UserMessage from "@/components/user-message";
import { useChat } from '@ai-sdk/react';
import { Fragment, useState } from "react";

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat();
  const [isFirstInteraction, setIsFirstInteraction] = useState(true);

  const handleFirstMessage = async () => {
    setIsFirstInteraction(false);
    await handleSubmit();
  };

  return (
    <div className="py-6 min-h-screen flex flex-col">
      {isFirstInteraction ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-full"></div>
            <h1 className="text-4xl font-bold">NutriChef</h1>
          </div>
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
          <div className="flex-1 flex flex-col gap-6 pb-64">
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
          <div className="container max-w-screen-md fixed inset-x-0 bottom-0 w-full">
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
        </>
      )}
    </div>
  );
}
