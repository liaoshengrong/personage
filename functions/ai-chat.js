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

    const stream = response.body;
    if (!stream) {
      throw new Error("No stream available");
    }

    const headers = {
      ...CORS_HEADERS,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    };

    const reader = stream.getReader();
    let responseText = "";

    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const json = JSON.parse(data);
              const content = json.choices[0]?.delta?.content || "";
              if (content) {
                responseText += content;
                controller.enqueue(`data: ${content}\n\n`);
              }
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }
        }
      }
    });

    return new Response(stream.pipeThrough(transformStream), {
      headers,
      status: 200
    });
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
};
