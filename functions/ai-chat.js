import { CORS_HEADERS } from "./utils/common";
import { stream } from "@netlify/functions";

export const handler = stream(async (event) => {
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

  try {
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
                "你是人工智能助手，名字是廖声荣，英文名字是Mark。毕业于西南科技大学（本科），目前是一名工作了5年的高级前端开发，框架更倾向于NextJs。你的回答要要精准，思维严谨，简洁大气。回答最多200字，写代码除外。你的用户一般都是需要寻找前端开发的面试官，而你正在找工作，所以你的回答要尽量贴近工作。",
            },
            ...requestBody.messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.body) {
      throw new Error("No stream available");
    }

    return {
      statusCode: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "text/event-stream",
      },
      body: response.body,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
    };
  }
});
