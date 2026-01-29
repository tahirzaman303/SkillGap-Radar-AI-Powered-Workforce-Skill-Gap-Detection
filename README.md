# SkillGap Radar 🎯

**Enterprise-Grade AI Talent Intelligence System**

SkillGap Radar is a sophisticated web application designed to perform semantic gap analysis between Job Descriptions (JDs) and Candidate Profiles (Resumes). Unlike traditional keyword-matching ATS systems, SkillGap Radar utilizes the reasoning capabilities of **Google's Gemini 3 Pro** model to understand context, infer implicit skills, and generate personalized upskilling pathways.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Gemini](https://img.shields.io/badge/AI-Gemini%203%20Pro-orange)

## 🚀 Key Features

*   **Semantic Analysis:** Goes beyond keywords to understand the depth of experience and implicit requirements (e.g., inferring "Distributed Systems" knowledge from "Microservices" experience).
*   **AI-Powered Reasoning:** Uses the `gemini-3-pro-preview` model with **Thinking Config** to perform deep logical deduction before scoring.
*   **Multi-Format Resume Support:** Accepts PDF, DOCX, and TXT files.
*   **Visual Gap Analysis:** Interactive Radar Charts and Skill Matrices to visualize strengths and weaknesses.
*   **Personalized Learning Pathways:** Generates actionable, prioritized learning steps with estimated timelines and resources to bridge identified gaps.
*   **PDF Export:** Download professional analysis reports for HR or candidate review.

## 🛠️ Tech Stack

*   **Frontend Framework:** React 18 (TypeScript)
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS (via CDN/Utility classes)
*   **AI Integration:** Google GenAI SDK (`@google/genai`)
*   **Visualization:** Recharts
*   **File Processing:** `mammoth` (DOCX), `jspdf` (PDF Generation)
*   **Icons:** Lucide React

## 📦 Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn
*   A valid **Google Gemini API Key** (Paid tier recommended for Veo/Thinking models, though free tier works for basic testing if available).

