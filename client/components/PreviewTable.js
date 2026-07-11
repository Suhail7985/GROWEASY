"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

export default function PreviewTable({ data, headers }) {
  if (!data || data.length === 0) return <p>No data found.</p>;

  // Limit preview to 100 rows to keep the DOM light
  const previewData = data.slice(0, 100);

  return (
    <div className="table-container" style={{ maxHeight: "400px", overflow: "auto", position: "relative" }}>
      <table className="table" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "var(--bg-main)", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "1px solid var(--border-color)", fontWeight: "600", color: "var(--text-secondary)" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {previewData.map((row, rowIndex) => (
            <tr key={rowIndex} style={{ borderBottom: "1px solid var(--border-color)", transition: "background-color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(249,115,22,0.02)"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
              {headers.map((h, colIndex) => (
                <td key={colIndex} style={{ padding: "0.75rem 1rem", whiteSpace: "nowrap" }}>
                  {row[h] || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 100 && (
        <div style={{ textAlign: "center", padding: "1rem", color: "var(--text-secondary)", fontSize: "0.875rem", backgroundColor: "var(--bg-main)", borderTop: "1px solid var(--border-color)" }}>
          Showing 100 of {data.length} rows for preview.
        </div>
      )}
    </div>
  );
}
