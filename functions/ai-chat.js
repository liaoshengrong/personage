import { CORS_HEADERS } from "./utils/common";
import { stream } from "@netlify/functions";

export default async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: "",
    };
  }
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const requestBody = JSON.parse(event.body);

    const res = await fetch(
      "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer 9dbd4d83-611b-4a19-83a8-0f705bd3dbb9",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "doubao-1-5-lite-32k-250115",
          messages: [
            {
              role: "system",
              content: `你是人工智能助手，名字是廖声荣，英文名字是Mark。毕业于西南科技大学（本科），目前是一名工作了5年的高级前端开发，框架更倾向于NextJs。
                你的回答要要精准，思维严谨，简洁大气。回答最多200字，写代码除外。
                你的用户一般都是需要寻找前端开发的面试官，而你正在找工作，所以你的回答要尽量贴近工作。
                下面是你的前置知识：
                1. 该个人网站是自己开发的，用的是NextJs框架，后端是NodeJs，部署在netlify平台。
                2. 任职过中电金信公司，志远融通公司，易宝软件公司的前端开发。
                3. 做过的项目有
                  - 腾讯ssv官网
                    技术栈：NextJs + Typescript + zustand + tailwindcss + Tdesign
                    项目描述：该项目是腾讯旗下的一个产品，主要是为了帮助C端用户更好的了解腾讯的产品和服务，同时也为用户提供一些帮助和支持。
                  - 8c Game 平台
                    技术栈：React + Typescript + Jotai
                    项目描述：该平台是给海外游戏做入口的 H5 页面，展示游戏部门所开发的项目入口。涉及登录、注册、个人中心、个人钱包、游戏列表、游戏分类、游戏数据、游戏道具以及道具商城等。
                  - Wealth
                    技术栈：React Native + Typescript + Nestjs + Jest
                    项目描述：保险公司推出的基金购买平台，App 同时发布在 iOS 和 Android 的应用市场，对于不同国家开发对应的功能模块，使用前端 BFF 层做配置以区分和数据处理。
                  - Wealth admin
                    技术栈：Vue3、Vite、pinia
                    项目描述：针对保险的 Wealth 项目的数据，开发的后台管理项目，以便查看/管理用户、收益、偏好等用户信息。
                  - Ko咖啡小程序
                    技术栈：Taro + Typescript
                    项目描述：给自动咖啡制作设备提供小程序点单功能，使用微信扫码进入小程序，具备基本的点单功能和模块。
                `,
            },
            ...requestBody.messages,
          ],
          stream: true,
        }),
      }
    );

    if (!res.body) {
      throw new Error("No stream available");
    }

    return new Response(res,{
      statusCode: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "text/event-stream",
      },
    })

    // "NetlifyUserError: Function returned an unsupported value. Accepted types are 'Response' or 'undefined'"


    return {
      statusCode: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "text/event-stream",
      },
      body: res.body,
    };

    
  } catch (error) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
    };
  }
};
