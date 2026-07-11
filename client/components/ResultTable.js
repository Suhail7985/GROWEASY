"use client";

import { useState } from "react";

export default function ResultTable({ imported, skipped }) {
  const [activeTab, setActiveTab] = useState("imported");

  const renderImported = () => {
    if (imported.length === 0) return <p style={{ padding: "1rem" }}>No records were imported.</p>;
    
    return (
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Date Created</th>
              <th>Company</th>
              <th>Status</th>
              <th>Lead Owner</th>
            </tr>
          </thead>
          <tbody>
            {imported.map((row, i) => (
              <tr key={i}>
                <td>{row.name || "—"}</td>
                <td>{row.email || "—"}</td>
                <td>
                  {row.mobile_without_country_code 
                    ? `${row.country_code || ""} ${row.mobile_without_country_code}`
                    : "—"}
                </td>
                <td>
                  {row.created_at ? new Date(row.created_at).toLocaleString() : "—"}
                </td>
                <td>{row.company || "—"}</td>
                <td>
                  {row.crm_status ? (
                    <span className={`badge ${
                      row.crm_status.includes("GOOD") || row.crm_status.includes("SALE") 
                        ? "success" 
                        : "error"
                    }`}>
                      {row.crm_status.replace(/_/g, " ")}
                    </span>
                  ) : "—"}
                </td>
                <td>{row.lead_owner || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderSkipped = () => {
    if (skipped.length === 0) return <p style={{ padding: "1rem" }}>No records were skipped.</p>;
    
    return (
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Raw Data (JSON)</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {skipped.map((row, i) => (
              <tr key={i}>
                <td style={{ whiteSpace: "pre-wrap", maxWidth: "400px" }}>
                  {JSON.stringify(row, null, 2)}
                </td>
                <td>Missing email and mobile number</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", borderBottom: "1px solid var(--border-color)" }}>
        <button 
          onClick={() => setActiveTab("imported")}
          style={{ 
            background: "none", 
            border: "none", 
            padding: "0.5rem 1rem", 
            cursor: "pointer",
            borderBottom: activeTab === "imported" ? "2px solid var(--primary)" : "2px solid transparent",
            color: activeTab === "imported" ? "var(--primary)" : "var(--text-secondary)",
            fontWeight: "600"
          }}
        >
          Imported ({imported.length})
        </button>
        <button 
          onClick={() => setActiveTab("skipped")}
          style={{ 
            background: "none", 
            border: "none", 
            padding: "0.5rem 1rem", 
            cursor: "pointer",
            borderBottom: activeTab === "skipped" ? "2px solid var(--danger)" : "2px solid transparent",
            color: activeTab === "skipped" ? "var(--danger)" : "var(--text-secondary)",
            fontWeight: "600"
          }}
        >
          Skipped ({skipped.length})
        </button>
      </div>
      
      {activeTab === "imported" ? renderImported() : renderSkipped()}
    </div>
  );
}
