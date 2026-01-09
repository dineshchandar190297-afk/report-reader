# 🚀 Deployment Guide (Render.com)

This guide provides a step-by-step walkthrough for deploying the AI Medical Report Reader to **Render**, ensuring that your data (SQLite database and uploaded reports) is preserved across restarts using **Persistent Disks**.

---

## 1. Prerequisites
- A GitHub repository with the project code.
- A [Render.com](https://render.com/) account.
- A Google Gemini API Key.

---

## 2. Create a New Web Service
1. Log in to Render and click **New +** > **Web Service**.
2. Connect your GitHub repository (`report-reader`).
3. Set the following basic configurations:
   - **Name**: `medical-report-reader`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

---

## 3. Configure Environment Variables
Navigate to the **Environment** tab in your Render dashboard and add the following:

| Key | Suggested Value/Source | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Optimizes Node for production. |
| `GEMINI_API_KEY` | *(Your Key)* | Your API key from Google AI Studio. |
| `SESSION_SECRET` | *(Random String)* | A secret key for session encryption. |
| `DATA_DIR` | `/var/lib/data` | Tells the app to use the persistent mount path. |

---

## 4. Set Up Persistent Disk (Crucial)
Standard hosting resets your file system on every deploy. To keep your database (`healthcare.db`) and user uploads safe:

1. Click on the **Disks** tab in the sidebar.
2. Click **Add Disk**.
3. **Name**: `reader-storage`
4. **Mount Path**: `/var/lib/data`
5. **Size**: `1GB` (The free tier limit is usually sufficient).

---

## 5. Finalize & Deploy
1. Click **Deploy Web Service**.
2. Once the build is complete, your app will be live at a URL like `https://medical-report-reader.onrender.com`.
3. Test by creating an account and uploading a report. Check the logs in the Render dashboard to ensure the AI analysis is triggering correctly.

---

## Troubleshooting
- **Port Issues**: Render automatically detects the port, but ensure `PORT` is not hardcoded to `3000` in your code (use `process.env.PORT || 3000`).
- **Disk Permissions**: The app automatically tries to create the `uploads` folder. If it fails, ensure the `DATA_DIR` env var matches the Disk Mount Path exactly.
