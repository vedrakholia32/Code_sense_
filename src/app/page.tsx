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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ errorText }),
    });

    const data = await res.json();
    setExplanation(data.explanation || "No explanation found.");
    setLoading(false);
  };

  return (
    <main className="min-h-screen p-6 bg-gray-500 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">🧠 ErrorSense</h1>

      <textarea
        className="w-full max-w-2xl p-4 h-48 border border-gray-300 rounded mb-4"
        placeholder="Paste your error message here..."
        value={errorText}
        onChange={(e) => setErrorText(e.target.value)}
      />

      <button
        onClick={handleExplain}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Explaining..." : "Explain Error"}
      </button>

      {explanation && (
        <div className="mt-6 w-full max-w-2xl bg-white p-4 border border-gray-300 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Explanation:</h2>
          <pre className="whitespace-pre-wrap text-gray-800">{explanation}</pre>
        </div>
      )}
    </main>
  );
}
