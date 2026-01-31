# SkillGap Radar 🎯

**Enterprise-Grade AI Talent Intelligence System**

SkillGap Radar is a sophisticated web application designed to perform semantic gap analysis between Job Descriptions (JDs) and Candidate Profiles (Resumes). Unlike traditional keyword-matching ATS systems, SkillGap Radar utilizes the capabilities of **Google's Gemini 2.5 Flash** model to understand context, infer implicit skills, and generate personalized upskilling pathways.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-orange)

## 🚀 Key Features

*   **Semantic Analysis:** Goes beyond keywords to understand the depth of experience and implicit requirements (e.g., inferring "Distributed Systems" knowledge from "Microservices" experience).
*   **AI-Powered Reasoning:** Uses the fast and efficient `gemini-2.5-flash` model to analyze profiles.
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
*   A valid **Google Gemini API Key** (Free tier supported via Gemini 2.5 Flash).

## ⚡ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/skillgap-radar.git
cd skillgap-radar
```