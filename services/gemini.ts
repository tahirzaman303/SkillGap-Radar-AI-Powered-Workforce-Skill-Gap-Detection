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
    reasoning: { type: Type.STRING, description: "Detailed justification of the score, referencing specific evidence or lack thereof." },
    evidence: { type: Type.STRING, description: "Direct quote from resume or 'Not explicitly found' or 'Implied by [Skill X]'" },
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
    executiveSummary: { type: Type.STRING, description: "High-level summary of the fit, identifying key strengths and critical missing pieces." },
    skills: { type: Type.ARRAY, items: skillSchema },
    learningPathway: { type: Type.ARRAY, items: learningActionSchema },
  },
  required: ["matchScore", "executiveSummary", "skills", "learningPathway"],
};

export const analyzeGap = async (
  jdText: string,
  resumeData: { content: string; mimeType: string; isBase64: boolean },
  modelType: 'fast' | 'deep' = 'fast'
): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  
  // Explicit check for missing key to help debugging
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("API_KEY is missing. Check Vercel Environment Variables or your .env file.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Use gemini-3-flash-preview as it supports Thinking Config and is valid.
  // gemini-2.5-flash-latest was incorrect.
  const modelName = 'gemini-3-flash-preview';
  
  // Configuration for "Thinking"
  // For 'deep' mode, we allocate a budget for reasoning.
  const thinkingBudget = modelType === 'deep' ? 8192 : 0;
  
  // Ensure we have enough tokens for both thinking and the final JSON response
  // If thinking is enabled, we need a higher total limit.
  const maxOutputTokens = modelType === 'deep' ? 16384 : 8192;

  const systemInstruction = `
    You are an expert Talent Intelligence System acting as a Senior Technical Recruiter and Engineering Manager.
    Your goal is to perform a deep Semantic Gap Analysis between a Job Description (JD) and a Candidate Profile.

    CRITICAL REASONING INSTRUCTIONS:
    1.  **Analyze Context, Not Just Keywords:** Do not just look for string matches. If a candidate lists "Kubernetes" and "Docker", infer that they have "Containerization" skills even if the word "Containerization" is missing.
    2.  **Evaluate Depth:** Differentiate between "familiarity" (mentioned once) and "proficiency" (used in multiple projects/years).
    3.  **Detect Negative Evidence:** If a skill is "Critical" in the JD but completely absent in the resume, explicitly mark it as a gap and explain why it matters.
    4.  **Scoring Standard (1-5):**
        - 1: Novice/Theory only.
        - 2: Basic exposure/Junior level.
        - 3: Competent/Mid-level (Can work independently).
        - 4: Advanced/Senior (Can lead/architect).
        - 5: Expert/Principal (Industry leader/Deep specialization).
    5.  **Gap Calculation:** Gap = Required - Observed. (If Observed >= Required, Gap is 0).

    OUTPUT INSTRUCTIONS:
    - Provide a specific, actionable learning pathway for gaps.
    - Be strict but fair.
    - Return ONLY JSON matching the schema.
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
      model: modelName,
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        maxOutputTokens: maxOutputTokens,
        thinkingConfig: { thinkingBudget: thinkingBudget },
      },
    });

    if (!response.text) {
      throw new Error("Empty response from AI model");
    }

    const result = JSON.parse(response.text) as AnalysisResult;
    
    // Attach model metadata
    result.modelUsed = modelType === 'deep' ? 'Gemini 3 Flash (Thinking Mode)' : 'Gemini 3 Flash (Standard)';
    
    return result;
  } catch (error: any) {
    console.error("AI Analysis Failed:", error);
    // Provide a more helpful error message to the UI
    if (error.message?.includes('404') || error.message?.includes('not found')) {
      throw new Error(`Model ${modelName} not found. Please check API availability.`);
    }
    throw new Error(`AI Request Failed: ${error.message}`);
  }
};