// https://api.hn/acg.php
const arr = [
  {
    code: "200",
    imgurl: "https://api.hn/acg/API.HN_ACG_5543.png?t=1742453042",
    width: 1052,
    height: 760,
  },
  {
    code: "200",
    imgurl: "https://api.hn/acg/API.HN_ACG_10797.jpg?t=1742453042",
    width: 5600,
    height: 3150,
  },
  {
    code: "200",
    imgurl: "https://api.hn/acg/API.HN_ACG_2635.jpg?t=1742453042",
    width: 2000,
    height: 2000,
  },
  {
    code: "200",
    imgurl: "https://api.hn/acg/API.HN_ACG_1161.png?t=1742453042",
    width: 2260,
    height: 3213,
  },
  {
    code: "200",
    imgurl: "https://api.hn/acg/API.HN_ACG_853.png?t=1742453042",
    width: 1000,
    height: 1000,
  },
  {
    code: "200",
    imgurl: "https://api.hn/acg/API.HN_ACG_817.jpg?t=1742453042",
    width: 3200,
    height: 1800,
  },
  {
    code: "200",
    imgurl: "https://api.hn/acg/API.HN_ACG_2091.png?t=1742453042",
    width: 4096,
    height: 2560,
  },
  {
    code: "200",
    imgurl: "https://api.hn/acg/API_ACG_0000000000000676.webp?t=1742453042",
    width: 2501,
    height: 1349,
  },
  {
    code: "200",
    imgurl: "https://api.hn/acg/API.HN_ACG_3045.png?t=1742453042",
    width: 1400,
    height: 1050,
  },
  {
    code: "200",
    imgurl: "https://api.hn/acg/API.HN_ACG_10656.jpg?t=1742453042",
    width: 1400,
    height: 1100,
  },
];
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
  // const data = await res.json();
  const data = arr;

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
