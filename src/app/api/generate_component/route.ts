import { callOpenAIAndSaveToFile, component_generation_prompt } from '@/app/services/promptToFile';
import { z } from 'zod';
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;



export async function GET(req: Request) {
    const resultString = await callOpenAIAndSaveToFile(component_generation_prompt, "")

    return Response.json({ resultString })
}