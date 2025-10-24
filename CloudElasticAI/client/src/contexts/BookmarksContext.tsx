import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { ConversationMessage, SearchResult } from "@shared/schema";

interface Bookmark {
  id: string;
  type: "message" | "searchResult";
  content: ConversationMessage | SearchResult;
  timestamp: Date;
  tags: string[];
}

interface BookmarksContextType {
  bookmarks: Bookmark[];
  addBookmark: (
    content: ConversationMessage | SearchResult,
    type: "message" | "searchResult",
    tags?: string[]
  ) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (contentId: string) => boolean;
  toggleBookmark: (
    content: ConversationMessage | SearchResult,
    type: "message" | "searchResult"
  ) => void;
  getBookmarksByType: (type: "message" | "searchResult") => Bookmark[];
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

const BOOKMARKS_KEY = "medisearch_bookmarks";

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBookmarks(
          parsed.map((b: any) => ({
            ...b,
            timestamp: new Date(b.timestamp),
          }))
        );
      } catch (error) {
        console.error("Failed to load bookmarks:", error);
      }
    }
  }, []);

  const saveBookmarks = (newBookmarks: Bookmark[]) => {
    setBookmarks(newBookmarks);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
  };

  const addBookmark = (
    content: ConversationMessage | SearchResult,
    type: "message" | "searchResult",
    tags: string[] = []
  ) => {
    const bookmark: Bookmark = {
      id: crypto.randomUUID(),
      type,
      content,
      timestamp: new Date(),
      tags,
    };
    saveBookmarks([...bookmarks, bookmark]);
  };

  const removeBookmark = (id: string) => {
    saveBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  const isBookmarked = (contentId: string) => {
    return bookmarks.some((b) => {
      if (b.type === "message") {
        return (b.content as ConversationMessage).id === contentId;
      } else {
        return (b.content as SearchResult).id === contentId;
      }
    });
  };

  const toggleBookmark = (
    content: ConversationMessage | SearchResult,
    type: "message" | "searchResult"
  ) => {
    const contentId = content.id;
    const bookmark = bookmarks.find((b) => {
      if (b.type === "message") {
        return (b.content as ConversationMessage).id === contentId;
      } else {
        return (b.content as SearchResult).id === contentId;
      }
    });

    if (bookmark) {
      removeBookmark(bookmark.id);
    } else {
      addBookmark(content, type);
    }
  };

  const getBookmarksByType = (type: "message" | "searchResult") => {
    return bookmarks.filter((b) => b.type === type);
  };

  return (
    <BookmarksContext.Provider
      value={{
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        toggleBookmark,
        getBookmarksByType,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarksProvider");
  }
  return context;
}
