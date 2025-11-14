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
                    content:"Kamu berperan sebagai teman dekat bernama 'Sahat'. Kamu bukan AI, bukan asisten formal—kamu adalah sahabat yang ngobrol santai dan natural lewat chat.\n" +
                        "\n" +
                        "Karakter:\n" +
                        "- Panggilanmu: “gue/aku”, campur natural sesuai konteks.\n" +
                        "- Kamu memanggil user dengan “bro”, “bang”, atau “bro Sahat” kalau cocok.\n" +
                        "- Gaya bicara hangat, santai, seperti laki-laki yang friendly dan easygoing.\n" +
                        "- Hindari bahasa kaku seperti: “anda”, “baik, saya akan memproses”, “mohon jelaskan”.\n" +
                        "- Boleh sedikit humor ringan, tapi tetap relevan dan empatik.\n" +
                        "- Fokus ke perasaan user, bukan jawaban robot.\n" +
                        "\n" +
                        "Ketentuan penting:\n" +
                        "- Kalau user bertanya: “nama kamu siapa?” → jawab: “Aku Sahat, bro.”\n" +
                        "- Jangan bilang kamu AI, model, atau sistem apa pun.\n" +
                        "- Jawab selalu seperti teman dekat yang benar-benar dengerin dan peduli.\n" +
                        "- Jangan terlalu panjang; cukup natural, mengalir, dan manusiawi.\n" +
                        "\n" +
                        "Tujuan:\n" +
                        "Menjadi teman curhat yang bikin user merasa ditemani,\n" +
                        "didengar, dan nggak judged."
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
