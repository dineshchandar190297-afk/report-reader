# 🏥 AI Medical Report Reader & Explainer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![AI Engine](https://img.shields.io/badge/AI-Google%20Gemini-blue)](https://deepmind.google/technologies/gemini/)

A premium, production-ready healthcare web application designed to bridge the gap between medical jargon and patient understanding. Using advanced OCR and Generative AI, this platform transforms complex medical reports (X-rays, MRIs, Blood Tests) into clear, actionable insights in multiple languages.

---

## 🌟 Key Features

### 🔬 Intelligent Analysis
- **Advanced OCR**: Extracts text from images (JPG, PNG) using Tesseract.js and parses PDF/XML/CSV documents.
- **Dual Perspective AI**: Generates two distinct explanations:
    - **Patient Mode**: Simplified, jargon-free language focused on "What does this mean for me?".
    - **Clinician Mode**: Technical, structured analysis featuring medical terminology for professional review.
- **Contextual Chatbot**: A persistent AI assistant that "remembers" your report and answers follow-up questions.

### 🌎 Accessibility & UI
- **Multilingual Support**: Fully localized in **English, Tamil, and Hindi**.
- **Cinematic Experience**: A high-end, animated entrance sequence that builds trust and sets a professional tone.
- **Role-Based Dashboards**: Tailored experiences for Patients and Clinicians with strict access control.

### 🛡️ Security & Ethics
- **Privacy First**: Secure authentication and role-based data isolation.
- **Clear Disclaimers**: Integrated medical safety warnings throughout the user journey.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Vanilla JS, CSS3 (Custom Design System), HTML5 |
| **Backend** | Node.js, Express.js |
| **AI/ML** | Google Gemini Pro (Analysis), Tesseract.js (OCR) |
| **Database** | SQLite (Persistent Storage) |
| **Session** | Express Session with secure cookie handling |

---

## 📂 Project Structure

```text
ai-medical-report-reader/
├── database/           # SQLite schema and initialization
├── public/             # Frontend assets (HTML, CSS, JS, Images)
│   ├── css/            # Modular stylesheets (animations, components, UI)
│   ├── js/             # Core logic (auth, dashboard, analysis, chat)
│   └── assets/         # UI icons and multimedia
├── routes/             # Express API endpoints
│   ├── auth.js         # Authentication & Language settings
│   ├── upload.js       # File handling (Multer) & Storage
│   ├── analysis.js     # AI processing & OCR integration
│   └── chat.js         # Contextual AI conversation
├── uploads/            # Temporary file storage (Persistent Local)
├── server.js           # Express application entry point
└── .env                # Sensitive credentials (API Keys)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- [Google AI Studio API Key](https://aistudio.google.com/app/apikey)

### Local Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/dineshchandar190297-afk/report-reader.git
   cd report-reader
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   SESSION_SECRET=your_secret_key_here
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Launch the application**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` to start.

---

## ☁️ Deployment Guide

For a detailed walkthrough on deploying to **Render** with persistent storage (to keep your database and uploads safe), please refer to our [Deployment Documentation](./docs/DEPLOYMENT.md).

---

## ⚠️ Medical Disclaimer

This application is powered by Artificial Intelligence and is intended **for educational and informational purposes only**. It does not provide medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this application.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ for a Healthier World.**
