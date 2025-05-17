import { ReactNode } from "react";

export default function Message({ theirs, children }: { theirs: boolean; children: ReactNode }) {
  return (
    <div className={`flex w-full ${theirs ? "justify-start pr-40" : "justify-end pl-40"}`}>
      <div className="flex items-start gap-2">
        {theirs && (
          <img
            src="/images/nutrichef-avatar.jpeg"
            alt="NutriChef"
            className="w-10 h-10 rounded-full"
          />
        )}
        <div
          className={`px-4 p-3 border-0 w-full overflow-x-scroll rounded-3xl ${
            theirs ? "bg-white" : "bg-primary text-primary-foreground"
          }`}
        >
          <div className="min-w-24">{children}</div>
        </div>
        {!theirs && (
          <img
            src="/images/user-avatar.jpeg"
            alt="Usuário"
            className="w-10 h-10 rounded-full"
          />
        )}
      </div>
    </div>
  );
}
