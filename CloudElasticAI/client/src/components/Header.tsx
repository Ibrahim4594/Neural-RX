import { Activity, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { ExportDialog } from "@/components/ExportDialog";
import type { ConversationMessage } from "@shared/schema";

interface HeaderProps {
  messages?: ConversationMessage[];
}

export function Header({ messages = [] }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground" data-testid="text-app-title">
              MediSearch AI
            </h1>
            <p className="text-xs text-muted-foreground">
              Powered by Elastic + Google Gemini
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ExportDialog messages={messages} />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
