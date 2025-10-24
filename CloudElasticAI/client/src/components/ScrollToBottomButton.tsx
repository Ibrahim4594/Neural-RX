import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScrollToBottomButtonProps {
  onClick: () => void;
  visible: boolean;
}

export function ScrollToBottomButton({ onClick, visible }: ScrollToBottomButtonProps) {
  if (!visible) return null;

  return (
    <div className="absolute bottom-24 right-6 z-10 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <Button
        onClick={onClick}
        size="icon"
        className="h-10 w-10 rounded-full shadow-lg"
        data-testid="button-scroll-bottom"
      >
        <ArrowDown className="h-5 w-5" />
      </Button>
    </div>
  );
}
