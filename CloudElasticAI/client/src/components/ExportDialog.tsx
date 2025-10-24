import { FileDown, FileText, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { ConversationMessage } from "@shared/schema";
import { exportChatAsText, exportChatAsPDF, exportChatAsJSON } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";

interface ExportDialogProps {
  messages: ConversationMessage[];
  disabled?: boolean;
}

export function ExportDialog({ messages, disabled }: ExportDialogProps) {
  const { toast } = useToast();

  const handleExport = (format: "pdf" | "text" | "json") => {
    if (messages.length === 0) {
      toast({
        title: "No messages to export",
        description: "Start a conversation first, then export your chat history.",
        variant: "destructive",
      });
      return;
    }

    try {
      switch (format) {
        case "pdf":
          exportChatAsPDF(messages);
          break;
        case "text":
          exportChatAsText(messages);
          break;
        case "json":
          exportChatAsJSON(messages);
          break;
      }

      toast({
        title: "Chat exported successfully!",
        description: `Downloaded ${messages.length} messages as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "There was a problem exporting your chat. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled || messages.length === 0}
          data-testid="button-export"
        >
          <FileDown className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => handleExport("pdf")}
          data-testid="export-pdf"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("text")}
          data-testid="export-text"
        >
          <FileText className="mr-2 h-4 w-4" />
          Export as Text
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleExport("json")}
          data-testid="export-json"
        >
          <FileJson className="mr-2 h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
