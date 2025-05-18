"use client";

import { useSettings } from "@/lib/settings-context";
import { Button } from "@/components/button";
import { ArrowUp } from "lucide-react";
import ReactTextareaAutosize from "react-textarea-autosize";

interface SendMessageFormProps {
  isThinking: boolean;
  message: string;
  setMessage: (e: any) => void;
  onSendMessage: () => Promise<void>;
  rows?: number;
}

export default function SendMessageForm({
  isThinking,
  message,
  setMessage,
  onSendMessage,
  rows = 1
}: SendMessageFormProps) {
  const { fontSize } = useSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isThinking) {
      await onSendMessage();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <ReactTextareaAutosize
        value={message}
        onChange={setMessage}
        onKeyDown={handleKeyDown}
        placeholder="Digite sua mensagem..."
        className="w-full rounded-2xl border border-[#d1d1d1] bg-[#ffffff] dark:bg-[#2d2d2d] dark:border-[#404040] px-4 py-3 pr-12 text-[#344e41] dark:text-[#e9e9e9] placeholder:text-[#666666]/50 dark:placeholder:text-[#9e9e9e]/50 focus:outline-none focus:ring-2 focus:ring-[#588157] dark:focus:ring-[#3a5a40] resize-none"
        style={{ fontSize: `${fontSize}px` }}
        rows={rows}
        maxRows={10}
      />
      <Button
        type="submit"
        disabled={!message.trim() || isThinking}
        className="absolute right-1 top-1 h-10 px-3 rounded-xl bg-[#588157] hover:bg-[#3a5a40] dark:bg-[#3a5a40] dark:hover:bg-[#344e41] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowUp className="h-4 w-4 text-white" />
      </Button>
    </form>
  );
}