const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const { processRecordsWithAI } = require("../services/aiService");

const router = express.Router();

const os = require("os");

// Setup Multer for file uploads (using OS temp directory for Vercel support)
const upload = multer({ dest: os.tmpdir() });

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const results = [];
  const filePath = req.file.path;

  // Read and parse the CSV
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      // Clean up uploaded file
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting temp file:", err);
      });

      try {
        // Send data to AI for processing
        const processedData = await processRecordsWithAI(results);
        res.json({
          success: true,
          total_imported: processedData.imported.length,
          total_skipped: processedData.skipped.length,
          imported: processedData.imported,
          skipped: processedData.skipped,
        });
      } catch (error) {
        console.error("AI Processing Error:", error);
        res.status(500).json({ error: "Failed to process data with AI", details: error.message });
      }
    })
    .on("error", (error) => {
      console.error("CSV Parse Error:", error);
      res.status(500).json({ error: "Failed to parse CSV file" });
    });
});

module.exports = router;
