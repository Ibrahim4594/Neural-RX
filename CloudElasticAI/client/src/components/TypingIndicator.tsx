import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-4 animate-in fade-in duration-200" data-testid="typing-indicator">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Bot className="h-5 w-5" />
      </div>

      <div className="flex flex-col gap-2 max-w-2xl">
        <div className="rounded-2xl p-4 bg-card border border-card-border">
          <div className="flex gap-1.5 items-center">
            <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
            <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
            <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
