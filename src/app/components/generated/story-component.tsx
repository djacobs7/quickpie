import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';

function StoryComponent() {
    const [story, setStory] = useState('');

    useEffect(() => {
        fetch('https://api.example.com/story')
            .then(response => response.json())
            .then(data => setStory(data.story))
            .catch(error => console.error('Error fetching story:', error));
    }, []);

    return (
        <div className=\