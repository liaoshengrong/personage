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
    
    // 解析请求体
    if (!event.body) {
      throw new Error('No request body provided');
    }
    
    try {
      // 简化请求体解析，在非stream模式下，body通常是字符串或可以直接转换
      requestBody = typeof event.body === 'string' 
        ? JSON.parse(event.body) 
        : JSON.parse(JSON.stringify(event.body));
    } catch (parseError) {
      throw new Error(`Invalid JSON in request body: ${parseError.message}`);
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
    
    // 返回JSON格式响应
    return createJsonResponse(responseData, 200);

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
