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
          className="bg-white dark:bg-[#2d3a2d] rounded-2xl px-4 py-2 max-w-[85%] shadow-sm prose dark:prose-invert prose-sm max-w-none relative"
          style={{ fontSize: `${fontSize}px` }}
        >
          <ReactMarkdown>{content}</ReactMarkdown>
          <Button
            onClick={handleCopy}
            className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-[#588157] hover:bg-[#3a5a40] dark:bg-[#3a5a40] dark:hover:bg-[#344e41] opacity-0 group-hover:opacity-100 transition-opacity"
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
