"use client";

import { useSettings } from "@/lib/settings-context";
import Image from "next/image";

export default function UserMessage({ children }: { children: React.ReactNode }) {
  const { fontSize } = useSettings();

  return (
    <div className="flex justify-end gap-4">
      <div 
        className="bg-[#588157] text-white rounded-2xl px-4 py-2 max-w-[85%] shadow-sm"
        style={{ fontSize: `${fontSize}px` }}
      >
        {children}
      </div>
      <Image
        src="/images/user-avatar.png"
        alt="Você"
        width={56}
        height={56}
        className="w-14 h-14 rounded-full"
        quality={100}
      />
    </div>
  );
}
