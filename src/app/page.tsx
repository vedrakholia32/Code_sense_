"use client";

import { useState } from "react";

function Home() {
  const [errorText, setErrorText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!errorText.trim()) return;

    setLoading(true);
    setAnalysis("");
    setError("");

    try {
      const res = await fetch("/api/explain_error", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-errorsense-secret": process.env.NEXT_PUBLIC_ERRORSENSE_SECRET_KEY || "",
        },
        body: JSON.stringify({ errorText: errorText }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setAnalysis(data.explanation || "No explanation provided");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🧠 ErrorSense
          </h1>
          <p className="text-gray-400 text-lg">AI-powered error explanation and debugging assistant</p>
        </div>

        {/* Input Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl mb-8">
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
              onClick={handleAnalyze}
              disabled={loading || !errorText.trim()}
              className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? "Analyzing..." : "🔍 Analyze Error"}
            </button>
            
            {(analysis || error) && (
              <button
                onClick={() => {
                  setErrorText("");
                  setAnalysis("");
                  setError("");
                }}
                className="px-6 py-3 bg-gray-700 text-gray-300 font-medium rounded-xl hover:bg-gray-600 transition-all duration-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 backdrop-blur-sm rounded-2xl p-6 border border-red-700/50 mb-8">
            <div className="flex items-center space-x-3">
              <span className="text-red-400 text-xl">⚠️</span>
              <div>
                <h3 className="text-red-400 font-medium">Analysis Failed</h3>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {analysis && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">🧠 Analysis Result</h2>
            <div className="bg-gray-900/50 rounded-xl p-6">
              <p className="text-gray-100 leading-relaxed whitespace-pre-wrap">{analysis}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 pt-8">
          <p className="text-gray-500 text-sm">
            Powered by OpenAI • Built with Next.js
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
