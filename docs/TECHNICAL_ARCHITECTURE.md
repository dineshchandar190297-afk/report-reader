# 🏗️ Technical Architecture

This document outlines the internal workings of the AI Medical Report Reader, explaining how data flows from a user's file upload to an AI-generated explanation.

---

## 🛠️ System Overview

The application follows a **Modular Monolith** architecture:
1.  **Frontend**: A SPA (Single Page Application) built with Vanilla JS and CSS3.
2.  **API Layer**: Express.js handling routing, authentication, and file processing.
3.  **Engine Layer**: Integration with Tesseract.js (OCR) and Google Gemini (LLM).
4.  **Data Layer**: SQLite for structured data and local disk for unstructured files (reports).

---

## 🔄 The Analysis Pipeline

When a user uploads a medical report, the following sequence occurs:

1.  **Ingestion**: `Multer` receives the file and saves it to the `uploads/` directory with a unique UUID.
2.  **Processing**:
    - **Images (X-ray/MRI/Scans)**: The file is passed to `Tesseract.js` to extract text using the `eng.traineddata` model.
    - **PDFs**: Text is extracted using `pdf-parse`.
    - **Data Files (CSV/XML)**: Parsed into strings.
3.  **AI Analysis**:
    - The system constructs a complex prompt including the extracted text, user role, and preferred language.
    - This prompt is sent to `gemini-pro`.
    - Gemini returns a structured JSON containing a **Short Summary** and a **Detailed Explanation**.
4.  **Storage**: The results are saved to the `reports` table in SQLite.
5.  **Delivery**: The frontend polls the API or receives a response to display the visual cards.

---

## 💬 Contextual Chat Engine

The chat functionality works by:
- Retrieving the specific `extracted_text` of the report the user is currently viewing.
- Injecting the conversation history from the `chat_messages` table into the AI prompt.
- This creates a "Report-Aware" chatbot that can answer specific questions like *"What does my LDH level indicate in this specific test?"*.

---

## 🔒 Security Measures

- **Password Hashing**: Done via `bcryptjs`.
- **Session Management**: `express-session` handles user states without exposing IDs in the client-side JavaScript.
- **Role Isolation**: Middleware ensures that patients cannot access clinician-only data and vice versa.
- **Input Sanitization**: All uploaded file paths and database queries are sanitized to prevent Path Traversal and SQL Injection.

---

## 🌐 Multilingual Engine

Localization is handled via `public/js/translations.js`.
- The UI language is controlled by a `preferred_language` field in the User record.
- The AI is instructed via the system prompt to respond in the selected language (English, Tamil, or Hindi).
