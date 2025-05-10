"use client";

import React, { useRef, useState, useEffect } from "react";

export default function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch((err) => setError(err.message || "Could not access camera"));

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const captureAndSend = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setLoading(true);
    setError(null);
    setResponse(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setError("Canvas context unavailable");
      setLoading(false);
      return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/jpeg"),
      );
      if (!blob) throw new Error("Failed to capture image");

      const formData = new FormData();
      formData.append("image", blob, "snapshot.jpg");

      const res = await fetch("/api/gemini", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || res.statusText);
      setResponse(data.text);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-4 p-4">
      {error && <p className="text-red-600">Error: {error}</p>}

      <video ref={videoRef} className="w-full rounded bg-black" playsInline muted />

      <button
        onClick={captureAndSend}
        disabled={loading}
        className="w-full rounded bg-blue-600 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Sending to Gemini…" : "Capture & Send to Gemini"}
      </button>

      {response && (
        <div className="rounded bg-gray-100 p-4">
          <h3 className="mb-2 font-semibold">Gemini says:</h3>
          <p className="whitespace-pre-wrap">{response}</p>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
