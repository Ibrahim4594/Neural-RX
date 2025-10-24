import { ConversationMessage } from "@shared/schema";
import { User, Bot, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useBookmarks } from "@/hooks/useBookmarks";

interface ChatMessageProps {
  message: ConversationMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(message.id);

  return (
    <div
      className={cn(
        "flex gap-4 animate-in fade-in duration-200 group",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
      data-testid={`message-${message.role}`}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
        data-testid={`avatar-${message.role}`}
      >
        {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </div>

      <div
        className={cn(
          "flex flex-col gap-2 max-w-2xl",
          isUser && "items-end"
        )}
      >
        <div className="relative">
          <div
            className={cn(
              "rounded-2xl p-4 leading-relaxed",
              isUser
                ? "bg-primary text-primary-foreground"
                : "bg-card text-card-foreground border border-card-border"
            )}
            data-testid={`content-${message.role}`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleBookmark(message, "message")}
            className={cn(
              "absolute -top-2 -right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity",
              bookmarked && "opacity-100"
            )}
            data-testid={`button-bookmark-${message.id}`}
          >
            <Star
              className={cn(
                "h-4 w-4",
                bookmarked && "fill-yellow-400 text-yellow-400"
              )}
            />
          </Button>
        </div>

        <span className="text-xs text-muted-foreground px-2" data-testid="timestamp">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
