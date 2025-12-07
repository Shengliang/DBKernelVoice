
import { GoogleGenAI } from "@google/genai";
import { DomainConfig, SearchResult } from '../types';
import { decodeBase64, pcmToWav } from '../utils/audio';

let ai: GoogleGenAI | null = null;

// Initialize API (Handshake with Server or use Env)
export const initAI = async () => {
  if (ai) return;
  
  let key = process.env.API_KEY;
  
  // Try fetching from server if not in build
  if (!key) {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      if (data.apiKey) key = data.apiKey;
    } catch (e) {
      console.warn("Failed to fetch server config");
    }
  }

  if (!key) {
    // Fallback to local storage
    key = localStorage.getItem('user_api_key') || "";
  }

  if (key) {
    ai = new GoogleGenAI({ apiKey: key });
  }
};

export const generateLecture = async (domain: DomainConfig, topic: string): Promise<SearchResult> => {
  await initAI();
  if (!ai) throw new Error("API Key missing");

  const prompt = `
    ${domain.systemPrompt}
    
    Topic: "${topic}"
    
    Strict JSON Output format:
    {
      "title": "The specific title",
      "overview": "A 2-3 sentence summary",
      "script": "The full dialogue script with Speaker: Text format."
    }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });

  const text = response.text || "{}";
  const data = JSON.parse(text);

  return {
    domainId: domain.id,
    title: data.title || topic,
    overview: data.overview || "Generated content",
    script: data.script || "Teacher: Content generation failed."
  };
};

export const generateSpeech = async (text: string, voiceName: string): Promise<string> => {
  await initAI();
  if (!ai) throw new Error("API Key missing");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
    },
  });

  const pcmData = decodeBase64(response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "");
  return URL.createObjectURL(pcmToWav(pcmData));
};
