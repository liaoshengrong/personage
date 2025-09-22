const isDev = process.env.NODE_ENV === "development";
// 根据环境动态切换 API 地址
const getBaseUrl = () => {
  // 开发环境
  if (isDev) {
    return "http://localhost:8200";
  }
  // 生产环境
  return "https://shengrong.netlify.app";
};

const base = isDev ? "http://localhost:8200" : "https://shengrong.netlify.app";
export const getDetail = async (tag: string, title: string) => {
  const res = await fetch(`${base}/files/${tag}/${title}.md`);
  const data = await res.text();

  return data;
};

const netlifyBase = isDev
  ? "http://localhost:8888"
  : "https://shengrong.netlify.app";

interface SendToAiChatProps {
  messages: any[];
  renderItemCallback: (s: string) => void;
  finishCallback?: (s: string) => void;
}
export const sendToAiChat = async ({
  messages,
  renderItemCallback,
  finishCallback,
}: SendToAiChatProps) => {
  const response = await fetch(`${netlifyBase}/.netlify/functions/ai-chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No reader available");

  let fullResponse = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    console.log("Read chunk:", done, value);

    if (done) break;

    const text = new TextDecoder().decode(value);
    buffer += text;
    console.log("Received chunk:", text);

    // 处理完整的SSE消息
    const lines = buffer.split("\n");
    buffer = lines.pop() || ""; // 保留最后一行不完整的数据

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const content = line.slice(6);
        if (content === "[DONE]") continue;

        try {
          const msg = JSON.parse(content);
          const deltaContent = msg.choices?.[0]?.delta?.content || "";
          fullResponse += deltaContent;

          // 立即更新UI，实现真正的流式效果
          renderItemCallback(fullResponse);
        } catch (e) {
          console.warn("Failed to parse SSE data:", content);
        }
      }
    }
  }
  finishCallback?.(fullResponse);
  return response;
};
