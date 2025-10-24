import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Healthcare data models for the AI-powered search application

export const medicalConditions = pgTable("medical_conditions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // e.g., "Cardiovascular", "Respiratory", "Neurological"
  symptoms: text("symptoms").array().notNull(), // Array of symptom names
  treatments: text("treatments").array().notNull(), // Array of treatment options
  severity: text("severity").notNull(), // "Mild", "Moderate", "Severe"
  prevalence: text("prevalence"), // How common the condition is
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  role: text("role").notNull(), // "user" or "assistant"
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
  relatedConditions: text("related_conditions").array(), // IDs of related medical conditions
});

export const searchQueries = pgTable("search_queries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  query: text("query").notNull(),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
  resultsCount: integer("results_count").notNull(),
});

// Insert schemas
export const insertMedicalConditionSchema = createInsertSchema(medicalConditions).omit({
  id: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export const insertSearchQuerySchema = createInsertSchema(searchQueries).omit({
  id: true,
  timestamp: true,
});

// Types
export type MedicalCondition = typeof medicalConditions.$inferSelect;
export type InsertMedicalCondition = z.infer<typeof insertMedicalConditionSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type SearchQuery = typeof searchQueries.$inferSelect;
export type InsertSearchQuery = z.infer<typeof insertSearchQuerySchema>;

// Frontend-specific types for UI
export interface SearchResult {
  id: string;
  name: string;
  description: string;
  category: string;
  symptoms: string[];
  treatments: string[];
  severity: string;
  relevanceScore: number;
  highlightedTerms?: string[];
}

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  searchResults?: SearchResult[];
  isTyping?: boolean;
}
