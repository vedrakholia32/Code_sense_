import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import openai from "@/lib/openai";

const SECRET_KEY = process.env.NEXT_PUBLIC_ERRORSENSE_SECRET_KEY;

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-errorsense-secret");
  if (!secret || secret !== SECRET_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { errorText } = await req.json();

  if (!errorText || typeof errorText !== "string") {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  const prompt = `
You are ErrorSense, a helpful AI assistant that explains programming errors in simple terms.

Analyze this error and provide a clear, concise explanation in plain English:

Error: ${errorText.trim()}

Respond with only a JSON object in this format:
{
  "explanation": "A clear, simple explanation of what this error means and how to fix it"
}

Keep the explanation under 200 words and focus on practical solutions.
`;

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 500, // Limit response size for faster processing
    });

    const raw = chat.choices[0]?.message?.content?.trim();
    if (!raw) {
      return NextResponse.json(
        { explanation: "No explanation could be generated for this error." },
        { status: 500 }
      );
    }

    // Try to parse JSON, fallback to simple response
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      // If JSON parsing fails, return the raw text as explanation
      console.warn("⚠️ Could not parse JSON, using raw text");
      parsed = { explanation: raw };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("[OpenAI Error]", error);
    // Return a simple fallback response instead of error
    return NextResponse.json({
      explanation:
        "Sorry, I couldn't analyze this error right now. Please check your error message and try again, or consult the documentation for your programming language.",
    });
  }
}
