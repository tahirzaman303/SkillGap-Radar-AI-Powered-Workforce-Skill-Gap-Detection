import React, { useState } from 'react';
import mammoth from 'mammoth';
import { Upload, FileText, Loader2, Moon, Sun, Wand2 } from 'lucide-react';
import { Theme } from '../types';

interface InputSectionProps {
  onAnalyze: (jd: string, resumeData: { content: string; mimeType: string; isBase64: boolean }) => void;
  isLoading: boolean;
  theme: Theme;
  toggleTheme: () => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading, theme, toggleTheme }) => {
  const [jdText, setJdText] = useState('');
  const [resumeData, setResumeData] = useState<{ content: string; mimeType: string; isBase64: boolean } | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | File) => {
    let file: File | undefined;
    if (e instanceof File) {
      file = e;
    } else {
      file = e.target.files?.[0];
    }
    
    if (!file) return;

    setResumeFileName(file.name);

    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        setResumeData({
          content: base64String,
          mimeType: file.type,
          isBase64: true
        });
      };
      reader.readAsDataURL(file);
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        try {
          const result = await mammoth.extractRawText({ arrayBuffer });
          setResumeData({
            content: result.value,
            mimeType: 'text/plain',
            isBase64: false
          });
        } catch (err) {
          console.error("Failed to parse docx", err);
          alert("Failed to parse .docx file");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setResumeData({
          content: reader.result as string,
          mimeType: 'text/plain',
          isBase64: false
        });
      };
      reader.readAsText(file);
    }
  };

  const loadSampleData = () => {
    setJdText(`Senior Frontend Engineer
    
Requirements:
- 5+ years of experience with React and TypeScript.
- Deep understanding of modern frontend build tools (Vite, Webpack).
- Experience designing scalable component libraries.
- Proficiency in state management (Redux, Zustand, or Context).
- Knowledge of cloud platforms (AWS/GCP) and CI/CD pipelines.
- Experience with unit and integration testing (Jest, Cypress).
- Strong communication skills and ability to mentor juniors.`);

    setResumeData({
      content: `ALEX RIVERA\nFrontend Developer\n\nSummary:\nMotivated developer with 3 years of experience building web applications. Passionate about UI/UX and clean code.\n\nExperience:\nWeb Developer | TechStart Inc. (2021-Present)\n- Built internal dashboards using React and JavaScript.\n- Managed global state using Redux Toolkit.\n- Collaborated with backend team to integrate REST APIs.\n- Improved site performance by optimizing images and lazy loading components.\n\nSkills:\n- JavaScript (ES6+), React, HTML5, CSS3, Tailwind CSS\n- Git, npm, Basic Webpack\n- Agile/Scrum methodologies\n\nEducation:\nB.S. Computer Science, State University`,
      mimeType: 'text/plain',
      isBase64: false
    });
    setResumeFileName("sample_resume.txt");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Dynamic Styles
  const containerClass = theme === 'dark' 
    ? 'bg-slate-900/40 border-slate-700/50 text-slate-200 shadow-xl shadow-black/20' 
    : 'bg-white/40 border-white/60 text-slate-800 shadow-xl shadow-indigo-100/40';

  const inputClass = theme === 'dark'
    ? 'bg-slate-950/50 border-slate-700 focus:border-indigo-500 placeholder-slate-600 text-slate-200'
    : 'bg-white/50 border-slate-200 focus:border-indigo-500 placeholder-slate-400 text-slate-700';

  const labelClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  const headingGradient = theme === 'dark' 
    ? 'from-indigo-400 via-purple-400 to-emerald-400' 
    : 'from-indigo-600 via-purple-600 to-emerald-600';

  return (
    <div className={`w-full max-w-5xl mx-auto p-8 rounded-3xl glass-panel border backdrop-blur-2xl transition-all duration-300 animate-fade-in ${containerClass}`}>
      
      {/* Header & Toggle */}
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                    <Wand2 className={`w-6 h-6 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                </div>
                <h1 className={`text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${headingGradient}`}>
                SkillGap Radar
                </h1>
            </div>
          <p className={labelClass}>
            Enterprise-grade Semantic Gap Analysis powered by Gemini 3 Pro
          </p>
        </div>
        
        <div className="flex gap-4 items-center">
            <button
            onClick={loadSampleData}
            className="text-sm font-medium text-indigo-500 hover:text-indigo-400 underline underline-offset-4 transition-colors"
            >
            Load Sample
            </button>
            <button 
                onClick={toggleTheme}
                className={`p-3 rounded-full transition-all hover:scale-110 active:scale-95 ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'}`}
            >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* JD Input */}
        <div className="space-y-3">
          <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Job Description</label>
          <textarea
            className={`w-full h-[320px] p-5 rounded-2xl border resize-none transition-all duration-300 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none custom-scrollbar ${inputClass}`}
            placeholder="Paste the Job Description or requirements here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />
        </div>

        {/* Resume Input */}
        <div className="space-y-3">
          <label className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>Candidate Profile</label>
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`
                relative w-full h-[320px] border-2 border-dashed rounded-2xl transition-all duration-300 group overflow-hidden
                ${isDragging ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' : theme === 'dark' ? 'border-slate-700 hover:border-indigo-500/50 bg-slate-900/30' : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'}
            `}
          >
            <input
              type="file"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              accept=".pdf,.docx,.txt"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                {/* Dynamic Background Circle */}
                <div className={`absolute w-40 h-40 rounded-full blur-[50px] transition-all duration-700 ${theme === 'dark' ? 'bg-indigo-500/10 group-hover:bg-indigo-500/20' : 'bg-indigo-200/40 group-hover:bg-indigo-300/40'}`}></div>

              {resumeFileName ? (
                <div className="relative flex flex-col items-center animate-fade-in-up z-10">
                  <div className={`p-4 rounded-2xl mb-3 shadow-lg ${theme === 'dark' ? 'bg-slate-800 text-emerald-400' : 'bg-white text-emerald-600'}`}>
                    <FileText className="w-8 h-8" />
                  </div>
                  <span className={`font-semibold text-center px-4 truncate max-w-[250px] ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{resumeFileName}</span>
                  <span className="text-xs text-indigo-500 font-medium mt-1">Ready for analysis</span>
                </div>
              ) : (
                <div className={`relative flex flex-col items-center transition-colors z-10 ${theme === 'dark' ? 'text-slate-500 group-hover:text-indigo-400' : 'text-slate-400 group-hover:text-indigo-600'}`}>
                  <div className={`p-4 rounded-2xl mb-4 transition-transform group-hover:scale-110 duration-300 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white shadow-md'}`}>
                    <Upload className="w-8 h-8" />
                  </div>
                  <span className="font-semibold text-lg">Drop Resume Here</span>
                  <span className="text-xs mt-2 opacity-70">PDF, DOCX, or TXT</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={() => jdText && resumeData && onAnalyze(jdText, resumeData)}
          disabled={isLoading || !jdText || !resumeData}
          className={`
            relative px-10 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 transform
            ${isLoading || !jdText || !resumeData
              ? 'bg-slate-500/20 text-slate-400 cursor-not-allowed border border-slate-500/20'
              : 'bg-gradient-to-r from-indigo-600 to-emerald-600 text-white hover:shadow-indigo-500/40 hover:-translate-y-1 active:scale-95 border border-white/10'}
          `}
        >
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
          {isLoading ? (
            <span className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              Reasoning with Gemini...
            </span>
          ) : (
            'Generate Gap Analysis'
          )}
        </button>
      </div>
    </div>
  );
};