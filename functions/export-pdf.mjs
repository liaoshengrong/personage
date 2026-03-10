import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { createResponse, createJsonResponse } from "./utils/common";

const launchBrowser = async ({ origin }) => {
  const isLocalOrigin =
    origin?.startsWith("http://localhost") ||
    origin?.startsWith("http://127.0.0.1");

  // 1) 线上（非 localhost）使用 serverless Chromium
  if (!isLocalOrigin) {
    const executablePath = await chromium.executablePath();
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });
  }

  // 2) 本地（macOS/Windows）：使用系统 Chrome/Chromium
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ].filter(Boolean);

  for (const executablePath of candidates) {
    try {
      console.log("[export-pdf] trying system Chrome at", executablePath);
      return await puppeteer.launch({
        headless: true,
        executablePath,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    } catch (e) {
      console.error("[export-pdf] failed to launch Chrome at", executablePath, e);
    }
  }

  throw new Error(
    "无法启动浏览器：本地未配置可用的 Chrome。请安装 Chrome 或设置环境变量 CHROME_PATH / PUPPETEER_EXECUTABLE_PATH。"
  );
};

export default async (event) => {
  if (event.method === "OPTIONS") {
    return createResponse("", 200);
  }

  if (event.method !== "GET") {
    return createJsonResponse({ error: "Method Not Allowed" }, 405);
  }

  try {
    const rawUrl = event.rawUrl || "";
    const url = rawUrl ? new URL(rawUrl) : null;

    const origin =
      process.env.URL ||
      (url ? `${url.protocol}//${url.host}` : "https://shengrong.netlify.app");

    const nameParam = url?.searchParams.get("name") || "resume";

    const browser = await launchBrowser({ origin });

    try {
      const page = await browser.newPage();
      await page.setViewport({
        width: 1280,
        height: 720,
        deviceScaleFactor: 1,
      });
      await page.emulateMediaType("screen");

      await page.goto(`${origin}/resume?print=1`, {
        waitUntil: "networkidle0",
      });
      await page.waitForSelector("#ResumeCardContainer", { timeout: 30_000 });
      // 等待字体就绪，避免 PDF 中中文为空白
      await page.evaluate(async () => {
        // eslint-disable-next-line no-undef
        await document.fonts.ready;
      });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: "5mm",
          right: "5mm",
          bottom: "5mm",
          left: "5mm",
        },
      });

      // 直接返回二进制 Response，Netlify 支持 Web Response 对象
      return createResponse(pdfBuffer, 200, {
        "Content-Type": "application/pdf",
        "Cache-Control": "no-store",
        "X-Resume-Name": encodeURIComponent(nameParam),
      });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error("export-pdf function error:", error);
    return createJsonResponse(
      {
        error: "Internal Server Error",
        message: error.message || String(error),
      },
      500
    );
  }
};

