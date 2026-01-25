import React, { useState, useEffect } from 'react';
import { InputSection } from './components/InputSection';
import { Dashboard } from './components/Dashboard';
import { AnalysisResult } from './types';
import { analyzeGap } from './services/gemini';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Restore state on load
  useEffect(() => {
    const saved = localStorage.getItem('skillGap_result');
    if (saved) {
      try {
        setAnalysisResult(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to restore state", e);
      }
    }
  }, []);

  const handleAnalyze = async (jd: string, resumeData: { content: string; mimeType: string; isBase64: boolean }) => {
    setIsLoading(true);
    try {
      const result = await analyzeGap(jd, resumeData);
      setAnalysisResult(result);
      localStorage.setItem('skillGap_result', JSON.stringify(result));
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please try again or check your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    localStorage.removeItem('skillGap_result');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30">
        
        {/* Background Mesh Gradients */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[100px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10">
            {!analysisResult ? (
                <div className="flex items-center justify-center min-h-screen">
                    <InputSection onAnalyze={handleAnalyze} isLoading={isLoading} />
                </div>
            ) : (
                <Dashboard data={analysisResult} onReset={handleReset} />
            )}
        </div>
    </div>
  );
};

export default App;