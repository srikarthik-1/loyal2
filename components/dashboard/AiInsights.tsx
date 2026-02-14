import React, { useState } from 'react';
import { Customer } from '../../types';
import * as api from '../../backend/api';
import { SparklesIcon, BrainCircuitIcon } from '../icons/Icons';
import Markdown from 'react-markdown';

interface AiInsightsProps {
  customers: Customer[];
  adminUsername: string;
}

const examplePrompts = [
    "Who are my most loyal customers based on visit frequency and total spend?",
    "Identify customers at risk of churning (low recent activity).",
    "Suggest a promotion for customers with high points balances but low recent spending.",
    "What is the average time between visits for my customers?"
];

const AiInsights: React.FC<AiInsightsProps> = ({ customers, adminUsername }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');

    const handleGenerateInsights = async (currentPrompt: string) => {
        if (!currentPrompt.trim()) {
            setError('Prompt cannot be empty.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResponse('');
        try {
            // Call the backend API instead of the service directly
            const result = await api.fetchAiInsights(adminUsername, currentPrompt);
            setResponse(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleGenerateInsights(prompt);
    }

    return (
        <div>
            <h1 className="text-4xl font-serif pb-5 mb-8 border-b border-[#333]">AI Powered Insights</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-[#0a0a0a] border border-[#333] p-6 sticky top-24">
                        <h2 className="text-lg font-serif mb-4">Ask Gemini about your data</h2>
                        <form onSubmit={handleFormSubmit}>
                            <textarea 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., 'Which customers have the highest average bill amount?'"
                                className="w-full h-32 bg-[#111] border border-[#333] p-3 text-sm focus:outline-none focus:border-white transition-colors"
                                disabled={isLoading}
                            />
                            <button 
                                type="submit"
                                disabled={isLoading || customers.length === 0}
                                className="w-full mt-4 py-3 flex items-center justify-center gap-2 bg-white rounded-md text-black font-semibold transition-all duration-300 hover:bg-gray-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="w-5 h-5" />
                                        Generate Insights
                                    </>
                                )}
                            </button>
                             {customers.length === 0 && <p className="text-xs text-center text-gray-500 mt-3">Add customer data via the 'Transaction' tab to enable AI insights.</p>}
                        </form>
                        <div className="mt-8">
                            <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-3">Or try an example</h3>
                            <div className="flex flex-col gap-2">
                                {examplePrompts.map((p, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => { setPrompt(p); if (customers.length > 0) handleGenerateInsights(p); }}
                                        disabled={isLoading || customers.length === 0}
                                        className="text-left text-sm text-gray-400 hover:text-white transition-colors p-2 rounded hover:bg-white/5 disabled:opacity-50"
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-[#0a0a0a] border border-[#333] p-6 min-h-[60vh]">
                        <h2 className="text-lg font-serif mb-4">Analysis Result</h2>
                        {isLoading && <p className="text-gray-400">Gemini is thinking... This may take a moment.</p>}
                        {error && <div className="text-red-400 bg-red-900/20 p-4 border border-red-800">{error}</div>}
                        {response && (
                             <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                                <Markdown>{response}</Markdown>
                            </div>
                        )}
                        {!isLoading && !response && !error && (
                            <div className="text-center text-gray-500 pt-16">
                                <BrainCircuitIcon className="w-16 h-16 mx-auto mb-4" />
                                <p>Your insights will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiInsights;
