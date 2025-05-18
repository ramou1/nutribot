import Image from "next/image";

export default function Message({ children, theirs = false }: { children: React.ReactNode, theirs?: boolean }) {
  return (
    <div className={`flex gap-4 ${theirs ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-${theirs ? 'left' : 'right'} duration-300`}>
      {theirs && (
        <Image
          src="/images/nutribot-avatar.png"
          alt="NutriBot"
          width={56}
          height={56}
          className="w-14 h-14 rounded-full"
        />
      )}
      <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-[15px] ${theirs ? 'bg-white font-normal' : 'bg-[#1d3557] text-white font-normal'} shadow-sm hover:shadow-md transition-shadow duration-200`}>
        {children}
      </div>
      {!theirs && (
        <Image
          src="/images/user-avatar.png"
          alt="Você"
          width={56}
          height={56}
          className="w-14 h-14 rounded-full"
        />
      )}
    </div>
  );
}
