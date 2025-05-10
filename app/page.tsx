"use client";

import * as React from "react";
import { useState } from "react";
import { parseDocuments } from "./actions/gemini";
import { isSuccess } from "./types/util";

export default function DocumentParser() {
  const [files, setFiles] = useState<File[]>([]);
  const [extractedData, setExtractedData] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => {
      // avoid duplicates by file name
      const existingNames = new Set(prev.map((f) => f.name));
      const filteredNew = newFiles.filter((f) => !existingNames.has(f.name));
      return [...prev, ...filteredNew];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsLoading(true);
    setError("");
    setExtractedData("");
    setProgress(`Uploading ${files.length} file${files.length > 1 ? "s" : ""}...`);

    const interval = setInterval(() => {
      setProgress((prev) => (prev.endsWith("...") ? prev.slice(0, -3) : prev + "."));
    }, 1000);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("image", file));
      formData.append("documentType", "document");

      const result = await parseDocuments(formData);
      clearInterval(interval);

      if (isSuccess(result)) {
        setExtractedData(result.value);
        setProgress("Extraction complete!");
      } else {
        setProgress("");
      }
    } catch (err) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : "Failed to parse document");
      setProgress("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="mb-6 text-3xl font-bold">Document Parser</h1>

      <form onSubmit={handleSubmit} className="mb-8 max-w-md">
        <div className="mb-4">
          <label htmlFor="documents" className="mb-2 block font-medium">
            Upload Document Pages
          </label>
          <input
            id="documents"
            type="file"
            accept="image/*,.pdf"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            required
          />
        </div>

        {files.length > 0 && (
          <div className="mb-4">
            <h2 className="font-semibold">Selected Files:</h2>
            <ul className="list-inside list-disc">
              {files.map((file) => (
                <li key={file.name}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isLoading ? "Processing..." : "Parse Document"}
        </button>
      </form>

      {progress && <div className="mb-4 rounded-md bg-blue-50 p-3 text-blue-700">{progress}</div>}

      {error && <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">{error}</div>}

      {extractedData && (
        <div className="mt-6">
          <h2 className="mb-3 text-xl font-bold">Extracted Data</h2>
          <div className="bg-black-50 rounded-md p-4">
            <pre className="whitespace-pre-wrap">{extractedData}</pre>
          </div>
        </div>
      )}
    </main>
  );
}
