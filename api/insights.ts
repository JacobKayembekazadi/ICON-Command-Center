import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { context, data, type } = req.body || {};

  if (!GEMINI_API_KEY) {
    return res.json({ 
      insight: '⚠️ Gemini API key not configured. Set VITE_GEMINI_API_KEY in Vercel environment variables.',
      source: 'error'
    });
  }

  const prompts: Record<string, string> = {
    dashboard: `You are an elite DTC brand analyst for ICON Amsterdam, Samuel Onuha's $30M Dutch menswear brand.

Live data: ${JSON.stringify(data)}

Return ONLY a JSON array of exactly 3 objects. No markdown, no explanation, just JSON:
[
  { "label": "SHORT_TITLE", "finding": "Specific finding with the actual number from the data", "action": "One concrete recommendation" },
  { "label": "SHORT_TITLE", "finding": "Specific finding with the actual number from the data", "action": "One concrete recommendation" },
  { "label": "SHORT_TITLE", "finding": "Specific finding with the actual number from the data", "action": "One concrete recommendation" }
]
Rules: Use real numbers from the data. Labels must be 2-3 words max (e.g., "AD EFFICIENCY", "CATALOG GAP", "REVIEW VELOCITY"). Each finding must reference a specific metric. No asterisks, no markdown.`,

    inventory: `You are a menswear retail analyst. Analyze ICON Amsterdam's product catalog data and provide ONE sharp inventory intelligence insight.

Data: ${JSON.stringify(data).slice(0, 3000)}

Requirements:
- Lead with the most surprising or actionable finding
- Reference specific product types and percentages
- Give ONE concrete recommendation for Samuel Onuha
- Maximum 60 words
- Tone: confident, data-driven, like a McKinsey analyst`,

    revenue: `You are a DTC revenue analyst. Based on public signals, estimate ICON Amsterdam's monthly revenue.

Data: ${JSON.stringify(data).slice(0, 3000)}

Provide:
1. Revenue estimate range (month)
2. Top revenue driver
3. Biggest growth opportunity
Maximum 80 words. Be specific with numbers. State clearly these are estimates from public signals.`,

    ads: `You are a performance marketing expert. Analyze ICON Amsterdam's Meta advertising signals and provide the most important insight.

Data: ${JSON.stringify(data).slice(0, 2000)}

One insight, max 50 words. Reference specific metrics. Give ONE tactical recommendation.`,
  };

  const prompt = prompts[type] || `Analyze this data for ICON Amsterdam and provide one key insight (max 60 words): ${JSON.stringify(data).slice(0, 2000)}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
        })
      }
    );

    const result = await response.json() as any;
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate insight.';
    
    res.json({ insight: text, source: 'gemini', model: 'gemini-2.0-flash' });
  } catch (err: any) {
    res.json({ insight: `Analysis unavailable: ${err.message}`, source: 'error' });
  }
}
