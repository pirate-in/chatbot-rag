import React, { useState } from 'react';

const RAGSystem = () => {

    const EXAMPLE_PROMPTS = [
        {
            id: '1',
            title: 'Article Summarization',
            library_name: 'Article Library',
            content: 'Summarize the following article in 3-5 key points:',
            tags: ['summarization', 'nlp'],
            category: 'Text Processing',
            outputFormat: 'plain text'
        },

        {
            id: '2',
            title: 'Code Review',
            library_name: 'Coding standards',
            content: 'Review the following code for best practices:',
            tags: ['coding', 'review'],
            category: 'Development'
        }
    ]
    const [prompts, setPrompts] = useState(EXAMPLE_PROMPTS);


    const handleDrop = (e) => {
        e.preventDefault();
        const prompt = e.dataTransfer.getData('text/plain');
        setPrompts([...prompts, prompt]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Build RAG System</h2>
            <div
                className="border-2 border-dashed border-gray-400 p-4"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                {prompts.length > 0 ? (
                    prompts.map((prompt) => (
                        <div key={prompt.id} className="bg-gray-200 p-2 mb-2">
                            <p><strong>Prompt:</strong> {prompt.content}</p>
                            <p><strong>category:</strong> {prompt.category}</p>
                            <p><strong>Tags:</strong> {prompt.tags.join(', ')}</p>
                            <p><strong>Output Format:</strong> {prompt.outputFormat}</p>
                        </div>
                    ))
                ) : (
                    <p>Drag and drop prompts here</p>
                )}
            </div>
        </div>
    );
};

export default RAGSystem;