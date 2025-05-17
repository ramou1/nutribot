import { cn } from "@/lib/utils";
import { ChangeEvent } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { Button } from "./button";
import { ArrowUp } from "lucide-react";

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
          placeholder="Me peça dicas de nutrição..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className={cn(
            "drop-shadow-lg w-full text-lg bg-white rounded-3xl border-0 p-4 pr-16 mb-4",
            "resize-none focus-visible:outline-none"
          )}
        />
        <Button 
          disabled={isThinking || !message.trim()} 
          type="submit" 
          className="absolute right-4 bottom-8 h-10 w-10 p-0 rounded-full flex items-center justify-center"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
