import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
}

export const genAI = new GoogleGenAI({ apiKey });

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const result = await genAI.models.embedContent({
      model: "text-embedding-004",
      contents: [
        {
          parts: [{ text }],
        },
      ],
    });

    if (result && result.embeddings && result.embeddings.length > 0 && result.embeddings[0].values) {
       return result.embeddings[0].values;
    }

    throw new Error("Invalid embedding response structure: " + JSON.stringify(result));
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}
