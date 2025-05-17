import Image from "next/image";

export default function Message({ children, theirs = false }: { children: React.ReactNode, theirs?: boolean }) {
  return (
    <div className={`flex gap-4 ${theirs ? 'justify-start' : 'justify-end'}`}>
      {theirs && (
        <Image
          src="/images/nutribot-avatar.jpeg"
          alt="NutriBot"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full"
        />
      )}
      <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${theirs ? 'bg-white' : 'bg-[#1d3557] text-white'}`}>
        {children}
      </div>
      {!theirs && (
        <Image
          src="/images/user-avatar.jpeg"
          alt="Você"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full"
        />
      )}
    </div>
  );
}
