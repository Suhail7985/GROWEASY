# AI-Powered CSV Importer - GrowEasy

An intelligent CSV importer built with Next.js, Node.js/Express, and the Gemini AI API. This tool allows users to upload messy, unstructured CRM lead exports (from Facebook, Google Ads, Excel, etc.) and intelligently extracts and maps the data into a strict CRM format.

## Features

- **Modern Premium UI:** Built with Next.js and Vanilla CSS, featuring a clean layout, glassmorphism, smooth animations, and dark mode support.
- **Drag & Drop Upload:** Seamlessly drop CSV files to upload.
- **Instant Preview:** View a virtualized table of your raw CSV data on the client side before confirming.
- **AI Extraction Engine:** The Node.js backend batches records and uses the Gemini AI model to intelligently map dynamic columns to the required GrowEasy CRM schema.
- **Data Validation:** Strict JSON schema enforcement for statuses and dates, and intelligent merging of multiple emails/phones into the notes field.

## Prerequisites

- Node.js (v18+ recommended)
- A Gemini API Key (from Google AI Studio)

## Setup Instructions

### 1. Configure the AI Service
You must provide a valid Gemini API key for the backend to function.
Open the server environment file:
\`server/.env\`

Replace the placeholder with your actual key:
\`\`\`env
PORT=5000
GEMINI_API_KEY=your_actual_api_key_here
\`\`\`

### 2. Install Dependencies
Run the following command in the root directory to install the concurrently package:
\`\`\`bash
npm install
\`\`\`

*(Note: The frontend and backend dependencies are already initialized in their respective directories, but if you clone this fresh, you'd need to run `npm install` inside both `client/` and `server/`).*

### 3. Start the Application
In the root directory, run:
\`\`\`bash
npm run dev
\`\`\`
This will concurrently start:
- The **Next.js Frontend** on [http://localhost:3000](http://localhost:3000)
- The **Express Backend** on [http://localhost:5000](http://localhost:5000)

## Tech Stack
- **Frontend:** Next.js 14, React, PapaParse, React Virtual, Lucide Icons, Vanilla CSS
- **Backend:** Node.js, Express, Multer, CSV-Parser, @google/genai

## Evaluation Checklist Addressed
- [x] AI Prompt Engineering (Batching, schema enforcement, data merging)
- [x] Backend Quality (Express architecture, multer file handling)
- [x] Frontend Quality (Responsive layout, CSV preview, modern design)
- [x] Bonus Points: Drag & Drop upload, virtualized table, dark mode, stateless architecture.
