import React, { useState, useEffect } from 'react';
import { InputSection } from './components/InputSection';
import { Dashboard } from './components/Dashboard';
import { AnalysisResult, Theme } from './types';
import { analyzeGap } from './services/gemini';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');

  // Restore state on load
  useEffect(() => {
    const savedResult = localStorage.getItem('skillGap_result');
    if (savedResult) {
      try {
        setAnalysisResult(JSON.parse(savedResult));
      } catch (e) {
        console.error("Failed to restore state", e);
      }
    }

    const savedTheme = localStorage.getItem('skillGap_theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('skillGap_theme', newTheme);
  };

  const handleAnalyze = async (jd: string, resumeData: { content: string; mimeType: string; isBase64: boolean }) => {
    setIsLoading(true);
    try {
      const result = await analyzeGap(jd, resumeData);
      setAnalysisResult(result);
      localStorage.setItem('skillGap_result', JSON.stringify(result));
    } catch (error: any) {
      console.error(error);
      alert(`Analysis failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    localStorage.removeItem('skillGap_result');
  };

  // Theme-based class definitions for the background
  const bgClasses = theme === 'dark' 
    ? 'bg-slate-950 text-slate-100' 
    : 'bg-slate-50 text-slate-800';

  const blobColors = theme === 'dark'
    ? ['bg-indigo-600', 'bg-emerald-600', 'bg-purple-600']
    : ['bg-indigo-300', 'bg-emerald-300', 'bg-purple-300'];

  return (
    <div className={`min-h-screen font-sans selection:bg-indigo-500/30 transition-colors duration-500 ${bgClasses}`}>
        
        {/* Animated Background Blobs */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <div className={`absolute top-0 left-1/4 w-96 h-96 ${blobColors[0]} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob`}></div>
            <div className={`absolute top-0 right-1/4 w-96 h-96 ${blobColors[1]} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000`}></div>
            <div className={`absolute -bottom-32 left-1/3 w-96 h-96 ${blobColors[2]} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000`}></div>
            
            {/* Mesh overlay for texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        </div>

        <div className="relative z-10">
            {!analysisResult ? (
                <div className="flex items-center justify-center min-h-screen py-10">
                    <InputSection 
                      onAnalyze={handleAnalyze} 
                      isLoading={isLoading} 
                      theme={theme} 
                      toggleTheme={toggleTheme}
                    />
                </div>
            ) : (
                <Dashboard 
                  data={analysisResult} 
                  onReset={handleReset} 
                  theme={theme}
                  toggleTheme={toggleTheme}
                />
            )}
        </div>
    </div>
  );
};

export default App;