"use client";
import { useEffect, useState } from "react";
interface Message {
  role: "user" | "bot";
  content: string;
}
const url = "https://shengrong.netlify.app/.netlify/functions/ai-chat";
const urldemo = "https://shengrong.netlify.app/.netlify/functions/hello";
export default function ChatCom() {
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newChatHistory: Message[] = [
      ...chatHistory,
      { role: "user", content: message },
    ];
    setChatHistory(newChatHistory);
    setMessage("");

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newChatHistory }),
    });

    const data = await res.json();
    const botMessage: Message = {
      role: "bot",
      content: data.choices?.[0]?.message?.content || "No response",
    };
    setChatHistory([...newChatHistory, botMessage]);
  };

  useEffect(() => {
    fetch(urldemo)
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "dataatata");
      });
  }, []);

  return (
    <div className="p-4 max-w-lg mx-auto bg-gray-100 rounded-lg shadow-lg">
      <div className="h-80 overflow-y-auto p-2 border-b">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={msg.role === "user" ? "text-right" : "text-left"}
          >
            <p
              className={`p-2 inline-block rounded-lg ${
                msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
            >
              {msg.content}
            </p>
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="输入你的消息..."
          className="flex-1 p-2 border rounded-l-lg"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded-r-lg"
        >
          发送
        </button>
      </div>
    </div>
  );
}
