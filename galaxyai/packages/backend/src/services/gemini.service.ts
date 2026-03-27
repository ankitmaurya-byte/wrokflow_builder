import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class GeminiService {
  private model: any;

  constructor(modelName: string = 'gemini-1.5-pro') {
    this.model = genAI.getGenerativeModel({ model: modelName });
  }

  async generate(prompt: string, config: any = {}) {
    try {
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: config.temperature ?? 0.7,
          maxOutputTokens: config.maxTokens ?? 2048,
        },
      });
      return result.response.text();
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      throw new Error(`Gemini execution failed: ${error.message}`);
    }
  }
}
