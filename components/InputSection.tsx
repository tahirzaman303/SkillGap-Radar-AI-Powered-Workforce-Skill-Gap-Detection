import React, { useState } from 'react';
import mammoth from 'mammoth';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (jd: string, resumeData: { content: string; mimeType: string; isBase64: boolean }) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [jdText, setJdText] = useState('');
  const [resumeData, setResumeData] = useState<{ content: string; mimeType: string; isBase64: boolean } | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string>('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFileName(file.name);

    if (file.type === "application/pdf") {
      // For PDF, convert to base64 to send to Gemini Vision/Multimodal
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
      // For Docx, extract text using mammoth
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
      // Text files
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
      content: `ALEX RIVERA
Frontend Developer

Summary:
Motivated developer with 3 years of experience building web applications. Passionate about UI/UX and clean code.

Experience:
Web Developer | TechStart Inc. (2021-Present)
- Built internal dashboards using React and JavaScript.
- Managed global state using Redux Toolkit.
- Collaborated with backend team to integrate REST APIs.
- Improved site performance by optimizing images and lazy loading components.

Skills:
- JavaScript (ES6+), React, HTML5, CSS3, Tailwind CSS
- Git, npm, Basic Webpack
- Agile/Scrum methodologies

Education:
B.S. Computer Science, State University`,
      mimeType: 'text/plain',
      isBase64: false
    });
    setResumeFileName("sample_resume.txt");
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
          SkillGap Radar
        </h1>
        <p className="text-slate-400 text-lg">
          AI-Powered Semantic Gap Analysis for Talent Intelligence
        </p>
        <button
          onClick={loadSampleData}
          className="text-sm text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
        >
          Load Sample Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* JD Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Job Description</label>
          <textarea
            className="w-full h-64 p-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-200 placeholder-slate-500 resize-none transition-all"
            placeholder="Paste Job Description here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />
        </div>

        {/* Resume Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Candidate Profile</label>
          <div className="w-full h-64 relative border-2 border-dashed border-slate-700 rounded-xl hover:border-indigo-500/50 transition-colors bg-slate-800/20 group">
            <input
              type="file"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              accept=".pdf,.docx,.txt"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              {resumeFileName ? (
                <div className="flex flex-col items-center text-emerald-400">
                  <FileText className="w-12 h-12 mb-2" />
                  <span className="font-medium text-center px-4 truncate max-w-[250px]">{resumeFileName}</span>
                  <span className="text-xs text-slate-500 mt-1">Click to replace</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                  <Upload className="w-10 h-10 mb-3" />
                  <span className="font-medium">Drop Resume or Click to Upload</span>
                  <span className="text-xs mt-1">Supports PDF, DOCX, TXT</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={() => jdText && resumeData && onAnalyze(jdText, resumeData)}
          disabled={isLoading || !jdText || !resumeData}
          className={`
            relative px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-105 active:scale-95
            ${isLoading || !jdText || !resumeData
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-emerald-600 text-white hover:shadow-indigo-500/40'}
          `}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing with Gemini 3 Pro...
            </span>
          ) : (
            'Run Gap Analysis'
          )}
        </button>
      </div>
    </div>
  );
};