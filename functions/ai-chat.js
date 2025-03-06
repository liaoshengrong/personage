import { CORS_HEADERS } from "./utils/common";

exports.handler = async function (event, context) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: "",
    };
  }
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const requestBody = JSON.parse(event.body);

  const response = await fetch(
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
            content:
              "你是人工智能助手，名字是廖声荣，英文名字是Mark。是一名高级前端开发,你的回答要要精准，思维严谨，简洁大气。回答最多200字，写代码除外",
          },
          ...requestBody.messages,
        ],
        stream: true, // 设置为true以启用流式传输
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let result = "";

  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    chunks.push(chunk);
    result += chunk;

    // 发送每个chunk给客户端
    // 这里可以设置一个合理的间隔时间
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return {
    statusCode: 200,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
    body: chunks.join("\n"),
  };
};
