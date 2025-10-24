import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateHealthcareResponse(
  userQuery: string,
  searchContext: string
): Promise<string> {
  const systemPrompt = `You are a helpful medical information assistant. Provide accurate, 
easy-to-understand information about medical conditions, symptoms, and treatments. 
Always remind users to consult healthcare professionals for medical advice.

Use the following search results as context to answer the user's question:

${searchContext}

Provide a clear, informative response. If the search results don't contain enough 
information, acknowledge this and provide general guidance.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: systemPrompt,
    },
    contents: userQuery,
  });

  return response.text || "I apologize, but I couldn't generate a response. Please try again.";
}

export async function extractMedicalEntities(query: string): Promise<string[]> {
  const systemPrompt = `Extract medical terms, conditions, symptoms, and treatments from the user's query. 
Return them as a JSON array of strings. Only include relevant medical terms.
Example: ["diabetes", "high blood sugar", "insulin"]`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: {
        type: "array",
        items: { type: "string" },
      },
    },
    contents: query,
  });

  const rawJson = response.text;
  if (rawJson) {
    try {
      return JSON.parse(rawJson);
    } catch {
      return [];
    }
  }
  return [];
}
