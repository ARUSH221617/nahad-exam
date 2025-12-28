import { genAI } from "./ai";
import prisma from "@/lib/prisma";

// Use a fast model for contextualization
const FAST_MODEL = "gemini-1.5-flash";

/**
 * Rewrites the latest user question based on the conversation history to make it standalone.
 */
export async function contextualizeQuestion(
  question: string,
  history: { role: string; parts: string[] }[]
): Promise<string> {
  if (!history || history.length === 0) {
    return question;
  }

  const prompt = `Given a chat history and the latest user question which might reference context in the chat history, formulate a standalone question which can be understood without the chat history. Do NOT answer the question, just reformulate it if needed and otherwise return it as is.

Chat History:
${history.map((h) => `${h.role}: ${h.parts.join("")}`).join("\n")}

Latest Question: ${question}

Standalone Question:`;

  try {
    const result = await genAI.models.generateContent({
      model: FAST_MODEL,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const text = result.text;
    return text ? text.trim() : question;
  } catch (error) {
    console.error("Error contextualizing question:", error);
    return question;
  }
}

/**
 * Performs hybrid search (Vector + Keyword) and combines results using RRF.
 */
export async function hybridSearch(
  docId: string,
  queryText: string,
  queryEmbedding: number[]
): Promise<Array<{ content: string; score: number }>> {
  const embeddingString = `[${queryEmbedding.join(",")}]`;
  const k = 60; // RRF constant
  const limit = 20;

  try {
    // 1. Vector Search
    const vectorResults = await prisma.$queryRaw<Array<{ id: string; content: string; rank: number }>>`
      SELECT id, content, row_number() OVER (ORDER BY embedding <=> ${embeddingString}::vector) as rank
      FROM "DocumentChunk"
      WHERE "documentId" = ${docId}
      ORDER BY embedding <=> ${embeddingString}::vector
      LIMIT ${limit};
    `;

    // 2. Keyword Search (Full Text Search)
    // using 'simple' config for broader matching since Persian might not be fully supported by default postgres config without extensions
    const keywordResults = await prisma.$queryRaw<Array<{ id: string; content: string; rank: number }>>`
      SELECT id, content, row_number() OVER (ORDER BY ts_rank(to_tsvector('simple', content), plainto_tsquery('simple', ${queryText})) DESC) as rank
      FROM "DocumentChunk"
      WHERE "documentId" = ${docId}
      AND to_tsvector('simple', content) @@ plainto_tsquery('simple', ${queryText})
      ORDER BY ts_rank(to_tsvector('simple', content), plainto_tsquery('simple', ${queryText})) DESC
      LIMIT ${limit};
    `;

    // 3. Reciprocal Rank Fusion
    const scores = new Map<string, { content: string; score: number }>();

    for (const item of vectorResults) {
      const current = scores.get(item.id) || { content: item.content, score: 0 };
      current.score += 1 / (k + Number(item.rank)); // Ensure rank is number
      scores.set(item.id, current);
    }

    for (const item of keywordResults) {
      const current = scores.get(item.id) || { content: item.content, score: 0 };
      current.score += 1 / (k + Number(item.rank));
      scores.set(item.id, current);
    }

    // Sort by score desc
    const sortedResults = Array.from(scores.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Return top 10

    return sortedResults;

  } catch (error) {
    console.error("Error in hybridSearch:", error);
    // Fallback to simple vector search if something fails (e.g. tsvector error)
     const fallbackResults = await prisma.$queryRaw<Array<{ content: string; similarity: number }>>`
        SELECT content, 1 - (embedding <=> ${embeddingString}::vector) as similarity
        FROM "DocumentChunk"
        WHERE "documentId" = ${docId}
        ORDER BY embedding <=> ${embeddingString}::vector
        LIMIT 5;
      `;
      return fallbackResults.map(r => ({ content: r.content, score: r.similarity }));
  }
}
