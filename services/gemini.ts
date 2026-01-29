import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

// Define the structured output schema
const skillSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Name of the skill" },
    category: { type: Type.STRING, description: "Technical, Soft Skill, Domain, etc." },
    importance: { type: Type.STRING, enum: ["Critical", "High", "Medium", "Low"] },
    requiredLevel: { type: Type.NUMBER, description: "1-5 scale required by JD" },
    observedLevel: { type: Type.NUMBER, description: "1-5 scale observed in candidate" },
    gap: { type: Type.NUMBER, description: "Calculated gap (required - observed)" },
    reasoning: { type: Type.STRING, description: "Why this score was given" },
    evidence: { type: Type.STRING, description: "Quote from resume or 'Not found'" },
  },
  required: ["name", "category", "importance", "requiredLevel", "observedLevel", "gap", "reasoning", "evidence"],
};

const learningActionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    action: { type: Type.STRING, description: "Specific action to take" },
    priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
    timeline: { type: Type.STRING, description: "Estimated time to complete" },
    resource: { type: Type.STRING, description: "Suggested resource or URL" },
  },
  required: ["action", "priority", "timeline", "resource"],
};

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    matchScore: { type: Type.NUMBER, description: "Overall match percentage (0-100)" },
    executiveSummary: { type: Type.STRING, description: "High-level summary of the fit" },
    skills: { type: Type.ARRAY, items: skillSchema },
    learningPathway: { type: Type.ARRAY, items: learningActionSchema },
  },
  required: ["matchScore", "executiveSummary", "skills", "learningPathway"],
};

export const analyzeGap = async (
  jdText: string,
  resumeData: { content: string; mimeType: string; isBase64: boolean }
): Promise<AnalysisResult> => {
  // Support Vite environment variables (VITE_API_KEY) and standard process.env
  // @ts-ignore - import.meta is available in Vite environment
  const apiKey = import.meta.env.VITE_API_KEY || process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key not found. Please set VITE_API_KEY in your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are an expert Talent Intelligence System performing a Semantic Gap Analysis.
    Your goal is to compare a Job Description (JD) against a Candidate Profile to identify skill gaps, implicit requirements, and upskilling needs.
    
    Rules:
    1. Infer implicit skills (e.g., "Microservices" implies "Distributed Systems").
    2. Rate competencies on a strict 1-5 scale (1=Novice, 5=Expert).
    3. Be critical. Do not hallucinate skills not present or implied in the resume.
    4. Provide specific, actionable learning pathways.
    5. Calculate the Gap as (Required Level - Observed Level). If Observed > Required, Gap is 0.
  `;

  // Prepare contents
  const parts: any[] = [{ text: `Job Description:\n${jdText}` }];

  if (resumeData.isBase64) {
    parts.push({
      inlineData: {
        data: resumeData.content,
        mimeType: resumeData.mimeType,
      },
    });
    parts.push({ text: "\n\nCandidate Profile (see attached document above)." });
  } else {
    parts.push({ text: `\n\nCandidate Profile:\n${resumeData.content}` });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", 
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        thinkingConfig: { thinkingBudget: 2048 }, // Enable thinking for deeper reasoning
      },
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(response.text) as AnalysisResult;
    return result;
  } catch (error) {
    console.error("AI Analysis Failed:", error);
    throw error;
  }
};