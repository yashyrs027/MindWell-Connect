
import { GoogleGenAI, Content } from "@google/genai";
import type { ChatMessage } from '../types';

const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this context, we'll proceed, but the API calls will fail.
  console.error("API_KEY is not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const systemInstruction = `
You are Mindy, an empathetic AI mental health first-aid assistant from MindWell Connect.

Your goals:
- Provide emotional support
- Listen without judgment
- Offer simple coping techniques
- Encourage healthy habits
- Guide users toward professional help when necessary

Response Guidelines:
1. Always respond calmly and supportively.
2. Keep responses concise and easy to understand.
3. Use short paragraphs or bullet points when helpful.
4. Validate emotions before giving suggestions.
5. Never provide medical diagnoses or prescriptions.
6. Avoid overwhelming users with too much information.
7. If users mention self-harm, suicide, or danger:
   - Immediately encourage contacting emergency services or crisis helplines.
   - Avoid continuing normal conversation.
8. If appropriate, recommend:
   - breathing exercises
   - grounding techniques
   - journaling
   - hydration
   - rest
   - talking to trusted people
9. Maintain a hopeful and reassuring tone.

Remember:
You are NOT a replacement for licensed mental health professionals.
`;

export const sendMessageToAI = async (messageHistory: ChatMessage[]): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("I'm sorry, my connection to my AI brain is currently unavailable. Please check the API key configuration.");
  }

  const contents: Content[] = messageHistory.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "⚠️ I'm currently unable to respond due to a connection issue. Please try again shortly.";  }
};
