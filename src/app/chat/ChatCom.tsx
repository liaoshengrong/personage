"use client";
import { useState, useRef, useEffect } from "react";
import MDRender from "../_components/MDRender";

interface Message {
  role: "user" | "system";
  content: string;
}

const url = "https://shengrong.netlify.app/.netlify/functions/ai-chat";

export default function ChatCom() {
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { role: "system", content: "你好，我是Mark的AI大模型。" },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newChatHistory: Message[] = [
      ...chatHistory,
      { role: "user", content: message },
    ];
    setChatHistory(newChatHistory);
    setMessage("");
    setIsLoading(true);
    setStreamingMessage("");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newChatHistory }),
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      let fullResponse = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const content = line.slice(6);
            if (content === "[DONE]") continue;
            const msg = JSON.parse(content);
            fullResponse += msg.choices[0].delta.content || "";
            setStreamingMessage(fullResponse);
          }
        }
      }

      const finalMessage: Message = {
        role: "system",
        content: fullResponse || "No response",
      };
      setChatHistory((prev) => [...prev, finalMessage]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { role: "system", content: "发生错误，请重试。" },
      ]);
    } finally {
      setIsLoading(false);
      setStreamingMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey || e.altKey) {
        // 如果按下了 Shift 或 Alt 键，则允许换行
        return;
      }
      e.preventDefault(); // 阻止默认的换行行为
      sendMessage();
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  return (
    <div className="w-full p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-lg mt-16 animate__animated animate__fadeInUp">
      <GradientText text="个人AI大模型，欢迎体验" />
      {/* 聊天历史 */}
      <div
        ref={chatContainerRef}
        className="hide-scrollbar overflow-y-auto p-4 border-b border-gray-200 min-h-32"
        style={{ maxHeight: "calc(100vh - 400px)" }} // 设置最大高度为视口高度减去一些固定高度
      >
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div
              className={`px-4 py-2 rounded-lg text-base ${
                msg.role === "user"
                  ? "bg-blue-100 text-blue-900"
                  : "bg-gray-100 text-gray-900"
              } max-w-3xl inline-block`}
            >
              {msg.role === "user" ? (
                msg.content
              ) : (
                <MDRender content={msg.content} />
              )}
            </div>
          </div>
        ))}
        {streamingMessage && (
          <div className="flex justify-start mb-4">
            <div className="px-4 py-2 rounded-lg text-base bg-gray-100 text-gray-900 max-w-3xl inline-block">
              <MDRender content={streamingMessage} />
            </div>
          </div>
        )}
        {isLoading && !streamingMessage && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* 输入框和发送按钮 */}
      <div className="flex mt-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入你的消息..."
          className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          rows={4}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          发送
        </button>
      </div>
    </div>
  );
}

const GradientText = ({ text }: { text: string }) => {
  return (
    <div className="mb-4">
      <svg width="100%" height="30px" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              style={{ stopColor: "#ff0000", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#00ff1e", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
        <text fill="url(#grad1)" fontSize={20} x="35%" y="80%">
          {text}
        </text>
      </svg>
    </div>
  );
};
