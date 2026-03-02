import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;

let genAI: GoogleGenerativeAI | null = null;

if (apiKey && apiKey !== 'dummy_key') {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  console.warn('⚠️ VITE_GEMINI_API_KEY not set. AI features disabled.');
}

export const generateInsight = async (context: string, data: any): Promise<string> => {
  if (!genAI) {
    return "⚠️ Configure VITE_GEMINI_API_KEY in .env to enable AI insights.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `You are an AI analyst for ICON Amsterdam e-commerce. Analyze this data and provide ONE actionable insight.

Context: ${context}
Data: ${JSON.stringify(data).slice(0, 5000)}

Requirements:
- ONE insight only (2 sentences max)
- Identify the MOST important anomaly, trend, or opportunity
- Explain WHY it matters with specific numbers
- Suggest WHAT action to take
- Be direct and specific

Format: "[Insight]. [Action recommendation]."`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error: any) {
    console.error('AI Error:', error);
    if (error?.message?.includes('API_KEY')) {
      return "⚠️ Invalid API key. Check VITE_GEMINI_API_KEY in .env";
    }
    return `⚠️ AI unavailable: ${error?.message || 'Unknown error'}`;
  }
};

export const chatWithAI = async (
  message: string,
  contextData: any,
  history: Array<{ role: string; content: string }>
): Promise<string> => {
  if (!genAI) {
    return "I need an API key! Add VITE_GEMINI_API_KEY to your .env file. Get one at https://makersuite.google.com/app/apikey";
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: `You are an AI business analyst for ICON Amsterdam e-commerce platform.

Current business data: ${JSON.stringify(contextData).slice(0, 8000)}

Rules:
1. Be conversational and helpful
2. Always cite specific numbers from the data
3. Explain reasoning before recommendations
4. Bold key metrics: **$12,543** or **234 units**
5. Keep responses under 150 words
6. Focus on actionable insights

When asked about:
- "risk" → find low stock, high churn, low ROAS
- "opportunity" → find high LTV, high ROAS, fast sellers
- "why" → analyze trends and explain causes`
    });

    const chatHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (error: any) {
    console.error('Chat Error:', error);
    return `⚠️ Error: ${error?.message || 'Try again'}`;
  }
};
