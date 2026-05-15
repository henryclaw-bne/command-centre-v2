"use client";

import { useState, type ChangeEvent, type DragEvent } from "react";
import { uploadCsv, UploadResponse } from "../../lib/api";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStatus(null);
    setResult(null);
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setStatus(null);
    setResult(null);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please choose a CSV file first.");
      return;
    }

    setLoading(true);
    setStatus(null);
    setResult(null);

    try {
      const uploadResult = await uploadCsv(file);
      setResult(uploadResult);
      setStatus("Upload successful.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ marginBottom: "2rem" }}>
      <h2>Upload HaloPSA CSV</h2>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: "2px dashed #999",
          padding: "2rem",
          borderRadius: "8px",
          background: "#fff",
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        <p>Drag and drop your CSV file here, or use the picker below.</p>
        <input type="file" accept=".csv,text/csv" onChange={handleFileChange} />
        {file && <p>Selected file: {file.name}</p>}
      </div>
      <button onClick={handleUpload} disabled={loading} style={{ padding: "0.75rem 1.25rem", borderRadius: "6px", border: "none", background: "#111", color: "white", cursor: "pointer" }}>
        {loading ? "Uploading..." : "Upload CSV"}
      </button>
      {status && <p style={{ marginTop: "1rem" }}>{status}</p>}
      {result && (
        <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px", background: "#f8f8f8" }}>
          <p><strong>File:</strong> {result.uploaded_filename}</p>
          <p><strong>Rows processed:</strong> {result.rows_processed}</p>
          <p><strong>Rows imported:</strong> {result.rows_imported}</p>
          <p><strong>Rows skipped:</strong> {result.rows_skipped}</p>
          <p><strong>Missing fields:</strong> {result.missing_fields_count}</p>
          <p><strong>Invalid rows:</strong> {result.invalid_rows}</p>
          {result.errors && (
            <details style={{ marginTop: "0.75rem" }}>
              <summary>Errors</summary>
              <pre style={{ whiteSpace: "pre-wrap", marginTop: "0.5rem" }}>{result.errors}</pre>
            </details>
          )}
        </div>
      )}
    </section>
  );
}
