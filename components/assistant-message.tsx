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
        src="/images/icone.png"
        alt="NutriBot"
        width={56}
        height={56}
        className="w-14 h-14 rounded-full"
        quality={100}
      />
      <div className="relative group">
        <div 
          className="bg-white dark:bg-[#2a2a2a] rounded-2xl px-4 py-2 max-w-[85%] shadow-sm prose dark:prose-invert prose-sm max-w-none relative"
          style={{ fontSize: `${fontSize}px` }}
        >
          <ReactMarkdown>{content}</ReactMarkdown>
          <Button
            onClick={handleCopy}
            className="absolute right-1 top-1 h-10 px-3 rounded-xl bg-[#588157] hover:bg-[#3a5a40] dark:bg-[#3a5a40] dark:hover:bg-[#344e41] disabled:opacity-50 disabled:cursor-not-allowed"
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
