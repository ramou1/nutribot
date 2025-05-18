"use client";

export default function DevelopersMarquee() {
  return (
    <div className="fixed top-0 left-0 w-full overflow-hidden bg-[#e9f0e6] dark:bg-gray-800 py-1 z-50">
      <div className="flex animate-marquee whitespace-nowrap">
        {Array(20).fill(0).map((_, i) => (
          <span key={i} className="text-[#1d3557]/20 dark:text-white/10 text-sm font-medium mx-4 uppercase">
            Ramon Oliveira • Gabriel Sabino
          </span>
        ))}
      </div>
    </div>
  );
} 