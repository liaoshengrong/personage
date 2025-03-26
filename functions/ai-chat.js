import { CORS_HEADERS } from "./utils/common";

exports.handler = async function (event, context) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        ...CORS_HEADERS,
        "Access-Control-Allow-Origin": "*", // 确保允许所有来源
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
      },
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
                "你是人工智能助手，名字是廖声荣，英文名字是Mark。是一名高级前端开发,你的回答要要精准，思维严谨，简洁大气。回答最多200字，写代码除外",
            },
            ...requestBody.messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      const errorBody = {
        error: `Upstream service error: ${response.statusText}`,
      };
      if (
        event.headers.Accept &&
        event.headers.Accept.includes("application/json")
      ) {
        return {
          statusCode: response.status,
          headers: CORS_HEADERS,
          body: JSON.stringify(errorBody),
        };
      } else {
        return {
          statusCode: response.status,
          headers: CORS_HEADERS,
          body: `data: ${JSON.stringify(errorBody)}\n\n`,
        };
      }
    }

    if (!response.body) {
      const errorBody = { error: "Streaming not supported" };
      if (
        event.headers.Accept &&
        event.headers.Accept.includes("application/json")
      ) {
        return {
          statusCode: 500,
          headers: CORS_HEADERS,
          body: JSON.stringify(errorBody),
        };
      } else {
        return {
          statusCode: 500,
          headers: CORS_HEADERS,
          body: `data: ${JSON.stringify(errorBody)}\n\n`,
        };
      }
    }

    return {
      statusCode: 200,
      headers: {
        ...CORS_HEADERS,
        "Access-Control-Allow-Origin": "*", // 确保允许所有来源
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
      body: response.body,
    };
  } catch (error) {
    console.error("Error handling request:", error); // 添加日志记录
    const errorBody = {
      error: "Internal Server Error",
      details: error.message,
    };
    if (
      event.headers.Accept &&
      event.headers.Accept.includes("application/json")
    ) {
      return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify(errorBody),
      };
    } else {
      return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: `data: ${JSON.stringify(errorBody)}\n\n`,
      };
    }
  }
};
