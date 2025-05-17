import Image from "next/image";

export default function Message({ children, theirs = false }: { children: React.ReactNode, theirs?: boolean }) {
  return (
    <div className={`flex gap-4 ${theirs ? 'justify-start' : 'justify-end'}`}>
      {theirs && (
        <Image
          src="/images/nutribot-avatar.png"
          alt="NutriBot"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full"
        />
      )}
      <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-base ${theirs ? 'bg-white font-normal' : 'bg-[#1d3557] text-white font-normal'}`}>
        {children}
      </div>
      {!theirs && (
        <Image
          src="/images/user-avatar.png"
          alt="Você"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full"
        />
      )}
    </div>
  );
}
