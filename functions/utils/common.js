export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// 响应工具函数
export const createResponse = (data, status = 200, headers = {}) => {
  return new Response(data, {
    status,
    headers: { ...CORS_HEADERS, ...headers },
  });
};

export const createJsonResponse = (data, status = 200, headers = {}) => {
  return createResponse(JSON.stringify(data), status, {
    "Content-Type": "application/json",
    ...headers,
  });
};
