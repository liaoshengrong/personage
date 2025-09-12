const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/stream") {
    // 设置CORS头信息
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });

    const intervalId = setInterval(() => {
      const now = new Date();
      res.write(`data: ${now.toISOString()}\n\n`);
    }, 1000);

    req.on("close", () => {
      clearInterval(intervalId);
      res.end();
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
