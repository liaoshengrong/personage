"use client";
import { useState, useRef, useEffect } from "react";
import MDRender from "../_components/MDRender";
import { useMobile } from "../hooks/useMobile";

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
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      if (e.shiftKey || e.altKey) {
        // 如果按下了 Shift 或 Alt 键，则允许换行
        return;
      }
      e.preventDefault(); // 阻止默认的换行行为
      sendMessage(); // 调用发送消息的函数
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading, streamingMessage]);
  const isMobile = useMobile();
  const isUser = (item: Message) => item.role === "user";

  return (
    <div className="flex flex-col w-full xs:h-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg mt-5 xs:mt-0 animate__animated animate__fadeInUp xs:rounded-none min-h-[calc(100vh-300px)] max-h-[calc(100vh-140px)] xs:max-h-full xs:flex-1">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl xs:rounded-none">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-medium">AI 助手在线</span>
          </div>
        </div>
        <div className="mt-2 text-center">
          <GradientText text="个人AI大模型，欢迎体验" />
        </div>
      </div>

      {/* 聊天历史 */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar bg-gray-50"
        style={isMobile ? {} : { maxHeight: "calc(100vh - 280px)" }}
      >
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`flex ${isUser(msg) ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] xs:max-w-[90%] rounded-2xl px-4 py-3 shadow-sm ${
                isUser(msg)
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
              }`}
            >
              {isUser(msg) ? (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              ) : (
                <MDRender content={msg.content} />
              )}
            </div>
          </div>
        ))}
        {streamingMessage && (
          <div className="flex justify-start">
            <div className="max-w-[80%] xs:max-w-[90%] bg-white text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-gray-100">
              <MDRender content={streamingMessage} />
            </div>
          </div>
        )}
        {isLoading && !streamingMessage && (
          <div className="flex justify-center py-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        )}
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl xs:rounded-none">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-end space-x-2"
        >
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="有问题尽管问我，按回车键发送..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition duration-200"
              rows={2}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              Enter 发送 · Shift+Enter 换行
            </div>
          </div>
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={`px-5 py-3 rounded-xl font-medium transition duration-200 flex items-center justify-center ${
              !message.trim() || isLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            }`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

const GradientText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <div className={`flex justify-center ${className}`}>
      <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        {text}
      </h2>
    </div>
  );
};



const GradientTextOrigin = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <div className={`mb-4 xs:mb-5 flex justify-center ${className}`}>
      <svg
        height="30px"
        preserveAspectRatio="xMidYMid meet"
        className="w-[217px]"
      >
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
        <text fill="url(#grad1)" fontSize={20} y="80%">
          {text}
        </text>
      </svg>
    </div>
  );
};
