import Message from "./message";

export default function UserMessage({ children }: { children: string }) {
  return (
    <Message name="Você" theirs={false}>
      <div className="flex-1">
        {children}
      </div>
    </Message>
  );
}
