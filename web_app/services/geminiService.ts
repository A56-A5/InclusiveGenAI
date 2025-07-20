
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateCaption = async (imageTopic: string): Promise<string> => {
  if (!API_KEY) {
    // Return a mock response if API key is not available
    return new Promise(resolve => setTimeout(() => resolve(`A beautiful photo of ${imageTopic}. #blessed`), 1000));
  }
  
  try {
    const prompt = `Generate a short, engaging, and friendly social media caption for a photo about "${imageTopic}". Include 2-3 relevant hashtags. Make it sound natural and appealing.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 60,
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating caption with Gemini:", error);
    // Fallback in case of an API error
    return `Failed to generate caption. Here's a default for: ${imageTopic}.`;
  }
};

export const generateCaptionFromImage = async (imageUrl: string): Promise<string> => {
  try {
    console.log('📡 Sending image to Flask backend for analysis:', imageUrl);
    
    const response = await fetch('http://localhost:5000/caption', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: imageUrl }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Received caption from Flask backend:', data.caption);
    
    return data.caption || 'No caption generated.';
  } catch (error) {
    console.error("❌ Error generating caption from Flask backend:", error);
    // Fallback in case of an API error
    return `A photo with interesting details.`;
  }
};
