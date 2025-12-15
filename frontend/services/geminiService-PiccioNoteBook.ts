import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is not set in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const askAiTutor = async (
  question: string,
  context: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[] = []
) => {
  const client = getClient();
  if (!client) return "I'm sorry, I can't answer right now as the API key is missing.";

  try {
    const chat = client.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are an expert Golang tutor assisting a student with a course. 
        Use the provided transcript context to answer questions specifically about the current lesson.
        Be concise, helpful, and encouraging. If the question is unrelated to the context, politely guide them back to the topic.`,
      },
      history: history,
    });

    const contextPrompt = `Context from current lesson transcript:\n${context}\n\nStudent Question: ${question}`;
    
    const response = await chat.sendMessage({
      message: contextPrompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error while thinking about that. Please try again.";
  }
};