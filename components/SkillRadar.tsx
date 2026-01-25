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
import { Skill } from '../types';

interface SkillRadarProps {
  skills: Skill[];
}

export const SkillRadar: React.FC<SkillRadarProps> = ({ skills }) => {
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

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#4b5563" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
          
          <Radar
            name="Required Level"
            dataKey="Required"
            stroke="#818cf8" // Indigo-400
            strokeWidth={2}
            fill="#818cf8"
            fillOpacity={0.3}
          />
          <Radar
            name="Observed Level"
            dataKey="Observed"
            stroke="#34d399" // Emerald-400
            strokeWidth={2}
            fill="#34d399"
            fillOpacity={0.3}
          />
          
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
            itemStyle={{ color: '#e5e7eb' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }}/>
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};