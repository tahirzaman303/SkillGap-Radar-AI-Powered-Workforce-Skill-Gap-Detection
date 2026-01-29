# SkillGap Radar — AI-Powered Talent Intelligence

## Application Overview & Working Concept

**SkillGap Radar** is an enterprise-grade AI Talent Intelligence system designed to perform deep semantic gap analysis between Job Descriptions (JDs) and Candidate Profiles. Unlike keyword-matching ATS systems, SkillGap Radar utilizes the advanced reasoning capabilities of the **Gemini 3 Pro** model to understand context, infer implicit skills, and generate actionable upskilling pathways.

### Key Features

1.  **Semantic Gap Analysis**: Compares required skills in a JD against observed skills in a resume, calculating specific gap levels (1-5 scale).
2.  **Implicit Skill Inference**: Detects skills that are implied but not explicitly stated (e.g., "Microservices architecture" implies "Distributed Systems").
3.  **Multi-Format Parsing**: Supports PDF (via Vision/Multimodal), DOCX (via raw text extraction), and TXT files.
4.  **Visual Analytics**: Presents data in an interactive Radar Chart and Skill Matrix for instant visual assessment.
5.  **Automated Learning Pathways**: Generates personalized, prioritized learning actions with resource links to bridge identified gaps.
6.  **PDF Reporting**: One-click export of a professional analysis report for HR or Candidate feedback.

### How It Works

1.  **Input**: The user pastes a Job Description and uploads a Candidate Resume.
2.  **Processing**: The system parses the documents and constructs a structured prompt for the Gemini 3 Pro model.
3.  **AI Reasoning**:
    *   The model analyzes the text to extract skills, categories, and importance levels.
    *   It rates the *Required Level* (from JD) and *Observed Level* (from Resume).
    *   It calculates the *Gap* and provides specific reasoning and evidence from the text.
4.  **Visualization**: The React frontend renders the structured JSON response into a Dashboard with Radar charts and detailed lists.
5.  **Action**: The user can review the "Learning Pathway" to see specific recommendations for closing skill gaps.

### Tech Stack

*   **Frontend**: React 18, TypeScript, Tailwind CSS
*   **AI Model**: Google Gemini 3 Pro (via `@google/genai`)
*   **Visualization**: Recharts
*   **Document Handling**: Mammoth (DOCX), Native File API
*   **Build Tool**: Vite

### Setup & Installation

1.  Clone the repository.
2.  Create a `.env` file in the root directory and add your API key:
    ```
    VITE_API_KEY=your_google_genai_api_key
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```
