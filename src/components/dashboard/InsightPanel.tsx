import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Sparkles, RefreshCw } from 'lucide-react';
import { generateInsight } from '@/lib/gemini';
import { Button } from '@/components/ui/Button';

interface InsightPanelProps {
  context: string;
  data: any;
}

export const InsightPanel: React.FC<InsightPanelProps> = ({ context, data }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsight = async () => {
    setLoading(true);
    try {
      const result = await generateInsight(context, data);
      setInsight(result);
    } catch (error) {
      setInsight("Could not generate insight at this time.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsight();
  }, [context]); // Re-run when context changes

  return (
    <Card className="bg-gradient-to-br from-[#1a1f3a] to-[#0A0E27] border-[#00D9FF]/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-[#00D9FF]" />
          <h3 className="font-semibold text-white">AI Analyst Insight</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={fetchInsight} 
          isLoading={loading}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="min-h-[60px]">
        {loading ? (
          <div className="flex items-center space-x-2 text-gray-400 animate-pulse">
            <div className="w-2 h-2 bg-[#00D9FF] rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-[#00D9FF] rounded-full animate-bounce delay-75" />
            <div className="w-2 h-2 bg-[#00D9FF] rounded-full animate-bounce delay-150" />
            <span className="text-sm">Analyzing data patterns...</span>
          </div>
        ) : (
          <p className="text-gray-300 leading-relaxed text-sm">
            {insight || "No insights available."}
          </p>
        )}
      </div>
    </Card>
  );
};
