const http = require("http");
const https = require("https");

const API_KEY = "sk-Mp4dXyTktalNMlxg0fE728C8Cd7946Ee9291A5169d9b9080"; // 请替换为您的 API Key
const API_BASE = "https://maas-api.cn-huabei-1.xf-yun.com/v1";
const SERVICE_ID = "xdeepseekv3";

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/chat") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const requestData = JSON.parse(body);
        console.log(requestData, "requestData");

        const messages = [{ role: "user", content: requestData.message }];

        const postData = JSON.stringify({
          model: SERVICE_ID,
          messages: messages,
          stream: false,
          temperature: 0.7,
          max_tokens: 4096,
          extra_headers: { lora_id: "0" },
          stream_options: { include_usage: true },
        });

        const apiUrl = new URL(`${API_BASE}/chat/completions`);
        const options = {
          hostname: apiUrl.hostname,
          port: apiUrl.port,
          path: apiUrl.pathname,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        };

        const apiReq = http.request(options, (apiRes) => {
          let responseBody = "";
          apiRes.on("data", (chunk) => {
            responseBody += chunk;
          });
          apiRes.on("end", () => {
            res.writeHead(200, {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
            });
            res.end(responseBody);
          });
        });

        apiReq.on("error", (error) => {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: error.message }));
        });

        apiReq.write(postData);
        apiReq.end();
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid request format" }));
      }
    });
  } else if (req.method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
