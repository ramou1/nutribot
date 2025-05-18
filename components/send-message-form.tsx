"use client";

import { cn } from "@/lib/utils";
import { ChangeEvent } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { Button } from "./button";
import { ArrowUp } from "lucide-react";
import { useSettings } from "@/lib/settings-context";

export default function SendMessageForm({
  isThinking,
  message,
  setMessage,
  onSendMessage,
  rows = 1,
}: {
  isThinking: boolean;
  message: string;
  setMessage: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => Promise<void>;
  rows?: number;
}) {
  const { fontSize } = useSettings();

  const handleSubmit = async () => {
    const value = message.trim();
    if (!value) return;

    await onSendMessage();
  };

  return (
    <div>
      <form
        className="relative"
        onSubmit={async (e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <ReactTextareaAutosize
          autoFocus
          maxRows={8}
          rows={rows}
          value={message}
          onChange={setMessage}
          placeholder="Me conte sobre suas restrições alimentares, preferências e objetivos de saúde..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className={cn(
            "drop-shadow-lg w-full bg-white dark:bg-gray-700 rounded-3xl border-0 p-4 pr-16 mb-4",
            "resize-none focus-visible:outline-none text-[#1d3557] dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
          )}
          style={{ fontSize: `${fontSize}px` }}
        />
        <Button 
          type="submit" 
          disabled={isThinking || !message.trim()} 
          className="absolute right-1 top-1 h-12 w-12 p-0 rounded-full flex items-center justify-center bg-[#1d3557] hover:bg-[#1d3557]/90 dark:bg-white dark:hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isThinking ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white dark:border-[#1d3557] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <ArrowUp className="h-5 w-5 text-white dark:text-[#1d3557]" />
          )}
        </Button>
      </form>
    </div>
  );
}
