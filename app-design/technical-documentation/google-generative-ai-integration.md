# Google Generative AI Integration for Mystery Message Web App

---

## Overview

This document describes the integration of Google Generative AI (Gemini) with the Mystery Message web application. It covers setup, requirements, API usage, relevant SDK features, common problems encountered, and their solutions—all tailored to the needs of the Mystery Message platform.

---

## 1. Integration Goals

- **Purpose:** Automatically generate friendly, open-ended, and engaging questions for users on an anonymous social messaging platform.
- **Model Used:** Gemini (`gemini-1.5-flash` or `gemini-2.5-flash`) via the AI SDK.
- **Response Format:** Questions are returned as a plain text stream, separated by `||`, suitable for direct display or further processing.

---

## 2. Requirements

### a. Packages

- `@ai-sdk/google` (Google Generative AI provider)
- `ai` (AI SDK core utilities)

Install with:
```bash
npm install @ai-sdk/google ai
```

### b. Environment Variables

Add your Google Generative AI API key to `.env`:
```properties
GOOGLE_GENERATIVE_AI_API_KEY="YOUR_GOOGLE_API_KEY"
```
**Note:** The variable name must be exactly `GOOGLE_GENERATIVE_AI_API_KEY`.

### c. API Route

Create an API route at `/api/suggest-message`:
- Handles POST requests.
- Uses `streamText` from the AI SDK to generate and stream questions.

---

## 3. Example Implementation

```typescript
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const response = await streamText({
      model: google('gemini-1.5-flash'),
      prompt,
      providerOptions: {
        google: {
          responseModalities: ['TEXT'],
        }
      }
    });

    // Stream the response as plain text
    return response.toTextStreamResponse();
  } catch (error) {
    if (error instanceof Error) {
      const { name, message } = error;
      return NextResponse.json({ error: { name, message } }, { status: 500 });
    } else {
      throw new Error('Unknown error occurred');
    }
  }
}
```

---

## 4. Relevant SDK Features

- **Provider Setup:**  
  Use `google` from `@ai-sdk/google`. The API key is automatically picked from the environment variable.
- **Model Selection:**  
  Use model IDs like `'gemini-1.5-flash'` or `'gemini-2.5-flash'`.
- **Streaming Responses:**  
  Use `streamText` for real-time, incremental delivery of generated questions.
- **Safety Settings:**  
  Optionally configure safety settings to block inappropriate content.
- **Prompt Design:**  
  Prompts should be clear, instructing the model to avoid personal/sensitive topics and focus on universal, friendly questions.

---

## 5. Problems Faced & Solutions

### a. API Key Not Recognized

**Problem:**  
`Google Generative AI API key is missing. Pass it using the 'apiKey' parameter or the GOOGLE_GENERATIVE_AI_API_KEY environment variable.`

**Solution:**  
- Ensure `.env` uses the correct variable name:  
  `GOOGLE_GENERATIVE_AI_API_KEY`
- Restart the Next.js server after updating `.env`.

---

### b. Permission Denied (403 Error)

**Problem:**  
`Method doesn't allow unregistered callers (callers without established identity). Please use API Key or other form of API consumer identity to call this API.`

**Solution:**  
- Confirm the API key is valid and correctly set in `.env`.
- Use the correct environment variable name.
- Restart the server to reload environment variables.

---

### c. Type Errors with Streaming

**Problem:**  
Passing the entire `StreamTextResult` object to `NextResponse` caused type errors.

**Solution:**  
- Use `response.toTextStreamResponse()` to return a proper streaming response.

---

### d. Endpoint Not Found (404)

**Problem:**  
Frontend tried to call `/api/chat`, but the backend route was `/api/suggest-message`.

**Solution:**  
- Either rename the backend route to `/api/chat` or configure the frontend to use `/api/suggest-message`.

---

### e. Unused Variables & ESLint Warnings

**Problem:**  
Warnings for unused variables and unexpected `any` types.

**Solution:**  
- Remove unused variables or prefix with `_`.
- Replace `any` with specific types.

---

## 6. Best Practices

- **Prompt Clarity:**  
  Make prompts explicit about formatting and content requirements.
- **Error Handling:**  
  Return structured error responses for frontend handling.
- **Streaming:**  
  Prefer streaming for user-facing, interactive features.
- **Security:**  
  Keep API keys secure and never expose them to the frontend.

---

## 7. References

- [AI SDK Documentation](https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai)
- [Google Generative AI API Docs](https://ai.google.dev/)
- [Mystery Message API Implementation](d:\Mystry Message\my-app\src\app\api\suggest