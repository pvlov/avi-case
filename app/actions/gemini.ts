"use server";

import { GoogleGenAI, createPartFromUri } from "@google/genai";
import { ContentListUnion } from "@google/genai/node";
import { randomUUID } from "crypto";

const PROCESSING = "PROCESSING";
const RETRY_TIMEOUT = 5000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const parseDocument = async (formData: FormData) => {
  const imageBlob = formData.get("image") as Blob;
  const id = randomUUID();

  // Upload the file so genai can access it
  const file = await ai.files.upload({
    file: imageBlob,
    config: {
      displayName: `avi-doc-${id}`,
    },
  });

  let getFile = await ai.files.get({ name: file.name as string });
  while (getFile.state === PROCESSING) {
    getFile = await ai.files.get({ name: file.name as string });
    console.log("File is still processing, retrying in 5 seconds");

    await new Promise((resolve) => {
      setTimeout(resolve, RETRY_TIMEOUT);
    });
  }

  if (file.state === "FAILED") {
    throw new Error("File processing failed.");
  }

  if (!file.uri || !file.mimeType) {
    throw new Error("File URI and MimeType is missing.");
  }

  const content: ContentListUnion = [
    "Return a structured JSON Document containing the data extractable in the file.",
    createPartFromUri(file.uri, file.mimeType),
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: content,
  });

  console.debug(response.text);

  return response.text;
};
