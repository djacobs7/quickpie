import { callOpenAIAndSaveToFile, component_generation_prompt } from '@/app/services/promptToFile';
import { z } from 'zod';
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

import path from 'path';



export async function POST(req: Request) {

    const { story } = await req.json()

    if (!story) {
        return Response.json({ error: "No story provided" }, { status: 400 })
    }

    const outputFilePath = path.resolve(process.cwd(), 'src/app/components/generated/story-component.tsx')

    console.log("outputFilePath", outputFilePath)
    const resultString = await callOpenAIAndSaveToFile(component_generation_prompt(story), outputFilePath)

    return Response.json({ resultString })
}