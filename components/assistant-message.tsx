"use client";

import Message from "@/components/message";
import { Button } from "@/components/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function AssistantMessage({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Message theirs={true}>
      <div className="flex items-start gap-4">
        <div className="flex-1">
          {content}
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleCopy}
            className="h-8 w-8 p-0 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            {copied ? (
              <Check className="h-4 w-4 text-gray-600" />
            ) : (
              <Copy className="h-4 w-4 text-gray-600" />
            )}
          </Button>
        </div>
      </div>
    </Message>
  );
}
