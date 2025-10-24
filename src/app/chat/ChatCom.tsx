"use client";
import { useState, useRef, useEffect } from "react";
import MDRender from "../_components/MDRender";
import { useMobile } from "../hooks/useMobile";
import { sendToAiChat } from "../common/api";

interface Message {
  role: "user" | "system";
  content: string;
}

// const url = "https://shengrong.netlify.app/.netlify/functions/ai-chat";
const url = "http://localhost:8888/.netlify/functions/ai-chat";
// http://localhost:8888/.netlify/functions/hello

export default function ChatCom() {
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { role: "system", content: "你好，我是你的AI智能助手。" },
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

      const response = await sendToAiChat({
        messages: newChatHistory,
        renderItemCallback: (s) => {
          console.log("renderItemCallback:", s);
          
          setStreamingMessage(s);
        },
        finishCallback: (s) => {
          // setStreamingMessage(s);
          const finalMessage: Message = {
            role: "system",
            content: s || "No response",
          };
          setChatHistory((prev) => [...prev, finalMessage]);
        },
      });
      
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
    <div className="flex flex-col w-full xs:h-full max-w-4xl mx-auto rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 mt-5 xs:mt-0 animate__animated animate__fadeInUp xs:rounded-none min-h-[calc(100vh-300px)] max-h-[calc(100vh-140px)] xs:max-h-full xs:flex-1">
      {/* Header with Glassmorphism Effect */}
      <div className="w-full p-6 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-600/20 backdrop-blur-sm border-b border-cyan-500/30 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-blue-400/10 to-purple-400/10 animate-pulse"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]"></div>
            <span className="text-cyan-200 font-medium">AI助手在线</span>
          </div>
          <GradientText text="个人AI模型，欢迎体验" />
          <div className="mt-2 text-sm text-cyan-300/80 font-medium">随时为您提供智能对话服务</div>
        </div>
      </div>

      {/* Chat History Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar bg-gradient-to-b from-slate-900/50 to-slate-800/30"
        style={isMobile ? {} : { maxHeight: "calc(100vh - 280px)" }}
      >
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`flex ${isUser(msg) ? "justify-end" : "justify-start"} animate__animated animate__fadeInUp`}
            style={{animationDelay: `${index * 0.1}s`}}
          >
            <div
              className={`max-w-[80%] xs:max-w-[90%] rounded-2xl px-6 py-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
                isUser(msg)
                  ? "bg-gradient-to-br from-cyan-500/90 to-blue-600/90 text-white border border-cyan-400/50 shadow-cyan-500/20 hover:shadow-cyan-500/30 rounded-br-none"
                  : "bg-gradient-to-br from-slate-800/90 to-slate-700/90 text-gray-100 border border-cyan-500/30 shadow-blue-500/10 hover:shadow-blue-500/20 rounded-bl-none"
              }`}
            >
              <div className={`mb-2 text-xs font-semibold ${
                isUser(msg) ? "text-cyan-200" : "text-blue-300"
              }`}>
                {isUser(msg) ? "您" : "AI助手"}
              </div>
              {isUser(msg) ? (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              ) : (
                <MDRender content={msg.content} theme="white" />
              )}
            </div>
          </div>
        ))}
        {streamingMessage && (
          <div className="flex justify-start animate__animated animate__fadeIn">
            <div className="max-w-[80%] xs:max-w-[90%] bg-gradient-to-br from-slate-800/90 to-slate-700/90 text-gray-100 rounded-2xl rounded-bl-none px-6 py-4 shadow-lg backdrop-blur-sm border border-cyan-500/30 shadow-blue-500/10">
              <MDRender content={streamingMessage} theme="white" />
            </div>
          </div>
        )}
        {isLoading && !streamingMessage && (
          <div className="flex justify-start mb-4 animate__animated animate__fadeIn">
            <div className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 border border-cyan-500/30 rounded-2xl px-6 py-4 backdrop-blur-sm shadow-lg shadow-blue-500/10">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-[0_0_4px_rgba(56,189,248,0.8)]"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm text-gray-300">AI正在思考中...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area with Glassmorphism */}
      <div className="p-6 border-t border-cyan-500/20 bg-gradient-to-t from-slate-900/50 to-transparent backdrop-blur-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-end space-x-4"
        >
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入您的问题，按Enter发送..."
              className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none transition-all duration-300 backdrop-blur-sm"
              rows={2}
            />
            <div className="absolute bottom-3 right-4 text-xs text-gray-400">
              按Enter发送 · Shift+Enter换行
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center transform hover:scale-105 active:scale-95 shadow-lg ${
              !message.trim() || isLoading
                ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/25 hover:shadow-cyan-500/40"
            }`}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
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
