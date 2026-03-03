// All Gemini calls are proxied server-side — key never exposed in bundle

async function callAI(prompt: string): Promise<string> {
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) return 'AI unavailable.';
    const data = await res.json();
    return data.text || 'AI unavailable.';
  } catch {
    return 'AI unavailable.';
  }
}

export async function generateInsight(type: string, data: any): Promise<string> {
  const prompts: Record<string, string> = {
    inventory: `Menswear retail analyst. One sharp insight for ICON Amsterdam inventory. Data: ${JSON.stringify(data).slice(0,2000)}. Max 60 words. No markdown.`,
    revenue: `DTC analyst. Estimate ICON Amsterdam monthly revenue from these signals. Data: ${JSON.stringify(data).slice(0,2000)}. Max 80 words.`,
    ads: `Performance marketing. One tactical insight on ICON Amsterdam Meta ads. Data: ${JSON.stringify(data).slice(0,1500)}. Max 50 words.`,
  };
  return callAI(prompts[type] || `Analyze ICON Amsterdam data (max 60 words): ${JSON.stringify(data).slice(0,2000)}`);
}

export async function chatWithAI(query: string, context: any): Promise<string> {
  const prompt = `You are the AI assistant for ICON Amsterdam Command Center.
User: "${query}"
Context: ${JSON.stringify(context)}
Helpful, concise, data-driven response. No markdown.`;
  return callAI(prompt);
}

export async function analyzeDM(message: string): Promise<any> {
  const prompt = `Analyze this DM for a high-ticket coaching program. Classify: Serious/High Potential/Tire-Kicker/Not Ready. Message: "${message}". Return JSON: {"classification":"string","confidence":number,"signals":["string"],"suggestedResponse":"string","reasoning":"string"}`;
  const text = await callAI(prompt);
  try { return JSON.parse(text.replace(/\`\`\`json|\`\`\`/g,'')); } catch { return { classification:'Error', confidence:0, signals:[], suggestedResponse:'Try again', reasoning:'Parse error' }; }
}

export async function generateLearningPath(profile: any): Promise<any> {
  const prompt = `Generate a 10-module personalized learning path for: ${JSON.stringify(profile)}. Return JSON: {"modules":[{"id":"string","title":"string","week":number,"riskLevel":"low|medium|high","reasoning":"string"}],"predictedTimeline":"string","modifications":"string","recommendations":["string"]}`;
  const text = await callAI(prompt);
  try { return JSON.parse(text.replace(/\`\`\`json|\`\`\`/g,'')); } catch { return null; }
}

export async function answerQuestion(question: string): Promise<any> {
  const prompt = `E-commerce coach. Answer: "${question}". Return JSON: {"answer":"string","confidence":number,"decision":"AUTO-ANSWER|ESCALATE","contextSummary":"string","source":"string","suggestedFollowUp":"string"}`;
  const text = await callAI(prompt);
  try { return JSON.parse(text.replace(/\`\`\`json|\`\`\`/g,'')); } catch { return { answer:'', confidence:0, decision:'ESCALATE', contextSummary:'Error', source:'Error', suggestedFollowUp:'' }; }
}

export async function analyzeOutcomes(data: any[]): Promise<any> {
  const prompt = `Analyze e-commerce student data. Data: ${JSON.stringify(data.slice(0,20))}. Return JSON: {"atRiskCount":number,"patterns":["string"],"bottlenecks":["string"],"highPerformersCount":number,"insights":["string"]}`;
  const text = await callAI(prompt);
  try { return JSON.parse(text.replace(/\`\`\`json|\`\`\`/g,'')); } catch { return null; }
}

export async function repurposeContent(transcript: string): Promise<any> {
  const prompt = `Repurpose this Q&A transcript. Transcript: "${transcript.substring(0,5000)}". Return JSON: {"summary":"string","keyTakeaways":["string"],"videoScripts":["string"],"instagramCarousel":["string"],"emailNewsletter":"string","faqEntries":[{"question":"string","answer":"string"}]}`;
  const text = await callAI(prompt);
  try { return JSON.parse(text.replace(/\`\`\`json|\`\`\`/g,'')); } catch { return null; }
}
