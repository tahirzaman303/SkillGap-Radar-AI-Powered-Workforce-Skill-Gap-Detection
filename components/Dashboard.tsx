import React, { useState } from 'react';
import { AnalysisResult, Skill } from '../types';
import { SkillRadar } from './SkillRadar';
import { Download, ChevronRight, CheckCircle, BrainCircuit, RotateCcw } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DashboardProps {
  data: AnalysisResult;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onReset }) => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(data.skills[0] || null);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("SkillGap Radar - Analysis Report", 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Match Score: ${data.matchScore}%`, 14, 32);
    
    // Summary
    doc.setFontSize(14);
    doc.text("Executive Summary", 14, 45);
    doc.setFontSize(10);
    const splitSummary = doc.splitTextToSize(data.executiveSummary, 180);
    doc.text(splitSummary, 14, 52);

    // Skills Table
    const tableData = data.skills.map(s => [
      s.name,
      s.requiredLevel.toString(),
      s.observedLevel.toString(),
      s.gap > 0 ? `-${s.gap}` : 'Match',
      s.importance
    ]);

    autoTable(doc, {
      startY: 70,
      head: [['Skill', 'Required', 'Observed', 'Gap', 'Importance']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });

    // Learning Pathway
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    doc.setFontSize(14);
    doc.text("Recommended Learning Pathway", 14, finalY + 15);
    
    const pathwayData = data.learningPathway.map(l => [
      l.action,
      l.priority,
      l.timeline,
      l.resource
    ]);

    autoTable(doc, {
      startY: finalY + 20,
      head: [['Action', 'Priority', 'Timeline', 'Resource']],
      body: pathwayData,
      theme: 'striped',
    });

    doc.save("SkillGap_Report.pdf");
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-8 space-y-6 animate-fade-in pb-20">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700 sticky top-4 z-20 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
              <path className={`${getScoreColor(data.matchScore)} transition-all duration-1000 ease-out`} strokeDasharray={`${data.matchScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
            <span className={`text-xl font-bold ${getScoreColor(data.matchScore)}`}>{data.matchScore}%</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Analysis Complete</h2>
            <p className="text-slate-400 text-sm">Based on Gemini 3 Pro Reasoning</p>
          </div>
        </div>
        
        <div className="flex gap-3">
            <button onClick={onReset} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button onClick={downloadReport} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                <Download className="w-4 h-4" /> Export PDF
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Summary & Radar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-400" /> Executive Summary
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm">
              {data.executiveSummary}
            </p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-4">
            <h3 className="text-lg font-semibold text-slate-200 mb-2 text-center">Competency Radar</h3>
            <SkillRadar skills={data.skills} />
          </div>
        </div>

        {/* Center Col: Skills Matrix */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 overflow-hidden flex flex-col h-[500px]">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Skill Gap Matrix</h3>
                <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
                    <div className="space-y-3">
                        {data.skills.map((skill, idx) => (
                            <div 
                                key={idx}
                                onClick={() => setSelectedSkill(skill)}
                                className={`
                                    group flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all
                                    ${selectedSkill?.name === skill.name 
                                        ? 'bg-indigo-500/10 border-indigo-500/50' 
                                        : 'bg-slate-900/40 border-slate-700 hover:border-slate-500'}
                                `}
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-slate-200">{skill.name}</span>
                                        {skill.importance === 'Critical' && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 px-2 py-0.5 rounded">Critical</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-slate-400">
                                        <span>Req: <span className="text-indigo-300 font-mono">{skill.requiredLevel}/5</span></span>
                                        <span>Obs: <span className="text-emerald-300 font-mono">{skill.observedLevel}/5</span></span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <div className="hidden sm:block w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${skill.gap > 0 ? 'bg-red-400' : 'bg-emerald-400'}`} 
                                            style={{ width: `${Math.min((skill.observedLevel / skill.requiredLevel) * 100, 100)}%` }}
                                        />
                                    </div>
                                    <ChevronRight className={`w-5 h-5 text-slate-500 transition-transform ${selectedSkill?.name === skill.name ? 'rotate-90' : ''}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detail Panel */}
            {selectedSkill && (
                <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 animate-fade-in-up">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-white">{selectedSkill.name}</h3>
                            <span className="text-sm text-slate-400">{selectedSkill.category}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-lg text-sm font-bold ${selectedSkill.gap > 0 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {selectedSkill.gap > 0 ? `Gap Level: ${selectedSkill.gap}` : 'Match / Exceeds'}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-sm font-semibold text-indigo-300 mb-2 flex items-center gap-2">
                                <BrainCircuit className="w-4 h-4" /> AI Reasoning
                            </h4>
                            <p className="text-slate-300 text-sm leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                                {selectedSkill.reasoning}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-emerald-300 mb-2 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" /> Evidence Found
                            </h4>
                            <p className="text-slate-300 text-sm leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 italic">
                                "{selectedSkill.evidence}"
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>

        {/* Learning Pathway */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-6">Personalized Upskilling Pathway</h3>
          <div className="relative border-l-2 border-slate-700 ml-4 space-y-8">
            {data.learningPathway.map((item, idx) => (
                <div key={idx} className="relative pl-8">
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${item.priority === 'High' ? 'bg-indigo-500 border-indigo-900' : 'bg-slate-500 border-slate-900'}`}></div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                        <h4 className="text-white font-medium text-lg">{item.action}</h4>
                        <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">Estimated: {item.timeline}</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">Priority: <span className={`${item.priority === 'High' ? 'text-indigo-400' : 'text-slate-400'}`}>{item.priority}</span></p>
                    {item.resource && (
                         <a href={item.resource} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 text-sm underline flex items-center gap-1">
                            Recommended Resource <ChevronRight className="w-3 h-3"/>
                         </a>
                    )}
                </div>
            ))}
          </div>
      </div>
    </div>
  );
};