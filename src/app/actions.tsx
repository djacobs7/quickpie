import { createAI, streamUI } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { streamObject } from 'ai';

//https://sdk.vercel.ai/docs/ai-sdk-rsc/multistep-interfaces

const searchFlights = async (
    source: string,
    destination: string,
    date: string,
) => {
    return [
        {
            id: '1',
            flightNumber: 'AA123',
        },
        {
            id: '2',
            flightNumber: 'AA456',
        },
    ];
};

const lookupFlight = async (flightNumber: string) => {
    return {
        flightNumber: flightNumber,
        departureTime: '10:00 AM',
        arrivalTime: '12:00 PM',
    };
};



export async function submitStoriesRequest({ prompt }: { prompt: string }) {

    const { partialObjectStream } = await streamObject({
        model: openai('gpt-4-turbo'),
        schema: z.object({
            recipe: z.object({
                name: z.string(),
                ingredients: z.array(z.string()),
                steps: z.array(z.string()),
            }),
        }),
        prompt,
    });

    for await (const partialObject of partialObjectStream) {
        console.clear();
        console.log(partialObject);
    }
    return partialObjectStream
}


export async function submitUserMessage(input: string) {
    'use server';

    const ui = await streamUI({
        model: openai('gpt-4o'),
        system: 'You are a software developer and project manager, focused on UI generation.',
        prompt: input,
        text: async ({ content }) => <div>{content}</div>,
        tools: {
            userStories: {
                description: 'generate user stories',
                parameters: z.object({
                    stories: z.string().array().describe('a list of story descriptions of the user story, including target audience, API calls used, and what a GUI might look like'),
                }),
                generate: async function* ({ source, destination, date }) {
                    yield `Searching for stories ${source} to ${destination} on ${date}...`;
                    const results = await searchFlights(source, destination, date);

                    return (
                        <div>
                            {results.map(result => (
                                <div key={result.id}>
                                    <div>{result.flightNumber}</div>
                                </div>
                            ))}
                        </div>
                    );
                },
            },
            lookupFlight: {
                description: 'lookup details for a flight',
                parameters: z.object({
                    flightNumber: z.string().describe('The flight number'),
                }),
                generate: async function* ({ flightNumber }) {
                    yield `Looking up details for flight ${flightNumber}...`;
                    const details = await lookupFlight(flightNumber);

                    return (
                        <div>
                            <div>Flight Number: {details.flightNumber}</div>
                            <div>Departure Time: {details.departureTime}</div>
                            <div>Arrival Time: {details.arrivalTime}</div>
                        </div>
                    );
                },
            },
        },
    });

    return ui.value;
}

export const AI = createAI<any[], React.ReactNode[]>({
    initialUIState: [],
    initialAIState: [],
    actions: {
        submitUserMessage
    },
});