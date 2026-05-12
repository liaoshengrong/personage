"use client";
import { useState, useRef, useEffect } from "react";
import MDRender from "../_components/MDRender";
import { useMobile } from "../hooks/useMobile";
import { sendToAiChat } from "../common/api";

interface Message {
  role: "user" | "system";
  content: string;
}

// 用于“兜底加粗”的关键词清单：当模型没主动用 Markdown 加粗时，前端会做轻量强化。
const HIGHLIGHT_KEYWORDS = [
  "深圳华云中盛科技股份有限公司",
  "深圳志远融通科技",
  "中电金信软件",
  "腾讯SSV官网&admin",
  "腾讯技术公益&admin",
  "野朋友计划 小程序&admin",
  "8c Game 平台",
  "Wealth admin",
  "Wealth",
  "Ko咖啡小程序",
  "腾讯Databrain数据大脑",
  "Nextjs",
  "React Native",
  "React",
  "TypeScript",
  "Vue3",
  "Taro",
  "SSE",
  "Nestjs",
  "GraphQL",
  "BFF",
  "西南科技大学",
];

const escapeRegExp = (text: string) =>
  // 转义正则特殊字符，避免关键字中含 +、?、() 等时替换异常。
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const emphasizeAiMessage = (content: string) => {
  // 1) 空内容直接返回；
  // 2) 如果模型本身已经写了 **加粗**，不重复处理，避免视觉过重。
  if (!content || content.includes("**")) return content;

  let output = content;
  // 长词优先：先替换“React Native”再替换“React”，避免短词提前命中导致嵌套。
  const keywords = [...HIGHLIGHT_KEYWORDS].sort((a, b) => b.length - a.length);

  keywords.forEach((keyword) => {
    const pattern = new RegExp(escapeRegExp(keyword), "g");
    output = output.replace(pattern, `**${keyword}**`);
  });

  // 时间段也属于面试重点信息（如在职区间），这里统一做轻量加粗。
  output = output.replace(
    /(\d{4}\.\d{1,2}\s*-\s*(?:\d{4}\.\d{1,2}|至今))/g,
    "**$1**"
  );

  return output;
};

// const url = "https://shengrong.netlify.app/.netlify/functions/ai-chat";
const url = "http://localhost:8888/.netlify/functions/ai-chat";
// http://localhost:8888/.netlify/functions/hello

export default function ChatCom() {
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      role: "system",
      content:
        "你好，我是 Mark 的 AI 助手。你可以问我工作经历、项目细节、技术栈和教育背景。",
    },
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
      // streaming 回调里实时做“加粗兜底”，让用户在流式输出阶段也能看到重点。
      const response = await sendToAiChat({
        messages: newChatHistory,
        renderItemCallback: (s) => {
          setStreamingMessage(emphasizeAiMessage(s));
        },
        finishCallback: (s) => {
          // 完整回复入历史前再处理一次，保证最终消息和流式阶段一致。
          const finalMessage: Message = {
            role: "system",
            content: emphasizeAiMessage(s || "No response"),
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
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
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
