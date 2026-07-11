# 🚀 GrowEasy AI-Powered CSV Importer

An intelligent, full-stack CRM data ingestion tool built to effortlessly map messy, unstructured CSV exports (from Facebook Ads, Google Ads, custom spreadsheets, etc.) into a strict, standardized CRM schema using Google's Gemini AI.

---

## ✨ Features

- **Intelligent Data Mapping:** Uses `gemini-2.5-flash` with structured outputs to automatically map varying column headers and layouts to exact CRM fields.
- **Graceful Error Handling:** Automatically skips records missing critical information (e.g., both Email and Mobile Number missing) and provides clear reasoning.
- **Modern Premium UI:** Built with Next.js, featuring glassmorphism, micro-animations, drag-and-drop file uploads, and a highly polished UI.
- **Fast & Scalable:** Processes records in batches to ensure high accuracy while respecting API limits.

## 🛠 Tech Stack

**Frontend:**
- Next.js (React)
- Vanilla CSS (with modern aesthetic principles)
- PapaParse (for client-side CSV parsing)
- Lucide React (for iconography)

**Backend:**
- Node.js & Express
- `@google/genai` (Official Google Gemini SDK)
- Multer (File uploads, configured for Vercel serverless support)
- CSV-Parser

---

## 🏗 Architecture & Flow

1. **Upload:** User drops a CSV file into the frontend via a polished Drag & Drop interface.
2. **Preview:** The frontend uses `papaparse` to instantly preview the raw data in a native HTML table (capped at 100 rows for performance).
3. **Processing:** The CSV is sent via `FormData` to the Express backend.
4. **AI Extraction:** The Node.js server batches the rows (20 at a time) and sends them to Gemini 2.5 Flash using a strict `responseSchema`. The AI intelligently maps custom columns to our strict schema (handling edge cases like multiple phone numbers by storing overflows in the `crm_note` field).
5. **Results Display:** The backend returns structured JSON. The frontend renders a beautifully segmented tab view showing **Imported** records and **Skipped** records (with the exact raw JSON and rejection reasoning).

---

## 💻 Local Setup

### Prerequisites
- Node.js (v18+)
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Groweasy
   ```

2. **Install all dependencies:**
   *(We use a monorepo setup, so dependencies need to be installed in both folders)*
   ```bash
   # Install root dependencies (concurrently)
   npm install

   # Install frontend dependencies
   cd client && npm install

   # Install backend dependencies
   cd ../server && npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file inside the `server/` directory:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the Application:**
   From the root folder (`Groweasy`), run:
   ```bash
   npm run dev
   ```
   This will simultaneously start the Next.js frontend on `http://localhost:3000` and the Express backend on `http://localhost:5000`.

---

## ☁️ Deployment

This project is fully configured for cloud deployment:
- **Frontend (Vercel):** Connect your repository to Vercel and set the Root Directory to `client`.
- **Backend (Vercel/Render):** The Express backend is Vercel-ready. `multer` is configured to use the OS `/tmp` directory to comply with read-only serverless filesystems, and a `vercel.json` is included in the `server` folder. Be sure to add your `GEMINI_API_KEY` to the environment variables of your hosting provider!

---

*Designed and engineered for the GrowEasy technical assignment.*
