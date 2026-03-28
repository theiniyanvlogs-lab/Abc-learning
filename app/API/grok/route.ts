import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { letter, word } = await req.json();
    const apiKey = process.env.GROK_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing GROK_API_KEY" }, { status: 500 });
    }

    const prompt = `You are a fun ABC teacher for small kids. Teach the letter "${letter}" with the word "${word}". Reply in very simple English for a 3-6 year old child. Keep it short, playful, and under 50 words. Add one fun emoji.`;

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [
          { role: "system", content: "You are a joyful kids learning assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 120
      })
    });

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || "Yay! Let's learn together! 🎉";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Grok API error:", error);
    return NextResponse.json({ error: "Failed to connect to Grok API." }, { status: 500 });
  }
}
