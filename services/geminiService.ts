import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from "../types";

// Initialize the API client
// Note: In a real production app, this key should be proxied or handled securely.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateResponse = async (
  history: ChatMessage[],
  newMessage: string,
  context?: string
): Promise<string> => {
  try {
    // We use the flash preview model for fast, responsive chat
    const modelId = 'gemini-3-flash-preview';
    
    // Construct the prompt with context (simulating RAG)
    let prompt = newMessage;
    if (context) {
      prompt = `Context from document:\n${context}\n\nQuestion: ${newMessage}`;
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert exam solver for Nahad University students. You help solve problems, explain concepts, and summarize key topics from the provided exam documents. Be concise, academic, and encouraging. Use Markdown for math formatting.",
      }
    });

    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error connecting to the AI service. Please check your API key configuration.";
  }
};

export const summarizeDocument = async (text: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize the following exam document content in 3 bullet points:\n\n${text.substring(0, 5000)}`, // Truncate for demo limits
    });
    return response.text || "Could not summarize.";
  } catch (error) {
    console.error("Gemini Summarize Error:", error);
    return "Error generating summary.";
  }
};