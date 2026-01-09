# Healthcare Imaging / Report Explainer

An AI-powered healthcare web application that allows patients and clinicians to upload medical reports and receive clear explanations.

## Features

- 🏥 **Animated Landing Page** - Hospital/lab environment animation
- 🔐 **User Authentication** - Login/Signup with role selection (Patient/Clinician)
- 📤 **Multi-format Upload** - Support for PDF, CSV, XML, JPG, PNG
- 🔬 **OCR Processing** - Text extraction from images using Tesseract.js
- 🤖 **AI-Powered Analysis** - Intelligent medical report interpretation
- 📊 **Dual Explanations** - Short summary and detailed explanation
- 👥 **Two Modes** - Patient (simple language) and Clinician (technical)
- 🌐 **Multilingual** - English, Tamil, Hindi support
- 💬 **AI Chatbot** - Context-aware Q&A about uploaded reports
- ⚠️ **Medical Disclaimers** - Clear safety messaging throughout

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: SQLite (better-sqlite3)
- **OCR**: Tesseract.js
- **PDF Parsing**: pdf-parse
- **File Upload**: Multer

## Installation

```bash
# Install dependencies
npm install

# Start the server
npm start

# For development with auto-reload
npm run dev
```

## Environment Variables

Create a `.env` file:

```
PORT=3000
SESSION_SECRET=your-secret-key
GEMINI_API_KEY=your-api-key (optional)
```

## Supported Report Types

- X-Ray
- MRI
- CT Scan
- Blood/Lab Tests
- Handwritten Reports

## Supported File Formats

- PDF Documents
- CSV Spreadsheets
- XML Files
- JPG/JPEG Images
- PNG Images

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/language` - Update language preference

### Upload
- `POST /api/upload` - Upload medical report
- `GET /api/upload/reports` - Get user's reports
- `GET /api/upload/reports/:id` - Get single report
- `DELETE /api/upload/reports/:id` - Delete report

### Analysis
- `POST /api/analysis/analyze/:reportId` - Analyze uploaded report
- `GET /api/analysis/results/:reportId` - Get analysis results

### Chat
- `POST /api/chat/:reportId` - Send message to AI
- `GET /api/chat/history/:reportId` - Get chat history

## Medical Disclaimer

⚠️ This application is for educational purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical decisions.

## License

MIT License
