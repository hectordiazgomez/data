import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Home = () => {
    const [prompt, setPrompt] = useState('');
    const [generatedUrl, setGeneratedUrl] = useState('');
    const [error, setError] = useState('');
    const [data, setData] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setGeneratedUrl('');
        setData(null);

        try {
            const response = await fetch('http://localhost:5000/data-api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            const result = await response.json();

            if (response.ok) {
                setGeneratedUrl(result.generatedUrl);
                setData(result.data[1]);
            } else {
                setError(result.error || 'An error occurred');
            }
        } catch (error) {
            setError('Failed to connect to the server');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h1 className="text-2xl font-bold mb-4">URL Generator</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
                        Enter JSON Prompt
                    </label>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        rows="4"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Generate URL
                </button>
            </form>
            {error && <p className="mt-4 text-red-600">{error}</p>}
            {generatedUrl && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold">Generated URL:</h2>
                    <p className="mt-2 p-2 bg-gray-100 rounded">{generatedUrl}</p>
                </div>
            )}
            {data && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold">GDP Data:</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default Home;
