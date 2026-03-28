'use client';
import { useState } from 'react';

export default function AIInsight({ studentId }: { studentId: string }) {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  const getAIAdvice = async () => {
    setLoading(true);
    const res = await fetch('/api/ai-insight', {
      method: 'POST',
      body: JSON.stringify({ studentId }),
    });
    const data = await res.json();
    setInsight(data.insight);
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
      <h3 className="text-lg font-bold flex items-center gap-2">
        ✨ AI Performance Insight
      </h3>
      <p className="text-sm text-gray-600 my-2">
        {insight || "Click the button to analyze your grades with AI."}
      </p>
      <button 
        onClick={getAIAdvice}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition"
      >
        {loading ? "Analyzing..." : "Analyze My Grades"}
      </button>
    </div>
  );
}