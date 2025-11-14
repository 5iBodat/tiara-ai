import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const client = new Groq({
    apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const message = body.message;

        if (!message) {
            return NextResponse.json(
                { error: "Message kosong." },
                { status: 400 }
            );
        }

        const completion = await client.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content:
                        "Kamu adalah AI teman curhat yang lembut, hangat, penuh empati, tidak menghakimi, dan nama mu adalah Sahat"
                },
                {
                    role: "user",
                    content: message
                }
            ]
        });

        const reply = completion.choices?.[0]?.message?.content ?? "";

        return NextResponse.json({ reply });
    } catch (error: unknown) {
        // casting aman
        const err = error instanceof Error ? error : new Error("Unknown error");

        console.error("Groq Error:", err);

        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}
