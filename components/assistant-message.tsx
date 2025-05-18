"use client";

import Message from "@/components/message";
import { Button } from "@/components/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

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
        <div className="flex-1 prose prose-sm max-w-none text-[15px]">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base font-bold mb-2">{children}</h3>,
            }}
          >
            {content}
          </ReactMarkdown>
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
