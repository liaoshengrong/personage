export type StudyChatRecord = {
  id: string;
  date: string;
  trigger: string;
  question: string;
  summary: string[];
  nextActions: string[];
};

export const studyChatRecords: StudyChatRecord[] = [
  {
    id: "record-2026-04-27-002",
    date: "2026-04-27",
    trigger: "--记录",
    question:
      "什么是 CSR/SSR/RSC？“服务端组件不下发 JS”到底是什么意思？JS 从哪里来？hydration 是什么？我这个项目现在是否已经在用 RSC？",
    summary: [
      "RSC 不是“页面没有 JS”，而是“把不需要在浏览器运行的组件代码移出客户端包”；交互部分仍由 Client Component 下发 JS。",
      "CSR/SSR/RSC 的关键差异在渲染位置与交互接管成本：RSC 通过缩小客户端组件范围，通常可降低包体并减少 hydration 压力。",
      "hydration 的本质是 React 在浏览器接管服务端生成的 HTML，并绑定事件让页面变成可交互应用。",
      "时间线可记为：2020 年 React Server Components 概念公开（实验），2022-2023 随 Next.js App Router 进入主流实战。",
      "你的项目已在使用 RSC 混合架构：多个 `page.tsx` 默认为 Server Component，同时 `Navbar`、`ProgressBoard`、`ChatCom` 等为 Client Component。",
    ],
    nextActions: [
      "继续坚持“默认 Server Component，按需 use client”的拆分策略。",
      "挑选 1 个页面做 RSC/Client 边界标注，输出一份“哪些逻辑必须客户端、哪些应放服务端”的清单。",
      "为该页面记录改造前后指标（首屏耗时、客户端 JS 体积、hydration 相关体验）。",
    ],
  },
  {
    id: "record-2026-04-27-001",
    date: "2026-04-27",
    trigger: "--记录",
    question:
      "我希望直接在你这里学习，想记录我们的学习问答；当我发送 --记录 时，你就在新页面总结关于这个问题的对话信息。",
    summary: [
      "新增独立页面用于沉淀你和我的学习对话记录。",
      "记录内容采用结构化字段：提问、总结、下一步行动，方便回顾与复盘。",
      "约定后续你发送 --记录 时，我会基于当次问题追加一条记录。",
    ],
    nextActions: [
      "继续按学习清单提问。",
      "每完成一个关键问题后发送 --记录，我来沉淀本次结论。",
    ],
  },
];
