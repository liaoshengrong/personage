import { CORS_HEADERS } from "./utils/common";
exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({ message: "Hello from Lambda! 呀呀呀呀呀" }),
  };
};
