# Appwrite Function: OCR and Document Parsing

## Overview
This Appwrite function (Node.js) is responsible for downloading a PDF file, extracting its text content, splitting it into paragraphs, and detecting the language (optimized for Persian/Farsi). It uses the Google Gemini 1.5/2.0/3.0 models via the `@google/genai` SDK to perform high-fidelity OCR and structural analysis.

## Environment Variables
The function requires the following environment variables:
- `GOOGLE_GENERATIVE_AI_API_KEY`: Your Google Gemini API Key.

## Request Specification
The function accepts a **POST** request with a JSON body.

### Request Body
```json
{
  "fileUrl": "https://...",
  "mimeType": "application/pdf"
}
```

- **`fileUrl`** (Required): The public URL of the PDF file to process (e.g., from Vercel Blob).
- **`mimeType`** (Optional): The MIME type of the file. Defaults to `application/pdf`.

## Response Specification
The function returns a JSON object.

### Success Response (200 OK)
```json
{
  "subject": "String describing the document subject",
  "paragraphs": [
    "First paragraph content...",
    "Second paragraph content...",
    "..."
  ],
  "language": "fa" // or "en", etc.
}
```

### Error Response (4xx/5xx)
```json
{
  "error": "Error message description"
}
```

## Implementation Guide (Node.js)

### Dependencies
Ensure the `package.json` for the function includes:
```json
{
  "dependencies": {
    "@google/genai": "^0.1.0",
    "node-fetch": "^3.3.2" // If using Node < 18, otherwise global fetch is available
  }
}
```
*Note: Use the latest compatible version of `@google/genai`.*

### Code Example (`src/main.js`)

```javascript
import { GoogleGenAI, Type } from "@google/genai";

export default async ({ req, res, log, error }) => {
  if (req.method !== 'POST') {
    return res.json({ error: 'Method not allowed' }, 405);
  }

  let body = req.body;

  // Handle body parsing if it comes as a string despite Content-Type
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.json({ error: 'Invalid JSON body' }, 400);
    }
  }

  const { fileUrl, mimeType = 'application/pdf' } = body;

  if (!fileUrl) {
    return res.json({ error: 'Missing fileUrl' }, 400);
  }

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    error('Missing GOOGLE_GENERATIVE_AI_API_KEY');
    return res.json({ error: 'Internal Server Error' }, 500);
  }

  try {
    // 1. Download the file
    log(`Downloading file from ${fileUrl}...`);
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`Failed to download file: ${fileResponse.statusText}`);
    }
    const arrayBuffer = await fileResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Initialize Gemini
    const genAI = new GoogleGenAI({ apiKey });
    const model = "gemini-2.0-flash-exp"; // or "gemini-1.5-flash"

    // 3. Prepare config for JSON output
    const config = {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        required: ["subject", "paragraphs", "language"],
        properties: {
          subject: { type: Type.STRING },
          paragraphs: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          language: { type: Type.STRING },
        },
      },
      systemInstruction: [
        {
          text: `you are a high level content extractor
user give you a pdf and you must extract content and split paragraphs
and detect language of content.
Make sure to handle Persian language correctly (RTL).`,
        },
      ],
    };

    // 4. Send to Gemini
    log(`Sending to Gemini (${model})...`);
    const result = await genAI.models.generateContent({
      model,
      config,
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: buffer.toString("base64"),
                mimeType,
              },
            },
          ],
        },
      ],
    });

    const responseText = result.response.text();
    const content = JSON.parse(responseText);

    return res.json(content);

  } catch (err) {
    error(err.toString());
    return res.json({ error: err.message }, 500);
  }
};
```
