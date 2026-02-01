import React, { useState } from 'react';
import { AnalysisResult, Skill, Theme } from '../types';
import { SkillRadar } from './SkillRadar';
import { 
  Download, 
  ChevronRight, 
  CheckCircle, 
  BrainCircuit, 
  RotateCcw, 
  Moon, 
  Sun, 
  ArrowRight,
  Search,
  AlertTriangle,
  Clock,
  BookOpen,
  Calendar,
  Check
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DashboardProps {
  data: AnalysisResult;
  onReset: () => void;
  theme: Theme;
  toggleTheme: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onReset, theme, toggleTheme }) => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  // Filter skills based on search
  const filteredSkills = data.skills.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter pathway based on search
  const filteredPathway = data.learningPathway.filter(p => 
    p.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.resource.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Determine which skill to display in detail view
  // If the previously selected skill is still in the filtered list, keep it.
  // Otherwise, fallback to the first item in the filtered list.
  const activeSkill = selectedSkill && filteredSkills.find(s => s.name === selectedSkill.name)
    ? selectedSkill
    : filteredSkills[0] || null;

  const toggleActionComplete = (actionName: string) => {
    const newSet = new Set(completedActions);
    if (newSet.has(actionName)) {
      newSet.delete(actionName);
    } else {
      newSet.add(actionName);
    }
    setCompletedActions(newSet);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("SkillGap Radar - Analysis Report", 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Match Score: ${data.matchScore}%`, 14, 32);
    doc.text(`Analyzed with: ${data.modelUsed || 'Gemini AI'}`, 14, 38);
    
    doc.setFontSize(14);
    doc.text("Executive Summary", 14, 48);
    doc.setFontSize(10);
    const splitSummary = doc.splitTextToSize(data.executiveSummary, 180);
    doc.text(splitSummary, 14, 55);

    const tableData = data.skills.map(s => [
      s.name,
      s.requiredLevel.toString(),
      s.observedLevel.toString(),
      s.gap > 0 ? `-${s.gap}` : 'Match',
      s.importance
    ]);

    autoTable(doc, {
      startY: 75,
      head: [['Skill', 'Required', 'Observed', 'Gap', 'Importance']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });

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

  // Timeline Helpers
  const getPriorityIcon = (priority: string, isCompleted: boolean) => {
    if (isCompleted) return <Check className="w-5 h-5 text-white" />;
    switch (priority) {
      case 'High': return <AlertTriangle className="w-4 h-4 text-white" />;
      case 'Medium': return <Clock className="w-4 h-4 text-white" />;
      case 'Low': return <CheckCircle className="w-4 h-4 text-white" />;
      default: return <BookOpen className="w-4 h-4 text-white" />;
    }
  };

  const getPriorityColor = (priority: string, isCompleted: boolean) => {
    if (isCompleted) return 'bg-emerald-500 border-emerald-600 shadow-lg shadow-emerald-500/30';
    switch (priority) {
      case 'High': return 'bg-red-500 border-red-600 shadow-lg shadow-red-500/30';
      case 'Medium': return 'bg-amber-500 border-amber-600 shadow-lg shadow-amber-500/30';
      case 'Low': return 'bg-indigo-500 border-indigo-600 shadow-lg shadow-indigo-500/30';
      default: return 'bg-slate-500 border-slate-600';
    }
  };

  const importanceDefinitions: Record<string, string> = {
    'Critical': "Essential for the role. Absence significantly impacts performance.",
    'High': "Very important. Strong proficiency is expected.",
    'Medium': "Beneficial. Can likely be learned on the job.",
    'Low': "Optional. Nice to have but not a dealbreaker."
  };

  // Theme Helpers
  const glassCard = theme === 'dark'
    ? 'bg-slate-900/40 border-slate-700/50 text-slate-100 shadow-xl shadow-black/10'
    : 'bg-white/40 border-white/60 text-slate-800 shadow-xl shadow-indigo-100/50';
  
  const glassCardHover = theme === 'dark'
    ? 'hover:bg-slate-800/40 hover:border-slate-600'
    : 'hover:bg-white/60 hover:border-white';

  const textMuted = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const textBody = theme === 'dark' ? 'text-slate-300' : 'text-slate-600';
  const headingColor = theme === 'dark' ? 'text-white' : 'text-slate-900';

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-8 space-y-6 pb-20 animate-fade-in">
      
      {/* Sticky Header */}
      <div className={`flex flex-col md:flex-row justify-between items-center gap-4 p-6 rounded-2xl border glass-panel sticky top-4 z-50 transition-all duration-300 ${glassCard}`}>
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-lg" viewBox="0 0 36 36">
              <path className={theme === 'dark' ? "text-slate-800" : "text-white"} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
              <path className={`${getScoreColor(data.matchScore)} transition-all duration-1000 ease-out`} strokeDasharray={`${data.matchScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <div className="flex flex-col items-center">
                <span className={`text-xl font-bold ${getScoreColor(data.matchScore)}`}>{data.matchScore}%</span>
            </div>
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${headingColor}`}>Analysis Complete</h2>
            <p className={textMuted}>Powered by <span className="text-indigo-500 font-semibold">{data.modelUsed || 'Gemini AI'}</span></p>
          </div>
        </div>
        
        <div className="flex gap-3">
             <button 
                onClick={toggleTheme}
                className={`p-2.5 rounded-lg border transition-all ${theme === 'dark' ? 'border-slate-700 bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
            >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={onReset} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border ${theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'}`}>
                <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button onClick={downloadReport} className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:to-indigo-400 text-white rounded-lg transition-all shadow-lg shadow-indigo-500/30">
                <Download className="w-4 h-4" /> Export Report
            </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '0.05s' }}>
         <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${textMuted}`}>
            <Search className="w-5 h-5" />
         </div>
         <input
            type="text"
            className={`block w-full pl-12 pr-4 py-4 rounded-2xl border text-base shadow-sm backdrop-blur-md transition-all duration-300 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none ${
                theme === 'dark'
                ? 'bg-slate-900/60 border-slate-700 text-slate-100 placeholder-slate-500 focus:bg-slate-900'
                : 'bg-white/60 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
            }`}
            placeholder="Search for skills, gaps, or learning resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Summary & Radar */}
        <div className="lg:col-span-1 space-y-6">
          <div className={`rounded-2xl p-6 glass-panel border animate-fade-in ${glassCard}`} style={{ animationDelay: '0.1s' }}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${headingColor}`}>
              <BrainCircuit className="w-5 h-5 text-indigo-400" /> Executive Summary
            </h3>
            <p className={`${textBody} leading-relaxed text-sm`}>
              {data.executiveSummary}
            </p>
          </div>

          <div className={`rounded-2xl p-4 glass-panel border animate-fade-in ${glassCard}`} style={{ animationDelay: '0.2s' }}>
            <h3 className={`text-lg font-semibold mb-2 text-center ${headingColor}`}>Competency Radar</h3>
            <SkillRadar skills={filteredSkills.length > 0 ? filteredSkills : data.skills} theme={theme} />
          </div>
        </div>

        {/* Center Col: Skills Matrix */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            <div className={`rounded-2xl p-6 overflow-hidden flex flex-col h-[500px] glass-panel border animate-fade-in ${glassCard}`} style={{ animationDelay: '0.3s' }}>
                <h3 className={`text-lg font-semibold mb-4 ${headingColor} flex justify-between items-center`}>
                    <span>Skill Gap Matrix</span>
                    <span className="text-xs px-2 py-1 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                        {filteredSkills.length} Skills
                    </span>
                </h3>
                
                <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
                    {filteredSkills.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full opacity-50">
                            <Search className="w-10 h-10 mb-2" />
                            <p>No skills match your search.</p>
                        </div>
                    ) : (
                    <div className="space-y-3">
                        {filteredSkills.map((skill, idx) => (
                            <div 
                                key={idx}
                                onClick={() => setSelectedSkill(skill)}
                                className={`
                                    group flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200
                                    ${activeSkill?.name === skill.name 
                                        ? 'bg-indigo-500/10 border-indigo-500/50' 
                                        : theme === 'dark' ? 'bg-slate-900/40 border-transparent hover:bg-slate-800' : 'bg-white/50 border-transparent hover:bg-white'}
                                `}
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`font-semibold ${headingColor}`}>{skill.name}</span>
                                        
                                        {/* Importance Tooltip */}
                                        <div className="group/tooltip relative inline-flex">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded cursor-help transition-colors
                                                ${skill.importance === 'Critical' ? 'bg-red-500/20 text-red-400' : 
                                                  skill.importance === 'High' ? 'bg-amber-500/20 text-amber-400' :
                                                  skill.importance === 'Medium' ? 'bg-indigo-500/20 text-indigo-400' :
                                                  'bg-slate-500/20 text-slate-400'}
                                            `}>
                                                {skill.importance}
                                            </span>
                                            
                                            {/* Tooltip Content */}
                                            <div className={`
                                                absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 rounded-xl text-xs z-50 pointer-events-none 
                                                opacity-0 translate-y-2 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all duration-200
                                                shadow-2xl backdrop-blur-xl border
                                                ${theme === 'dark' 
                                                    ? 'bg-slate-900/95 text-slate-200 border-slate-700' 
                                                    : 'bg-white/95 text-slate-700 border-slate-200'}
                                            `}>
                                                <p className="font-semibold mb-1 border-b border-dashed border-opacity-30 pb-1">
                                                    {skill.importance} Priority
                                                </p>
                                                {importanceDefinitions[skill.importance]}
                                                {/* Arrow */}
                                                <div className={`absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent ${theme === 'dark' ? 'border-t-slate-900/95' : 'border-t-white/95'}`}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`flex items-center gap-4 text-xs ${textMuted}`}>
                                        <span>Req: <span className="text-indigo-400 font-mono font-bold">{skill.requiredLevel}/5</span></span>
                                        <span>Obs: <span className="text-emerald-400 font-mono font-bold">{skill.observedLevel}/5</span></span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <div className={`hidden sm:block w-32 h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${skill.gap > 0 ? 'bg-red-400' : 'bg-emerald-400'}`} 
                                            style={{ width: `${Math.min((skill.observedLevel / skill.requiredLevel) * 100, 100)}%` }}
                                        />
                                    </div>
                                    <ChevronRight className={`w-5 h-5 transition-transform ${activeSkill?.name === skill.name ? 'rotate-90 text-indigo-400' : 'text-slate-400'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                    )}
                </div>
            </div>

            {/* Detail Panel */}
            {activeSkill && (
                <div className={`rounded-2xl p-6 glass-panel border animate-fade-in ${glassCard}`} style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className={`text-xl font-bold ${headingColor}`}>{activeSkill.name}</h3>
                            <span className={`text-sm ${textMuted}`}>{activeSkill.category}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-lg text-sm font-bold border ${activeSkill.gap > 0 ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
                            {activeSkill.gap > 0 ? `Gap Level: ${activeSkill.gap}` : 'Match / Exceeds'}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-sm font-semibold text-indigo-400 mb-2 flex items-center gap-2">
                                <BrainCircuit className="w-4 h-4" /> AI Reasoning
                            </h4>
                            <p className={`text-sm leading-relaxed p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700/50 text-slate-300' : 'bg-white/50 border-slate-200 text-slate-700'}`}>
                                {activeSkill.reasoning}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" /> Evidence Found
                            </h4>
                            <p className={`text-sm leading-relaxed p-4 rounded-xl border italic ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700/50 text-slate-300' : 'bg-white/50 border-slate-200 text-slate-700'}`}>
                                "{activeSkill.evidence}"
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>

        {/* Learning Pathway - Enhanced Timeline View */}
      <div className={`rounded-2xl p-6 glass-panel border animate-fade-in ${glassCard}`} style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between mb-8">
              <h3 className={`text-lg font-semibold flex items-center gap-2 ${headingColor}`}>
                <ArrowRight className="w-5 h-5 text-indigo-400" /> Personalized Upskilling Pathway
              </h3>
              <div className="text-sm font-medium text-slate-500">
                  {completedActions.size} / {filteredPathway.length} Completed
              </div>
          </div>
          
          <div className="relative space-y-8 pl-2">
             {/* Vertical Timeline Line */}
             <div className={`absolute left-6 top-4 bottom-8 w-0.5 rounded-full ${theme === 'dark' ? 'bg-slate-800' : 'bg-indigo-100'}`}></div>

            {filteredPathway.length === 0 ? (
                 <div className="pl-16 opacity-50 italic">No learning steps match your search.</div>
            ) : (
                filteredPathway.map((item, idx) => {
                    const isCompleted = completedActions.has(item.action);
                    const isHighPriority = item.priority === 'High';

                    return (
                        <div key={idx} className="relative pl-16 group">
                            
                            {/* Timeline Node with Icon */}
                            <div className={`absolute left-2 top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-transform duration-300 group-hover:scale-110 ${getPriorityColor(item.priority, isCompleted)}`}>
                                 {getPriorityIcon(item.priority, isCompleted)}
                            </div>
                            
                            {/* Content Card */}
                            <div className={`p-5 rounded-2xl border transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-lg ${glassCard} ${glassCardHover} ${isCompleted ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                                
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                        <div className="space-y-1">
                                            <h4 className={`font-bold text-lg ${headingColor} ${isCompleted ? 'line-through decoration-2 decoration-emerald-500/50' : ''}`}>{item.action}</h4>
                                            
                                            {/* High Priority Progress Bar / Indicator */}
                                            {isHighPriority && !isCompleted && (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">High Priority</span>
                                                    <div className="h-1.5 w-24 bg-red-500/20 rounded-full overflow-hidden">
                                                        <div className="h-full bg-red-500 w-full animate-pulse rounded-full opacity-60"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className={`self-start flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border whitespace-nowrap ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-indigo-100 text-indigo-600'}`}>
                                            <Calendar className="w-3 h-3" />
                                            {item.timeline}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className={textMuted}>Priority:</span> 
                                            <span className={`font-medium ${
                                                item.priority === 'High' ? 'text-red-400' : 
                                                item.priority === 'Medium' ? 'text-amber-400' : 
                                                'text-emerald-400'
                                            }`}>{item.priority}</span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {item.resource && (
                                                <a href={item.resource} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-500 hover:text-indigo-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-500/10">
                                                    <BookOpen className="w-4 h-4"/> Resource
                                                </a>
                                            )}
                                            
                                            <button 
                                                onClick={() => toggleActionComplete(item.action)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border
                                                    ${isCompleted 
                                                        ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/30' 
                                                        : theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                                                    }
                                                `}
                                            >
                                                {isCompleted ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border-2 border-current" />}
                                                {isCompleted ? 'Completed' : 'Mark Complete'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
          </div>
      </div>
    </div>
  );
};