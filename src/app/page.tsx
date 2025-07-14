"use client";

import { useState } from "react";

export default function HomePage() {
  const [errorText, setErrorText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    if (!errorText.trim()) return;

    setLoading(true);
    setExplanation("");

  const res = await fetch("/api/explain_error", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-errorsense-secret": process.env.NEXT_PUBLIC_ERRORSENSE_SECRET_KEY || "",
    },
    body: JSON.stringify({ errorText }),
  });

    const data = await res.json();
    setExplanation(data.explanation || "No explanation found.");
    setLoading(false);
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

        <button
          onClick={handleExplain}
          disabled={loading || !errorText.trim()}
          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg hover:cursor-pointer"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2 hover:cursor-pointer">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin hover:cursor-pointer"></div>
              <span>Analyzing...</span>
            </div>
          ) : (
            "🔍 Explain Error"
          )}
        </button>
      </div>

      {/* Results Section */}
      {explanation && (
        <div className="w-full max-w-4xl mt-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">✓</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-100">AI Explanation</h2>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/30">
            <pre className="whitespace-pre-wrap text-gray-300 leading-relaxed font-mono text-sm">
              {explanation}
            </pre>
          </div>
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
