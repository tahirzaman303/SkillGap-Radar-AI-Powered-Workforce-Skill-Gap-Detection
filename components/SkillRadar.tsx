import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { Skill, Theme } from '../types';

interface SkillRadarProps {
  skills: Skill[];
  theme: Theme;
}

export const SkillRadar: React.FC<SkillRadarProps> = ({ skills, theme }) => {
  // Filter top important skills to avoid cluttering the chart
  const chartData = skills
    .filter(s => s.importance === 'Critical' || s.importance === 'High')
    .slice(0, 7)
    .map(s => ({
      subject: s.name,
      Required: s.requiredLevel,
      Observed: s.observedLevel,
      fullMark: 5,
    }));

  // Theme-aware colors
  const gridColor = theme === 'dark' ? '#4b5563' : '#e2e8f0'; // slate-600 vs slate-200
  const textColor = theme === 'dark' ? '#9ca3af' : '#64748b'; // slate-400 vs slate-500
  const tooltipBg = theme === 'dark' ? '#1f2937' : '#ffffff';
  const tooltipBorder = theme === 'dark' ? '#374151' : '#e2e8f0';
  const tooltipText = theme === 'dark' ? '#f3f4f6' : '#1e293b';

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke={gridColor} />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: textColor, fontSize: 12, fontWeight: 500 }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 5]} 
            tick={false} 
            axisLine={false} 
          />
          
          <Radar
            name="Required Level"
            dataKey="Required"
            stroke="#818cf8" // Indigo-400
            strokeWidth={3}
            fill="#818cf8"
            fillOpacity={theme === 'dark' ? 0.3 : 0.2}
          />
          <Radar
            name="Observed Level"
            dataKey="Observed"
            stroke="#10b981" // Emerald-500
            strokeWidth={3}
            fill="#10b981"
            fillOpacity={theme === 'dark' ? 0.3 : 0.2}
          />
          
          <Tooltip 
            contentStyle={{ 
              backgroundColor: tooltipBg, 
              borderColor: tooltipBorder, 
              color: tooltipText,
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            itemStyle={{ color: tooltipText }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }}/>
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};