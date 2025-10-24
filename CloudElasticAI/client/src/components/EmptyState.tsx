import { MessageSquare, Search } from "lucide-react";
import { QuickActions } from "@/components/QuickActions";

interface EmptyStateProps {
  type: "chat" | "search";
  onQuickAction?: (question: string) => void;
}

export function EmptyState({ type, onQuickAction }: EmptyStateProps) {
  if (type === "chat") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8" data-testid="empty-state-chat">
        <div className="rounded-full bg-primary/10 p-6 mb-6">
          <MessageSquare className="h-12 w-12 text-primary" />
        </div>
        
        {onQuickAction && <QuickActions onSelect={onQuickAction} />}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center" data-testid="empty-state-search">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Search className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">
        Search Results
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Relevant medical information will appear here as you chat with the AI assistant.
      </p>
    </div>
  );
}

