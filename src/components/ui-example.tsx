
'use client';

import { useState, useEffect } from 'react';

export default function UIExample(params: { story?: string }) {

    const story = params?.story


    const [componentCode, setComponentCode] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchComponentCode = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/generate_component');
                if (!response.ok) {
                    throw new Error('Failed to fetch component code');
                }
                const data = await response.text();
                setComponentCode(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchComponentCode();
    }, []);

    if (!story) {
        return <></>
    }
    return <div>
        <div className="text-xl font-semibold">{story}</div>


        {componentCode}

    </div>
}