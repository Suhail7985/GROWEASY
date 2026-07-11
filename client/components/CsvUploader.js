"use client";

import { useState, useRef } from "react";
import { UploadCloud } from "lucide-react";

export default function CsvUploader({ onFileSelect }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSelect(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndSelect(file);
    }
  };

  const validateAndSelect = (file) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      alert("Please upload a valid CSV file.");
      return;
    }
    onFileSelect(file);
  };

  return (
    <div 
      className={`dropzone ${isDragging ? "active" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current.click()}
    >
      <input 
        type="file" 
        accept=".csv" 
        style={{ display: "none" }} 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1 }}>
        <div className="dropzone-icon-container">
          <UploadCloud size={40} className="dropzone-icon" />
        </div>
        <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
          Upload your CSV data
        </h3>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "1rem" }}>
          Drag and drop your file here, or click to browse
        </p>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", justifyContent: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
          <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem", borderRadius: "1rem", backgroundColor: "var(--bg-main)", color: "var(--text-secondary)", border: "1px solid var(--border-color)", fontWeight: "500" }}>
            Google Ads
          </span>
          <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem", borderRadius: "1rem", backgroundColor: "var(--bg-main)", color: "var(--text-secondary)", border: "1px solid var(--border-color)", fontWeight: "500" }}>
            Facebook
          </span>
          <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem", borderRadius: "1rem", backgroundColor: "var(--bg-main)", color: "var(--text-secondary)", border: "1px solid var(--border-color)", fontWeight: "500" }}>
            Real Estate CRM
          </span>
          <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem", borderRadius: "1rem", backgroundColor: "var(--bg-main)", color: "var(--text-secondary)", border: "1px solid var(--border-color)", fontWeight: "500" }}>
            Custom Exports
          </span>
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", padding: "0 2rem", lineHeight: "1.5", opacity: 0.8 }}>
          Our AI will automatically map your custom columns to our CRM schema.
        </p>
      </div>
    </div>
  );
}
