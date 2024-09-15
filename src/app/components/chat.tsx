'use client';

import { StoryList } from '@/components/story-list';
import { useChat } from 'ai/react';
import { experimental_useObject as useObject } from 'ai/react';
import { z } from 'zod';
export default function Chat() {

    // const { messages, input, handleInputChange, handleSubmit } = useChat();


    const { submit, isLoading, object } = useObject({
        api: "/api/chat",
        schema: z.object(
            {
                stories: z.array(z.string()),
            }
        ),
        onFinish({ object }) {
            if (object != null) {

            }
        },
        onError: () => {
        },
    });



    return <div>
        <div className="text-gray-500 cursor-pointer" onClick={() => { submit('test') }}>
            start
        </div>

        {JSON.stringify(isLoading)}

        <StoryList stories={object?.stories?.filter(a => a)} />
    </div>
    //     <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">


    //         <div className="text-gray-500 cursor-pointer" onClick={() => { submit('test') }}>
    //             start
    //         </div>
    //         {JSON.stringify(isLoading)}
    //         <div className="text-gray-500">
    //             {JSON.stringify(object)}
    //         </div>

    //         <form onSubmit={submit}>
    //             <input
    //                 className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
    //                 // value={input}
    //                 placeholder="Say something..."
    //             // onChange={handleInputChange}
    //             />
    //         </form>

    //         <StoryList />
    //     </div>
    // );
}