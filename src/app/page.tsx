"use client";

import { useState } from "react";
import ErrorAnalysis from "@/components/ErrorAnalysis";

export default function HomePage() {
  const [errorText, setErrorText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExplain = async () => {
    if (!errorText.trim()) return;

    setLoading(true);
    setAnalysis(null);
    setError("");

  const res = await fetch("/api/explain_error", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-errorsense-secret": process.env.NEXT_PUBLIC_ERRORSENSE_SECRET_KEY || "",
    },
    body: JSON.stringify({ errorText }),
  });

    try {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze error");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setErrorText("");
    setAnalysis(null);
    setError("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-start p-6">
      {/* Header */}
      <div className="w-full max-w-4xl text-center mb-8 pt-8">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          🧠 ErrorSense
        </h1>
        <p className="text-gray-400 text-lg">AI-powered error explanation and debugging assistant</p>
      </div>

      {/* Input Section */}
      <div className="w-full max-w-4xl bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
        <label className="block text-gray-300 text-sm font-medium mb-3">
          Error Message
        </label>
        <textarea
          className="w-full p-4 h-48 bg-gray-900/50 border border-gray-600 rounded-xl mb-6 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 resize-none"
          placeholder="Paste your error message here and let AI explain what went wrong..."
          value={errorText}
          onChange={(e) => setErrorText(e.target.value)}
        />

        <div className="flex space-x-3">
          <button
            onClick={handleExplain}
            disabled={loading || !errorText.trim()}
            className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Analyzing...</span>
              </div>
            ) : (
              "🔍 Analyze Error"
            )}
          </button>
          
          {(analysis || error) && (
            <button
              onClick={handleClear}
              className="px-6 py-3 bg-gray-700 text-gray-300 font-medium rounded-xl hover:bg-gray-600 transition-all duration-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-4xl mt-8 bg-red-900/20 backdrop-blur-sm rounded-2xl p-6 border border-red-700/50">
          <div className="flex items-center space-x-3">
            <span className="text-red-400 text-xl">⚠️</span>
            <div>
              <h3 className="text-red-400 font-medium">Analysis Failed</h3>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {analysis && (
        <div className="mt-8">
          <ErrorAnalysis data={analysis} />
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto pt-8 text-center">
        <p className="text-gray-500 text-sm">
          Powered by OpenAI • Built with Next.js
        </p>
      </div>
    </main>
  );
}
