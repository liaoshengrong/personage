import puppeteer from "puppeteer";
import { createResponse, createJsonResponse } from "./utils/common";

const launchBrowser = async () => {
  try {
    return await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  } catch (err) {
    console.error("Failed to launch bundled Chromium, error:", err);

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
        console.error(
          "[export-pdf] failed to launch Chrome at",
          executablePath,
          e
        );
      }
    }

    throw new Error(
      "无法启动浏览器：既找不到 Puppeteer 自带的 Chromium，也未能在系统中找到可用的 Chrome。"
    );
  }
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

    const browser = await launchBrowser();

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

