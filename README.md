# SkillGap Radar 🎯

**Enterprise-Grade AI Talent Intelligence System**

SkillGap Radar is a sophisticated web application designed to perform **Semantic Gap Analysis** between Job Descriptions (JDs) and Candidate Profiles (Resumes).

Unlike traditional ATS systems that rely on keyword matching, SkillGap Radar utilizes the advanced reasoning capabilities of **Google's Gemini 3 Flash** model. It understands context, infers implicit skills (e.g., knowing "Kubernetes" implies "Container Orchestration"), and utilizes **Chain-of-Thought (CoT)** reasoning to simulate a senior technical recruiter's evaluation process.

![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-purple?style=flat-square&logo=vite)
![Gemini](https://img.shields.io/badge/AI-Gemini%203%20Flash-orange?style=flat-square&logo=google)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-cyan?style=flat-square&logo=tailwindcss)

---

## 🚀 Key Features

### 🧠 Advanced AI Reasoning
*   **Dual Analysis Modes:**
    *   **Standard Speed:** Fast, efficient analysis for quick screening.
    *   **Thinking Mode (CoT):** Activates Gemini's "Thinking Config," allocating a specific token budget for deep reasoning before generating a score. This is ideal for complex engineering roles.
*   **Semantic Understanding:** Detects skill transferability and depth of experience, not just string matches.
*   **Strict JSON Output:** Enforces a rigid schema for consistent data parsing.

### 📊 Interactive Dashboard
*   **Competency Radar:** A visual spider graph comparing "Required" vs. "Observed" proficiency levels (1-5 scale).
*   **Skill Gap Matrix:** A searchable list of all skills with visual progress bars indicating the gap size.
*   **Deep Dive View:** Click any skill to see the AI's specific reasoning and the exact evidence (quotes) found in the resume.

### 🎓 Personalized Upskilling
*   **Actionable Pathways:** Generates a prioritized "To-Do" list for the candidate.
*   **Progress Tracking:** Interactive check-off system with visual indicators for "High Priority" items.
*   **Resource Linking:** Suggests specific documentation or courses.

### 🎨 Modern UX/UI
*   **Glassmorphism Design:** Beautiful, translucent UI elements with animated backgrounds.
*   **Dark/Light Mode:** Fully supported theming system.
*   **Multi-Format Support:** Drag-and-drop support for PDF, DOCX, and TXT resumes.
*   **PDF Export:** Download professional analysis reports for HR records or candidate feedback.

---

## 🛠️ Technical Architecture

### Tech Stack
*   **Frontend:** React 18, TypeScript, Vite.
*   **Styling:** Tailwind CSS, Lucide React (Icons).
*   **AI Integration:** `@google/genai` SDK using `gemini-3-flash-preview`.
*   **Visualization:** Recharts (Radar/Spider charts).
*   **File Processing:** `mammoth.js` (DOCX parsing), Native `FileReader` (Text/PDF).
*   **Reporting:** `jspdf` & `jspdf-autotable`.

### AI Workflow
1.  **Input:** The app accepts raw text (JD) and a file (Resume).
2.  **Prompt Engineering:** A system instruction acts as a "Senior Technical Recruiter," defining scoring criteria (1-5) and gap calculation logic.
3.  **Token Budget:** In "Thinking Mode," a budget of ~8k tokens is reserved for internal reasoning, improving the accuracy of complex skill evaluations.
4.  **Output:** Returns a structured JSON object containing an Executive Summary, Skill Array, and Learning Pathway.

---

## 📦 Installation & Setup

### 1. Prerequisites
*   Node.js (v18+)
*   A Google Cloud Project with the Gemini API enabled.

### 2. Clone and Install
```bash
git clone https://github.com/your-username/skillgap-radar.git
cd skillgap-radar
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add your API Key:

```env
VITE_API_KEY=your_gemini_api_key_here
```

> **Note:** The app uses `VITE_API_KEY` which is mapped to `process.env.API_KEY` in `vite.config.ts`.

### 4. Run Locally
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📖 Usage Guide

1.  **Input Phase:**
    *   Paste the **Job Description** into the left panel.
    *   Drag & Drop a **Resume** (PDF/DOCX) into the right panel.
    *   Select **"Standard"** or **"Thinking Mode"**.
2.  **Analysis:**
    *   Click "Generate Gap Analysis".
    *   Wait for the AI to process (Thinking mode takes slightly longer).
3.  **Review Results:**
    *   Read the **Executive Summary**.
    *   Check the **Radar Chart** for immediate visual fit.
    *   Scroll through the **Skill Matrix** to see specific missing skills.
    *   Review the **Learning Pathway** and mark items as complete as you learn.
4.  **Export:**
    *   Click "Export Report" to download a summary PDF.

---

## 🛡️ Privacy & Security
*   **Client-Side Processing:** Files are processed in the browser memory.
*   **No Persistence:** Resumes are sent directly to the Gemini API for analysis and are not stored in any external database.
*   **Local Storage:** Analysis results are temporarily saved in the browser's `localStorage` so you don't lose your report on refresh, but can be cleared via the "Reset" button.

---

## 📄 License
MIT License
