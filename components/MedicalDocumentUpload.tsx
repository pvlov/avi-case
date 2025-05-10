"use client";
import { useState } from "react";
import { processAndSaveMedicalDocument } from "@/services/medicalDocumentService";
import type { MedicalDocument } from "@/types/medical";

export default function MedicalDocumentUpload() {
  const [document, setDocument] = useState<MedicalDocument | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const result = await processAndSaveMedicalDocument(file);
      setDocument(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={loading}
        className="mb-4"
      />

      {loading && <p>Processing document...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {document && (
        <div className="mt-4">
          <h2>Processed Document</h2>
          <p>Patient: {document.patientName}</p>
          <p>Date: {document.dateIssued.toLocaleDateString()}</p>
          <p>Doctor: {document.doctorName}</p>
          <p>Diagnosis: {document.diagnosis}</p>

          <h3 className="mt-2">Medications:</h3>
          <ul>
            {document.medications.map((med, index) => (
              <li key={index}>
                {med.name} - {med.dosage} ({med.frequency}) for {med.duration}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
