"use client";

import { parseDocument } from "@/app/actions/gemini";
import { useState } from "react";

export default function DocumentParser() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setError("");
    setProgress("Uploading file...");

    try {
      const formData = new FormData();
      formData.append("image", file);

      // Update progress as the file processes
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev.includes("...")) return prev.replace("...", "..");
          return prev + ".";
        });
      }, 1000);

      const result = await parseDocument(formData);

      clearInterval(interval);
      setExtractedData(result || "WAA");
      setProgress("Extraction complete!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse document");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Document Parser</h1>

      <form onSubmit={handleSubmit} className="mb-8 max-w-md">
        <div className="mb-4">
          <label htmlFor="document" className="block mb-2 font-medium">
            Upload Document
          </label>
          <input
            id="document"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isLoading ? "Processing..." : "Parse Document"}
        </button>
      </form>

      {progress && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md">
          {progress}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {extractedData && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-3">Extracted Data</h2>
          <div className="p-4 bg-gray-50 rounded-md">
            <pre className="whitespace-pre-wrap">{extractedData}</pre>
          </div>
        </div>
      )}
    </main>
  );
}
