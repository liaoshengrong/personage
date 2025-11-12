import { CORS_HEADERS, createResponse, createJsonResponse } from "./utils/common";
// import { stream } from "@netlify/functions";

export default async (event) => {

  if (event.method === "OPTIONS") {
    return createResponse("", 200);
  }

  if (event.method !== "POST") {
    return createJsonResponse({ error: "Method Not Allowed" }, 405);
  }


  try {
    let requestBody;
    
    // 解析请求体 - 处理ReadableStream
    if (event.body) {
      if (typeof event.body === 'string') {
        // 如果body已经是字符串，直接解析
        requestBody = JSON.parse(event.body);
      } else if (event.body instanceof ReadableStream || typeof event.body.getReader === 'function') {
        // 如果是ReadableStream，读取内容
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
        // 其他情况，尝试直接解析
        requestBody = JSON.parse(event.body);
      }
    } else {
      throw new Error('No request body provided');
    }

    console.log('Request body parsed:', requestBody);

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
            ...requestBody.messages,
          ],
          stream: false,
        }),
      }
    );

    // 获取完整响应数据
    const responseData = await res.json();

    console.log(responseData,'responseDataresponseData');

    const resMessages = [
      ...requestBody.messages,
      responseData.choices[0].message,
    ]
    
    
    // 返回JSON格式响应
    return createJsonResponse({messages:resMessages,code:0}, 200);

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
