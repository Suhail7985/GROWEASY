require("dotenv").config();
const express = require("express");
const cors = require("cors");
const uploadRoute = require("./routes/upload");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/upload", uploadRoute);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is healthy" });
});

const http = require("http");
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Required for Vercel deployment
module.exports = app;
