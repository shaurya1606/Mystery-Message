import { generateText, streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { NextResponse } from 'next/server';



// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."
    
    const model = google('gemini-1.5-flash');
    const response = streamText({
     model,
      prompt,
      providerOptions: {
       google: {
          responseModalities: ['TEXT'],
        }
      }
  });

return response.toTextStreamResponse();
}
catch (error) {
  if (error instanceof Error) {
    const {name, message} = error;
    return NextResponse.json({ error: { name, message } }, { status: 500 });
  } else {
    console.error('Unknown error occurred', error);
    throw new Error('Unknown error occurred');
  }
}
}
