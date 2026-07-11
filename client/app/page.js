"use client";

import { useState } from "react";
import Papa from "papaparse";
import { 
  LayoutDashboard, 
  Users, 
  Database, 
  MessageSquare, 
  UserCircle, 
  Settings, 
  Smartphone,
  PhoneCall,
  Link,
  Briefcase
} from "lucide-react";
import CsvUploader from "../components/CsvUploader";
import PreviewTable from "../components/PreviewTable";
import ResultTable from "../components/ResultTable";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState({ headers: [], rows: [] });
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        if (results.data && results.data.length > 0) {
          setPreviewData({
            headers: Object.keys(results.data[0]),
            rows: results.data,
          });
        } else {
          setPreviewData({ headers: [], rows: [] });
        }
      },
      error: function (error) {
        alert("Error parsing CSV: " + error.message);
      }
    });
  };

  const handleConfirmImport = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://groweasy-kappa-seven.vercel.app/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert("Failed to upload and process CSV: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const resetFlow = () => {
    setFile(null);
    setPreviewData({ headers: [], rows: [] });
    setResult(null);
    setIsModalOpen(false);
  };

  const SidebarItem = ({ icon: Icon, label, active }) => (
    <div className={`sidebar-item ${active ? "active" : ""}`}>
      <Icon size={18} />
      <span>{label}</span>
    </div>
  );

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="var(--primary)"/>
            <path d="M2 17L12 22L22 17" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          GrowEasy
        </div>
        
        <div style={{ padding: "0.5rem", display: "flex", alignItems: "center", gap: "0.75rem", background: "var(--bg-main)", borderRadius: "0.5rem" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "4px", backgroundColor: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold" }}>
            VK
          </div>
          <div style={{ fontSize: "0.875rem" }}>
            <div style={{ fontWeight: "600" }}>VK Test</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>OWNER</div>
          </div>
        </div>

        <div className="sidebar-nav">
          <div className="sidebar-section-title">Main</div>
          <SidebarItem icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem icon={Users} label="Generate Leads" />
          <SidebarItem icon={Database} label="Manage Leads" />
          <SidebarItem icon={MessageSquare} label="Engage Leads" />
        </div>

        <div className="sidebar-nav">
          <div className="sidebar-section-title">Control Center</div>
          <SidebarItem icon={UserCircle} label="Team Members" />
          <SidebarItem icon={Link} label="Lead Sources" active={true} />
          <SidebarItem icon={LayoutDashboard} label="Ad Accounts" />
          <SidebarItem icon={Smartphone} label="WhatsApp Account" />
          <SidebarItem icon={PhoneCall} label="Tele Calling" />
          <SidebarItem icon={Database} label="CRM Fields" />
          <SidebarItem icon={Settings} label="API Center" />
        </div>

        <div style={{ marginTop: "auto" }}>
          <SidebarItem icon={Briefcase} label="Business Center" />
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Lead Sources</h1>
        <p className="subtitle">Connect, manage, and control all your lead channels from one dashboard.</p>
        
        <div style={{ 
          backgroundColor: "var(--bg-card)", 
          border: `1px dashed var(--border-color)`,
          borderRadius: "0.75rem",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          maxWidth: "400px"
        }}>
          <div style={{ 
            width: "48px", 
            height: "48px", 
            borderRadius: "50%", 
            backgroundColor: "rgba(249, 115, 22, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--primary)"
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontWeight: "600", marginBottom: "0.25rem" }}>Import Leads via CSV</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
              Upload a CSV file to bulk import leads into your system.
            </p>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              Upload CSV
            </button>
          </div>
        </div>
      </div>

      {/* Modal Flow */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{result ? "Import Results" : file ? "Preview & Confirm" : "Import Leads via CSV"}</h2>
              <button 
                onClick={resetFlow}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              {isUploading ? (
                <div className="loading-container">
                  <div className="spinner">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="2" x2="12" y2="6"/>
                      <line x1="12" y1="18" x2="12" y2="22"/>
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                      <line x1="2" y1="12" x2="6" y2="12"/>
                      <line x1="18" y1="12" x2="22" y2="12"/>
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                    </svg>
                  </div>
                  <h3>Processing your data...</h3>
                  <p>Our AI is analyzing and mapping the CRM fields.</p>
                </div>
              ) : result ? (
                <ResultTable imported={result.imported} skipped={result.skipped} />
              ) : file ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", height: "100%" }}>
                  <div style={{ backgroundColor: "rgba(249,115,22,0.05)", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid rgba(249,115,22,0.2)", display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                    <div style={{ backgroundColor: "var(--bg-card)", padding: "0.75rem", borderRadius: "50%", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                       <Database size={24} color="var(--primary)" />
                    </div>
                    <div>
                      <h4 style={{ fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.25rem", fontSize: "1.1rem" }}>
                        {file.name}
                      </h4>
                      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                        We detected <strong style={{color: "var(--text-primary)"}}>{previewData.headers.length}</strong> columns and <strong style={{color: "var(--text-primary)"}}>{previewData.rows.length}</strong> rows. 
                        Review the raw data below. When you're ready, click "Process with AI" and our system will intelligently map these custom columns to the correct CRM fields.
                      </p>
                    </div>
                  </div>
                  <div style={{ flex: 1, minHeight: 0 }}>
                    <PreviewTable data={previewData.rows} headers={previewData.headers} />
                  </div>
                </div>
              ) : (
                <CsvUploader onFileSelect={handleFileSelect} />
              )}
            </div>
            
            {!result && !isUploading && (
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={resetFlow}>
                  Cancel
                </button>
                {file && (
                  <button className="btn btn-primary" onClick={handleConfirmImport} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "linear-gradient(135deg, var(--primary) 0%, #fb923c 100%)", border: "none", boxShadow: "0 4px 12px rgba(249, 115, 22, 0.25)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                    Process with AI
                  </button>
                )}
              </div>
            )}
            
            {result && (
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={resetFlow}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
