// https://api.hn/acg.php
import { CORS_HEADERS } from "./utils/common";
exports.handler = async function (event, context) {
  const requestBody = JSON.parse(event.body);

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: "",
    };
  }

  const res = await fetch(`https://api.hn/acg.php?zd=pc&return=jsonpro`);
  const data = await res.json();

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      data: data.map((v, i) => ({
        ...v,
        title: "壁纸" + (i + 1),
      })),
      requestBody,
    }),
  };
};
