import { Client } from "@elastic/elasticsearch";
import type { SearchResult } from "@shared/schema";

const cloudId = process.env.ELASTIC_CLOUD_ID || "";
const apiKey = process.env.ELASTIC_API_KEY || "";
const isDirectUrl = cloudId.startsWith("http://") || cloudId.startsWith("https://");

// Initialize Elasticsearch client (supports both regular and serverless)
const client = new Client(
  isDirectUrl
    ? {
        node: cloudId,
        auth: {
          apiKey: apiKey,
        },
      }
    : {
        cloud: {
          id: cloudId,
        },
        auth: {
          apiKey: apiKey,
        },
      }
);

// Track connection status
let isConnected = false;

const INDEX_NAME = "healthcare_conditions";

export async function initializeElasticIndex() {
  try {
    const indexExists = await client.indices.exists({ index: INDEX_NAME });

    if (!indexExists) {
      await client.indices.create({
        index: INDEX_NAME,
        mappings: {
          properties: {
            name: { type: "text", analyzer: "standard" },
            description: { type: "text", analyzer: "standard" },
            category: { type: "keyword" },
            symptoms: { type: "text", analyzer: "standard" },
            treatments: { type: "text", analyzer: "standard" },
            severity: { type: "keyword" },
            prevalence: { type: "text" },
          },
        },
      });
      console.log(`Created Elasticsearch index: ${INDEX_NAME}`);
    }
  } catch (error) {
    console.error("Error initializing Elastic index:", error);
  }
}

export async function indexHealthcareData(data: any[]) {
  try {
    const operations = data.flatMap((doc) => [
      { index: { _index: INDEX_NAME, _id: doc.id } },
      doc,
    ]);

    if (operations.length > 0) {
      const bulkResponse = await client.bulk({ refresh: true, operations });

      if (bulkResponse.errors) {
        console.error("Bulk indexing had errors");
      } else {
        console.log(`Indexed ${data.length} healthcare documents`);
      }
    }
  } catch (error) {
    console.error("Error indexing data:", error);
  }
}

export async function hybridSearch(
  query: string,
  limit: number = 5
): Promise<SearchResult[]> {
  if (!isConnected) {
    console.warn("Elasticsearch not connected - returning empty results");
    return [];
  }

  try {
    // Enhanced keyword search with boosting and fuzzy matching
    // Note: True hybrid search would combine this with vector/semantic search
    // For full semantic search, we would need to:
    // 1. Generate embeddings for medical conditions using a model
    // 2. Store embeddings in a dense_vector field
    // 3. Combine keyword scores with cosine similarity scores
    const response = await client.search({
      index: INDEX_NAME,
      query: {
        bool: {
          should: [
            // Exact match on name gets highest boost
            {
              match: {
                name: {
                  query: query,
                  boost: 3,
                },
              },
            },
            // Description and symptoms get medium boost
            {
              multi_match: {
                query: query,
                fields: ["description^2", "symptoms^2"],
                type: "best_fields",
                fuzziness: "AUTO",
              },
            },
            // Category and treatments get lower boost
            {
              multi_match: {
                query: query,
                fields: ["category^1.5", "treatments"],
                type: "cross_fields",
              },
            },
          ],
          minimum_should_match: 1,
        },
      },
      size: limit,
    });

    if (!response.hits || !response.hits.hits) {
      return [];
    }

    return response.hits.hits.map((hit: any) => ({
      id: hit._id,
      name: hit._source.name,
      description: hit._source.description,
      category: hit._source.category,
      symptoms: Array.isArray(hit._source.symptoms) 
        ? hit._source.symptoms 
        : hit._source.symptoms.split(',').map((s: string) => s.trim()),
      treatments: Array.isArray(hit._source.treatments)
        ? hit._source.treatments
        : hit._source.treatments.split(',').map((t: string) => t.trim()),
      severity: hit._source.severity,
      relevanceScore: Math.min((hit._score || 0) / 10, 1), // Normalize to 0-1 range, cap at 1
      highlightedTerms: [],
    }));
  } catch (error: any) {
    console.error("Error performing search:", error.message);
    return [];
  }
}

export async function checkElasticConnection(): Promise<boolean> {
  try {
    await client.ping();
    console.log("✅ Elasticsearch connection successful");
    isConnected = true;
    return true;
  } catch (error: any) {
    console.error("❌ Elasticsearch connection failed:", error.message);
    if (error.meta?.statusCode === 401) {
      console.error("   Authentication error - please verify your ELASTIC_API_KEY");
      console.error("   For serverless endpoints, ensure you're using the correct API key format");
    }
    isConnected = false;
    return false;
  }
}

export function isElasticConnected(): boolean {
  return isConnected;
}
