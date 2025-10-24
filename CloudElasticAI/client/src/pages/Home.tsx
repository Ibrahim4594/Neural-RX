import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ConversationMessage, SearchResult } from "@shared/schema";
import { ChatMessage } from "@/components/ChatMessage";
import { SearchResultCard } from "@/components/SearchResultCard";
import { ChatInput } from "@/components/ChatInput";
import { TypingIndicator } from "@/components/TypingIndicator";
import { SearchResultSkeleton } from "@/components/SearchResultSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { ScrollToBottomButton } from "@/components/ScrollToBottomButton";
import { apiRequest } from "@/lib/queryClient";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (!scrollContainerRef.current) return;
    
    const viewport = scrollContainerRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement;
    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  // Attach scroll listener once on mount
  useEffect(() => {
    const checkScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const viewport = scrollContainerRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement;
      if (viewport) {
        const { scrollTop, scrollHeight, clientHeight } = viewport;
        const hasOverflow = scrollHeight > clientHeight;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        const isNearBottom = distanceFromBottom < 100;
        const shouldShow = hasOverflow && !isNearBottom && messages.length > 0;
        
        setShowScrollButton(shouldShow);
      }
    };

    // Try to attach listener, retry if viewport not ready
    const attachListener = () => {
      if (!scrollContainerRef.current) return false;
      
      const viewport = scrollContainerRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement;
      if (viewport) {
        viewport.addEventListener('scroll', checkScroll);
        checkScroll(); // Initial check
        return true;
      }
      return false;
    };

    // Try immediately
    if (!attachListener()) {
      // If failed, retry after short delay
      const timeoutId = setTimeout(attachListener, 100);
      return () => clearTimeout(timeoutId);
    }

    return () => {
      if (scrollContainerRef.current) {
        const viewport = scrollContainerRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement;
        if (viewport) {
          viewport.removeEventListener('scroll', checkScroll);
        }
      }
    };
  }, []);

  // Check scroll position when messages change
  useEffect(() => {
    // Check immediately
    const checkPosition = () => {
      if (!scrollContainerRef.current) return;
      
      const viewport = scrollContainerRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement;
      if (viewport) {
        const { scrollTop, scrollHeight, clientHeight } = viewport;
        const hasOverflow = scrollHeight > clientHeight;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        const isNearBottom = distanceFromBottom < 100;
        const shouldShow = hasOverflow && !isNearBottom && messages.length > 0;
        
        setShowScrollButton(shouldShow);
      }
    };

    checkPosition();
    
    // Also check after a brief delay to catch DOM updates
    const timeoutId = setTimeout(checkPosition, 200);
    return () => clearTimeout(timeoutId);
  }, [messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const response = await apiRequest("POST", "/api/chat", {
        message: userMessage,
        sessionId,
      });
      return response.json();
    },
    onMutate: async (userMessage) => {
      const userMsg: ConversationMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
    },
    onSuccess: (data) => {
      const assistantMsg: ConversationMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        searchResults: data.searchResults,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      if (data.searchResults && data.searchResults.length > 0) {
        setSearchResults(data.searchResults);
      }
    },
  });

  const handleSendMessage = (message: string) => {
    chatMutation.mutate(message);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header messages={messages} />

      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-0">
          {/* Chat Panel */}
          <div className="flex flex-col h-full border-r border-border relative">
            <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollContainerRef}>
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.length === 0 ? (
                  <EmptyState type="chat" onQuickAction={handleSendMessage} />
                ) : (
                  <>
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    {chatMutation.isPending && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
            </ScrollArea>

            <ScrollToBottomButton 
              visible={showScrollButton}
              onClick={scrollToBottom}
            />

            <ChatInput
              onSend={handleSendMessage}
              disabled={chatMutation.isPending}
            />
          </div>

          {/* Search Results Panel */}
          <div className="hidden lg:flex flex-col h-full bg-muted/30">
            <div className="border-b border-border p-4">
              <h2 className="text-xl font-medium text-foreground" data-testid="text-results-header">
                Search Results
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {searchResults.length > 0
                  ? `${searchResults.length} ${searchResults.length === 1 ? "result" : "results"} found`
                  : "No results yet"}
              </p>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {searchResults.length === 0 ? (
                  <EmptyState type="search" />
                ) : chatMutation.isPending ? (
                  <>
                    <SearchResultSkeleton />
                    <SearchResultSkeleton />
                    <SearchResultSkeleton />
                  </>
                ) : (
                  searchResults.map((result) => (
                    <SearchResultCard key={result.id} result={result} />
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
