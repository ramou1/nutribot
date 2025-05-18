"use client";

import { useSettings } from "@/lib/settings-context";
import Image from "next/image";

export default function UserMessage({ children }: { children: React.ReactNode }) {
  const { fontSize } = useSettings();

  return (
    <div className="flex justify-end gap-4">
      <div 
        className="bg-[#588157] text-white rounded-2xl rounded-br-none px-4 py-2 max-w-[85%]"
        style={{ fontSize: `${fontSize}px` }}
      >
        {children}
      </div>
      <Image
        src="/images/user-avatar-48.png"
        alt="Você"
        width={48}
        height={48}
        className="w-12 h-12 rounded-full self-end"
        quality={100}
      />
    </div>
  );
}
