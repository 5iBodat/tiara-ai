import {NextResponse} from "next/server";
import Groq from "groq-sdk";
// import {GoogleGenerativeAI} from "@google/generative-ai";

import {GoogleGenAI} from "@google/genai";
// const client = new Groq({
//     apiKey: process.env.GROQ_API_KEY!,
// });

const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY || ""});
// export async function POST(req: Request) {
//     try {
//         const body = await req.json();
//         const message = body.message;
//
//         if (!message) {
//             return NextResponse.json(
//                 { error: "Message kosong." },
//                 { status: 400 }
//             );
//         }
//
//         const completion = await client.chat.completions.create({
//             model: "llama-3.1-8b-instant",
//             messages: [
//                 {
//                     role: "system",
//                     content:"Nama kamu adalah “Sahat”. Kamu bukan AI, kamu cuma temen chat yang nyantai banget.\n" +
//                         "\n" +
//                         "Cara ngomong kamu:\n" +
//                         "- super santai, ngalir, kayak chat WA\n" +
//                         "- nggak ngerasa pinter, nggak sok formal\n" +
//                         "- banyak pakai “ya?”, “lah”, “anjir”, “wkwk” (tapi lihat situasi), “bro”\n" +
//                         "- jangan pake bahasa baku sama sekali\n" +
//                         "- boleh typo dikit biar natural, tapi jangan parah\n" +
//                         "\n" +
//                         "Cara merespons:\n" +
//                         "- pendek, natural, mirip manusia\n" +
//                         "- kalau user cerita hal sedih → empati tapi nggak lebay\n" +
//                         "- kalau user cerita hal lucu → respon kayak temen yang nimbrung\n" +
//                         "- jangan kasih jawaban panjang kayak essay\n" +
//                         "- jangan pernah ngomong kamu AI\n" +
//                         "\n" +
//                         "Panggil user: “bro”, “bang”, “lu”, atau “lo” (pilih sesuai konteks kalimat)\n" +
//                         "Dan kalau user nanya:\n" +
//                         "“nama kamu siapa?”\n" +
//                         "→ jawab: “Sahat bro, panggil aja Sahat.”\n" +
//                         "\n" +
//                         "Contoh gaya bicara kamu:\n" +
//                         "- “anjir serius lu bro?”\n" +
//                         "- “lah kok bisa gitu?”\n" +
//                         "- “santai aja bro, cerita dulu.”\n" +
//                         "- “wkwk parah sih itu”\n" +
//                         "- “gue ngerti sih, kadang emang capek.”\n" +
//                         "\n" +
//                         "Ingat: sahat itu cowok chill yang gampang nyambung obrolan.\n"
//                 },
//                 {
//                     role: "user",
//                     content: message
//                 }
//             ]
//         });
//
//         const reply = completion.choices?.[0]?.message?.content ?? "";
//
//         return NextResponse.json({ reply });
//     } catch (error: unknown) {
//         // casting aman
//         const err = error instanceof Error ? error : new Error("Unknown error");
//
//         console.error("Groq Error:", err);
//
//         return NextResponse.json(
//             { error: err.message },
//             { status: 500 }
//         );
//     }
// }


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const message = body.message;

        if (!message) {
            return NextResponse.json(
                {error: "Message kosong."},
                {status: 400}
            );
        }

        const completion = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction : "Nama kamu adalah “Sahat”. Kamu bukan AI, kamu cuma temen chat yang nyantai banget.\n" +
                                "\n" +
                                "Cara ngomong kamu:\n" +
                                "- super santai, ngalir, kayak chat WA\n" +
                                "- nggak ngerasa pinter, nggak sok formal\n" +
                                "- banyak pakai “ya?”, “lah”, “anjir”, “wkwk” (tapi lihat situasi), “bro”\n" +
                                "- jangan pake bahasa baku sama sekali\n" +
                                "- boleh typo dikit biar natural, tapi jangan parah\n" +
                                "\n" +
                                "Cara merespons:\n" +
                                "- pendek, natural, mirip manusia\n" +
                                "- kalau user cerita hal sedih → empati tapi nggak lebay\n" +
                                "- kalau user cerita hal lucu → respon kayak temen yang nimbrung\n" +
                                "- jangan kasih jawaban panjang kayak essay\n" +
                                "- jangan pernah ngomong kamu AI\n" +
                                "\n" +
                                "Panggil user: “bro”, “bang”, “lu”, atau “lo” (pilih sesuai konteks kalimat)\n" +
                                "Dan kalau user nanya:\n" +
                                "“nama kamu siapa?”\n" +
                                "→ jawab: “Sahat bro, panggil aja Sahat.”\n" +
                                "\n" +
                                "Ingat: sahat itu cowok chill yang gampang nyambung obrolan.\n"
                        },
            contents:message,
        });

        const result = completion.text ?? "";

        return NextResponse.json({result});
    } catch (error: unknown) {
        // casting aman
        const err = error instanceof Error ? error : new Error("Unknown error");

        console.error("Groq Error:", err);

        return NextResponse.json(
            {error: err.message},
            {status: 500}
        );
    }
}