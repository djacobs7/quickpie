import { create_story_prompt } from '@/prompt/create_story';
import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages, streamObject } from 'ai';
import { z } from 'zod';
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;



export async function POST(req: Request) {
    // const { messages } = await req.json();


    console.log("CALLING API/CHAT")
    const result = await streamObject({
        model: openai('gpt-4-turbo'),
        schema: z.object(
            {
                stories: z.array(z.string()),
            }
        ),
        prompt: create_story_prompt,
    });


    return result.toTextStreamResponse()
}