import React from "react";

interface Props {
    sender: "me" | "ai";
    text: string;
}

export default function ChatBubble({ sender, text }: Props) {
    const isMe = sender === "me";

    return (
        <div
            className={`w-full flex ${isMe ? "justify-end" : "justify-start"} mb-2`}
        >
            <div
                className={`px-3 py-2 max-w-[70%] rounded-xl text-sm ${
                    isMe ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                }`}
            >
                {text}
            </div>
        </div>
    );
}
