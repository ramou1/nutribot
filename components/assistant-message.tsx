"use client";

import { useSettings } from "@/lib/settings-context";
import { Button } from "@/components/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

export default function AssistantMessage({ content }: { content: string }) {
  const { fontSize } = useSettings();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-start gap-4">
      <Image
        src="/images/nutribot-avatar-48.png"
        alt="NutriBot"
        width={48}
        height={48}
        className="w-12 h-12 rounded-full self-end"
        quality={100}
      />
      <div className="relative group">
        <div 
          className="bg-[#f0f0f0] dark:bg-[#2a2a2a] rounded-2xl rounded-bl-none px-4 py-2 max-w-[85%] prose dark:prose-invert prose-sm max-w-none relative flex items-start gap-2 group"
          style={{ fontSize: `${fontSize}px` }}
        >
          <div className="flex-1">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
          <Button
            onClick={handleCopy}
            className="h-8 w-8 px-2 rounded-full bg-[#9eae9d] hover:bg-[#8a9a89] dark:bg-[#8a9a89] dark:hover:bg-[#7a8a79] disabled:opacity-50 disabled:cursor-not-allowed shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {copied ? (
              <Check className="h-4 w-4 text-white" />
            ) : (
              <Copy className="h-4 w-4 text-white" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
