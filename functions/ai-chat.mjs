import { createResponse, createJsonResponse } from "./utils/common.js";
import { buildResumeContext } from "./utils/resume-rag.mjs";
// import { stream } from "@netlify/functions";

export default async (event) => {
  // 兼容不同运行时字段：Netlify 本地、线上 Lambda、Edge 风格都可能不一致。
  const method =
    event?.method ||
    event?.httpMethod ||
    event?.requestContext?.http?.method ||
    "";

  // CORS 预检请求：必须尽快返回 200，否则浏览器会直接拦截。
  if (method === "OPTIONS") {
    return createResponse("", 200);
  }

  // 当前函数只支持 POST（聊天消息上行）。
  if (method !== "POST") {
    return createJsonResponse({ error: "Method Not Allowed" }, 405);
  }


  try {
    let requestBody;
    
    // 解析请求体：兼容 string body 与 stream body（不同 runtime 表现不同）。
    if (event.body) {
      if (typeof event.body === 'string') {
        // 1) body 已经是 JSON 字符串，直接 parse。
        requestBody = JSON.parse(event.body);
      } else if (event.body instanceof ReadableStream || typeof event.body.getReader === 'function') {
        // 2) body 是 ReadableStream，手动读取并转成字符串。
        const reader = event.body.getReader();
        const chunks = [];
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
        
        const bodyBuffer = Buffer.concat(chunks);
        const bodyString = bodyBuffer.toString('utf-8');
        requestBody = JSON.parse(bodyString);
      } else {
        // 3) 其他情况，仍尝试按 JSON 字符串处理。
        requestBody = JSON.parse(event.body);
      }
    } else {
      throw new Error('No request body provided');
    }

    // messages 是前端传来的完整对话历史。
    const requestMessages = Array.isArray(requestBody?.messages)
      ? requestBody.messages
      : [];
    // 取“最后一条用户消息”作为本次检索 query，避免历史对话干扰召回焦点。
    const latestUserMessage = [...requestMessages]
      .reverse()
      .find((item) => item?.role === "user" && typeof item?.content === "string");
    const userQuery = latestUserMessage?.content?.trim() || "";
    // 轻量 RAG：召回简历片段并拼入 system prompt。
    const retrievedContext = buildResumeContext(userQuery);
    const dynamicSystemPrompt = `你是人工智能助手，名字是廖声荣，英文名字是Mark。
你的回答要精准、思维严谨、简洁大气（代码场景除外）。
你正在求职，用户常是前端面试官或招聘方，请回答贴近真实工作经历。
当问题涉及经历、项目、技能、教育信息时，优先依据【简历检索片段】回答，不要编造简历之外的信息。
若简历片段不足以支持回答，请明确说明“简历未覆盖该细节”，并给出可行补充方向。
回答默认不超过200字（代码场景除外）。
输出格式使用 Markdown；可适当使用 **加粗** 突出重点（如公司名、项目名、技术栈、时间段），每次回答建议 1-3 处，避免过度加粗。

【简历检索片段】
${retrievedContext}`;

    // 继续走原有 SSE 模式，保证聊天页流式体验不变。
    const res = await fetch(
      "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer 9dbd4d83-611b-4a19-83a8-0f705bd3dbb9",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "doubao-1-5-lite-32k-250115",
          messages: [
            {
              role: "system",
              content: dynamicSystemPrompt,
            },
            ...requestMessages,
          ],
          stream: true,
        }),
      }
    );

    // 模型若未返回可读流，直接抛错让前端展示失败提示。
    if (!res.body) {
      throw new Error("No stream available");
    }

    return createResponse(res.body, 200, {
      "Content-Type": "text/event-stream",
    });

    // "NetlifyUserError: Function returned an unsupported value. Accepted types are 'Response' or 'undefined'"

  } catch (error) {
    return createJsonResponse(
      {
        error: "Internal Server Error",
        details: error.message,
      },
      500
    );
  }
};
