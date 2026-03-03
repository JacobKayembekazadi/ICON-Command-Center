import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { data, type } = req.body || {};

  if (!GEMINI_API_KEY) {
    return res.json({ insight: 'API key not configured.', source: 'error' });
  }

  const prompts: Record<string, string> = {
    dashboard: `You are an elite DTC brand analyst for ICON Amsterdam, Samuel Onuha's $30M Dutch menswear brand.

Live data: ${JSON.stringify(data)}

Return ONLY a JSON array of exactly 3 objects. No markdown, no explanation, just raw JSON:
[
  { "label": "SHORT_TITLE", "finding": "Specific finding with the actual number from the data", "action": "One concrete recommendation" },
  { "label": "SHORT_TITLE", "finding": "Specific finding with the actual number from the data", "action": "One concrete recommendation" },
  { "label": "SHORT_TITLE", "finding": "Specific finding with the actual number from the data", "action": "One concrete recommendation" }
]
Rules: Use real numbers from the data. Labels max 3 words (e.g. "AD EFFICIENCY", "CATALOG GAP"). No asterisks, no markdown. Just JSON.`,

    inventory: `You are a menswear retail analyst. Analyze ICON Amsterdam's product catalog and give ONE sharp insight. Data: ${JSON.stringify(data).slice(0, 2000)}. Max 60 words. No markdown. Specific numbers only.`,

    revenue: `You are a DTC revenue analyst. Based on these signals from ICON Amsterdam, provide: 1) revenue estimate 2) top driver 3) growth opportunity. Data: ${JSON.stringify(data).slice(0, 2000)}. Max 80 words. No markdown. State these are estimates.`,

    ads: `Performance marketing expert. Analyze ICON Amsterdam's Meta ad signals and give ONE tactical insight. Data: ${JSON.stringify(data).slice(0, 1500)}. Max 50 words. No markdown.`,
  };

  const prompt = prompts[type] || `Analyze this ICON Amsterdam data and give one key insight (max 60 words, no markdown): ${JSON.stringify(data).slice(0, 2000)}`;

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    res.json({ insight: text, source: 'gemini', model: 'gemini-3-flash-preview' });
  } catch (err: any) {
    res.json({ insight: `Analysis unavailable: ${err.message}`, source: 'error' });
  }
}
