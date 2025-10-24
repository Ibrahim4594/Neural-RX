import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateHealthcareResponse, extractMedicalEntities } from "./gemini";
import { hybridSearch, checkElasticConnection, initializeElasticIndex, indexHealthcareData } from "./elastic";
import { healthcareData } from "./data/healthcareData";
import { z } from "zod";

const chatRequestSchema = z.object({
  message: z.string().min(1),
  sessionId: z.string(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Elasticsearch and seed data on startup
  let elasticInitialized = false;
  
  (async () => {
    const connected = await checkElasticConnection();
    if (connected) {
      try {
        await initializeElasticIndex();
        await indexHealthcareData(healthcareData);
        elasticInitialized = true;
        console.log("✅ Elasticsearch initialized and data seeded successfully");
      } catch (error) {
        console.error("❌ Failed to initialize Elasticsearch index:", error);
        elasticInitialized = false;
      }
    } else {
      console.error("⚠️  Failed to connect to Elasticsearch - search features will be limited");
      console.error("    The app will continue to work with AI-only responses (no search context)");
    }
  })();

  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    res.json({
      status: "ok",
      elasticsearch: elasticInitialized,
      timestamp: new Date().toISOString(),
    });
  });

  // Chat endpoint - handles user queries with Gemini AI and Elastic search
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId } = chatRequestSchema.parse(req.body);

      // Get conversation history for context
      const conversationHistory = await storage.getChatMessagesBySession(sessionId);
      const recentHistory = conversationHistory.slice(-6); // Last 3 exchanges (6 messages)

      // Save user message
      await storage.createChatMessage({
        sessionId,
        role: "user",
        content: message,
        relatedConditions: null,
      });

      // Extract medical entities and perform hybrid search (if Elasticsearch is available)
      const entities = await extractMedicalEntities(message);
      const searchQuery = entities.length > 0 ? entities.join(" ") : message;
      
      const searchResults = elasticInitialized 
        ? await hybridSearch(searchQuery, 5)
        : [];

      // Log search query
      await storage.createSearchQuery({
        query: message,
        resultsCount: searchResults.length,
      });

      // Build context from search results
      const searchContext = searchResults
        .map((result) => {
          return `Condition: ${result.name}
Category: ${result.category}
Severity: ${result.severity}
Description: ${result.description}
Symptoms: ${result.symptoms.join(", ")}
Treatments: ${result.treatments.join(", ")}
---`;
        })
        .join("\n\n");

      // Build conversation context
      const conversationContext = recentHistory.length > 0
        ? `\n\nPrevious conversation context:\n${recentHistory
            .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
            .join("\n")}\n\nCurrent question: ${message}`
        : message;

      // Generate AI response using Gemini with conversation context
      const aiResponse = await generateHealthcareResponse(conversationContext, searchContext);

      // Save assistant message
      await storage.createChatMessage({
        sessionId,
        role: "assistant",
        content: aiResponse,
        relatedConditions: searchResults.map((r) => r.id),
      });

      res.json({
        response: aiResponse,
        searchResults: searchResults,
      });
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      res.status(500).json({
        error: "Failed to process your message. Please try again.",
      });
    }
  });

  // Search endpoint - direct search without AI response
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }

      const results = await hybridSearch(query, 10);

      await storage.createSearchQuery({
        query,
        resultsCount: results.length,
      });

      res.json({ results });
    } catch (error) {
      console.error("Error in search endpoint:", error);
      res.status(500).json({
        error: "Search failed. Please try again.",
      });
    }
  });

  // Get chat history for a session
  app.get("/api/chat/history/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getChatMessagesBySession(sessionId);
      res.json({ messages });
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({
        error: "Failed to fetch chat history.",
      });
    }
  });

  // Get search analytics
  app.get("/api/analytics/searches", async (req, res) => {
    try {
      const queries = await storage.getAllSearchQueries();
      res.json({ queries: queries.slice(0, 100) }); // Limit to last 100
    } catch (error) {
      console.error("Error fetching search analytics:", error);
      res.status(500).json({
        error: "Failed to fetch analytics.",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
