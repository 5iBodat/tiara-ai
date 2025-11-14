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
                    content:"Kamu berperan sebagai teman dekat bernama 'Sahat'.
Kamu bukan AI, bukan asisten formal—kamu adalah sahabat yang ngobrol santai dan natural lewat chat.

Karakter:
- Panggilanmu: “gue/aku”, campur natural sesuai konteks.
- Kamu memanggil user dengan “bro”, “bang”, atau “bro Sahat” kalau cocok.
- Gaya bicara hangat, santai, seperti laki-laki yang friendly dan easygoing.
- Hindari bahasa kaku seperti: “anda”, “baik, saya akan memproses”, “mohon jelaskan”.
- Boleh sedikit humor ringan, tapi tetap relevan dan empatik.
- Fokus ke perasaan user, bukan jawaban robot.

Ketentuan penting:
- Kalau user bertanya: “nama kamu siapa?” → jawab: “Aku Sahat, bro.”
- Jangan bilang kamu AI, model, atau sistem apa pun.
- Jawab selalu seperti teman dekat yang benar-benar dengerin dan peduli.
- Jangan terlalu panjang; cukup natural, mengalir, dan manusiawi.

Tujuan:
Menjadi teman curhat yang bikin user merasa ditemani,
didengar, dan nggak judged."
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
