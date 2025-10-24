import { type ChatMessage, type InsertChatMessage, type SearchQuery, type InsertSearchQuery } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessagesBySession(sessionId: string): Promise<ChatMessage[]>;
  createSearchQuery(query: InsertSearchQuery): Promise<SearchQuery>;
  getAllSearchQueries(): Promise<SearchQuery[]>;
}

export class MemStorage implements IStorage {
  private chatMessages: Map<string, ChatMessage>;
  private searchQueries: Map<string, SearchQuery>;

  constructor() {
    this.chatMessages = new Map();
    this.searchQueries = new Map();
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      timestamp: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getChatMessagesBySession(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter((msg) => msg.sessionId === sessionId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createSearchQuery(insertQuery: InsertSearchQuery): Promise<SearchQuery> {
    const id = randomUUID();
    const query: SearchQuery = {
      ...insertQuery,
      id,
      timestamp: new Date(),
    };
    this.searchQueries.set(id, query);
    return query;
  }

  async getAllSearchQueries(): Promise<SearchQuery[]> {
    return Array.from(this.searchQueries.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

export const storage = new MemStorage();
