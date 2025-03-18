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

  // const page = parseInt(event.queryStringParameters?.page) || 1;
  // const pageSize = parseInt(event.queryStringParameters?.pageSize) || 10;

  // const startIndex = (page - 1) * pageSize;
  // const endIndex = startIndex + pageSize;

  const _data = data?.map((v, i) => ({
    ...v,
    title: "壁纸" + (i + 1),
  }));
  // const paginatedData = _data?.slice(startIndex, endIndex);

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      data: _data,
      total: _data?.length || 0,
      // page,
      // pageSize,
      event,
    }),
  };
};
