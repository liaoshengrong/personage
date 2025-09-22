import { CORS_HEADERS, createResponse, createJsonResponse } from "./utils/common";
exports.handler = async function (event, context) {
  return createJsonResponse({ message: "Hello from Lambda! 呀呀呀呀呀" });
};
