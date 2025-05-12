# N/avi: A smarter way to manage your medical records and navigate the healthcare system - streamlined, secure, and built with patients in mind.

## What is this project?

N/avi is a digital onboarding platform that simplifies how patients share medical information with providers. Using cutting-edge AI and OCR technologies, it transforms legacy paper forms into structured digital data, capturing symptoms, insurance details, vaccination history and medical records, via an intuitive, step-by-step user experience. It makes the onboarding as easy as taking a selfie while also saving the provider the pain of going through millions of documents yearly. The benefits don't stop there - with our well-structured data it enables other data-driven applications by providing the data in a structured and clean way.

## How did we build it?

The project is built on a full-stack Next.js web application. The frontend is developed using React, styled with Tailwind CSS, and enhanced by a custom UI component library to deliver a clean, responsive, and well-structured user experience. For state management, we use Zustand to maintain consistency across multi-step forms. The backend integrates Google’s Vertex AI API, specifically the Gemini 2.0 Flash model, to intelligently parse medical documents. Under the hood it leverages a multi-pass data processing pipeline for high accuracy and data reliability.
