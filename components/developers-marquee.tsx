"use client";

export default function DevelopersMarquee() {
  return (
    <div className="fixed top-0 left-0 w-full overflow-hidden bg-[#f0f0f0] dark:bg-[#2d2d2d] py-1 z-50">
      <div className="flex animate-marquee whitespace-nowrap">
        {Array(20).fill(0).map((_, i) => (
          <span key={i} className="text-[#344e41]/30 dark:text-[#a3b18a]/20 text-sm font-medium mx-4 uppercase">
            Ramon Oliveira • Gabriel Sabino
          </span>
        ))}
      </div>
    </div>
  );
} 