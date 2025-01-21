"use client";
import { useState } from "react";
import { FaDownload } from "react-icons/fa";

export default function GenerateImage() {
    const [prompt, setPrompt] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const generateImage = async () => {
        setLoading(true);
        setImageUrl(null);
        setError(null);

        try {
            const response = await query({ inputs: prompt });

            if (response) {
                const url = URL.createObjectURL(response);
                setImageUrl(url);
            } else {
                throw new Error("Failed to generate the image. Please try again.");
            }
        } catch (error: any) {
            console.error("Error generating image:", error);
            setError(error.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    async function query(data: { inputs: string }) {
        const apiKey = process.env.NEXT_PUBLIC_HF_API_KEY;
        if (!apiKey) {
            throw new Error("API key is missing. Please add it to the .env.local file.");
        }
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Failed to fetch image: ${response.status} ${response.statusText} - ${errorText}`
            );
        }
        return await response.blob();
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-4xl font-extrabold mb-6 text-blue-400">
                AI Image Generator 🎨
            </h1>

            {/* Input Box */}
            <div className="w-full max-w-lg">
                <input
                    type="text"
                    className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a creative prompt..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={loading}
                />
                <button
                    onClick={generateImage}
                    className={`mt-4 w-full ${
                        loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                    } transition text-white font-bold py-3 rounded-lg`}
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Generate Image"}
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 text-red-500 text-center font-medium">
                    {error}
                </div>
            )}

            {/* Image Display */}
            {imageUrl && (
                <div className="relative mt-6 group">
                    <img
                        src={imageUrl}
                        alt="Generated"
                        className="w-96 h-96 rounded-lg shadow-lg border border-gray-700"
                    />
                    <a
                        href={imageUrl}
                        download="AI_Generated_Image.png"
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300"
                    >
                        <FaDownload size={36} color="white" />
                    </a>
                </div>
            )}
        </div>
    );
}
