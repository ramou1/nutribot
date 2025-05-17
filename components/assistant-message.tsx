import Message from "./message";
import { Copy } from "lucide-react";
import { Button } from "./button";

export default function AssistantMessage({ content }: { content: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <Message theirs={true}>
      <div className="flex flex-col">
        <div className="flex-1">
          {content}
        </div>
        <div className="mt-2 flex justify-end">
          <Button
            onClick={handleCopy}
            className="h-8 w-8 p-0 rounded-full bg-white/50 hover:bg-white/80"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Message>
  );
}
