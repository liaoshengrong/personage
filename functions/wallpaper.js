// https://api.hn/acg.php
import { CORS_HEADERS } from "./utils/common";
exports.handler = async function (event, context) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: "",
    };
  }

  const res = await fetch(`https://api.hn/acg.php?zd=pc&return=jsonpro`);
  const data = await res.json();

  const page = Number(event.queryStringParameters?.page) || 1;
  const pageSize = Number(event.queryStringParameters?.pageSize) || 10;

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const _data = data?.map((v, i) => ({
    ...v,
    title: "壁纸" + (i + 1 + pageSize * (page - 1)),
  }));
  const paginatedData = _data?.slice(0, pageSize);

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      data: paginatedData,
      total: 96,
      page,
      pageSize,
    }),
  };
};
