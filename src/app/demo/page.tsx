
import { useState } from 'react';
import { AI } from '../actions';
import { useActions, useUIState } from 'ai/rsc';
import { streamObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod'

export default async function Page() {


    const { partialObjectStream } = await streamObject({
        model: openai('gpt-4-turbo'),
        schema: z.object({
            recipe: z.object({
                name: z.string(),
                ingredients: z.array(z.string()),
                steps: z.array(z.string()),
            }),
        }),
        prompt: 'Generate a lasagna recipe.',
    });


    return <>
        {partialObjectStream}
    </>

}