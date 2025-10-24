import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, MicOff } from "lucide-react";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { isListening, isSupported, toggleListening } = useVoiceRecognition({
    onTranscript: (transcript) => {
      setMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
    },
    continuous: false,
  });

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sticky bottom-0 border-t border-border bg-background p-4">
      <div className="mx-auto max-w-4xl">
        <div className="flex gap-2 items-end">
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isListening
                  ? "Listening..."
                  : "Ask about medical conditions, symptoms, treatments..."
              }
              disabled={disabled}
              className="min-h-[60px] max-h-32 resize-none rounded-xl text-base pr-12"
              data-testid="input-chat-message"
            />
            {isSupported && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleListening}
                disabled={disabled}
                className={`absolute right-2 bottom-2 h-8 w-8 ${
                  isListening
                    ? "text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500"
                    : ""
                }`}
                data-testid="button-voice-input"
                title={isListening ? "Stop recording" : "Voice input"}
              >
                {isListening ? <MicOff className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
              </Button>
            )}
          </div>
          <Button
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            size="icon"
            className="h-[60px] w-[60px] shrink-0"
            data-testid="button-send-message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {isSupported
            ? "Press Enter to send, Shift+Enter for new line, or click mic for voice input"
            : "Press Enter to send, Shift+Enter for new line"}
        </p>
      </div>
    </div>
  );
}
