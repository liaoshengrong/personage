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

    if (!response.body) {
      throw new Error("No stream available");
    }

    const headers = {
      ...CORS_HEADERS,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    };

    const reader = response.body.getReader();
    const encoder = new TextEncoder();
    let responseText = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = new TextDecoder().decode(value);
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
                    controller.enqueue(encoder.encode(`data: ${content}\n\n`));
                  }
                } catch (error) {
                  console.error("Error parsing JSON:", error);
                }
              }
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers,
      status: 200,
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
