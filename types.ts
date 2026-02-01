export interface Skill {
  name: string;
  category: string;
  importance: 'Critical' | 'High' | 'Medium' | 'Low';
  requiredLevel: number; // 1-5
  observedLevel: number; // 1-5
  gap: number;
  reasoning: string;
  evidence: string;
}

export interface LearningAction {
  action: string;
  priority: 'High' | 'Medium' | 'Low';
  timeline: string;
  resource: string;
}

export interface AnalysisResult {
  matchScore: number;
  executiveSummary: string;
  skills: Skill[];
  learningPathway: LearningAction[];
  modelUsed?: string;
}

export type Theme = 'dark' | 'light';

export type Persona = 'candidate' | 'recruiter';

export interface FileInput {
  name: string;
  content: string | ArrayBuffer;
  type: 'text' | 'pdf' | 'docx';
  mimeType: string;
}