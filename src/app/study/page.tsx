import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../_components/Navbar";
import PageContainer from "../_components/PageContainer";
import ProgressBoard from "./_components/ProgressBoard";

export const metadata: Metadata = {
  title: "前端学习计划",
  description:
    "面向 AI Native 前端的 12 周学习计划，覆盖 Next.js 深水区、AI 应用工程化、可观测性与测试体系建设。",
};

type Phase = {
  id: string;
  title: string;
  weeks: string;
  focus: string;
  goals: string[];
  outputs: string[];
};

type WeeklyTask = {
  week: string;
  topic: string;
  tasks: string[];
  deliverable: string;
};

const phases: Phase[] = [
  {
    id: "P1",
    title: "Next.js 深水区",
    weeks: "第 1-3 周",
    focus: "App Router / RSC / Server Actions / 缓存策略",
    goals: [
      "理解 RSC 与 Client Component 边界和性能影响",
      "掌握 fetch cache、revalidate、tag 失效策略",
      "做出 1 个可复用的 SSR + Streaming 页面模板",
    ],
    outputs: [
      "技术笔记 3 篇（每篇包含原理 + 代码案例）",
      "1 个可落地页面模板（含错误态、空态、加载态）",
    ],
  },
  {
    id: "P2",
    title: "AI 应用工程化",
    weeks: "第 4-7 周",
    focus: "SSE 流式 / Tool Calling / RAG / 成本与延迟优化",
    goals: [
      "构建可上线 AI 功能闭环（鉴权、限流、降级、重试）",
      "实现多轮会话记忆与工具调用流程",
      "形成 Prompt 与上下文注入的标准模板",
    ],
    outputs: [
      "1 个 AI 功能 Demo（支持流式输出与错误恢复）",
      "1 份 AI 能力设计文档（协议、状态机、降级策略）",
    ],
  },
  {
    id: "P3",
    title: "可观测性与稳定性",
    weeks: "第 8-10 周",
    focus: "Sentry / OpenTelemetry / Web Vitals / 发布质量门禁",
    goals: [
      "打通前端错误、接口错误、性能指标的统一追踪",
      "建立核心路径的监控与告警阈值",
      "形成可复用的发布前检查清单",
    ],
    outputs: [
      "监控仪表盘 1 套（性能 + 错误 + 业务埋点）",
      "上线质检清单 1 份（可直接用于项目发布）",
    ],
  },
  {
    id: "P4",
    title: "测试体系升级",
    weeks: "第 11-12 周",
    focus: "Playwright E2E / 合约测试 / 冒烟发布",
    goals: [
      "覆盖 AI 核心路径与关键交互路径",
      "将测试接入 CI，确保合并前自动回归",
      "沉淀可复用测试模板，降低后续维护成本",
    ],
    outputs: [
      "关键流程 E2E 用例 >= 8 条",
      "CI 自动化测试流水线 1 条（含失败回滚建议）",
    ],
  },
];

const weeklyPlan: WeeklyTask[] = [
  {
    week: "W1",
    topic: "RSC 与渲染模型",
    tasks: [
      "对比 CSR/SSR/RSC 的渲染链路并写实验代码",
      "梳理你现有项目中可迁移到 RSC 的模块",
      "产出一篇《RSC 迁移清单》",
    ],
    deliverable: "完成 1 个页面的 RSC 改造并记录前后指标",
  },
  {
    week: "W2",
    topic: "缓存与失效策略",
    tasks: [
      "实践 `revalidate`、`revalidateTag`、`unstable_cache`",
      "为 API 设计分层缓存策略（静态、半静态、实时）",
      "补齐错误态、超时态、重试逻辑",
    ],
    deliverable: "完成缓存策略图和示例仓库",
  },
  {
    week: "W3",
    topic: "Server Actions 与表单链路",
    tasks: [
      "实现包含校验、提交、错误提示的完整表单",
      "比较 Route Handler 与 Server Actions 的边界",
      "输出一份团队可复用表单规范",
    ],
    deliverable: "可复用 Server Action 表单模板",
  },
  {
    week: "W4",
    topic: "AI SSE 状态机",
    tasks: [
      "设计流式响应状态机：pending/streaming/done/error",
      "实现消息合并渲染与中断恢复",
      "统一消息协议和前端消费逻辑",
    ],
    deliverable: "AI 聊天流式组件（含异常恢复）",
  },
  {
    week: "W5",
    topic: "Tool Calling 与上下文治理",
    tasks: [
      "定义工具调用协议（参数校验、超时、重试）",
      "实现工具执行日志与结果追踪",
      "加入上下文裁剪和 token 成本统计",
    ],
    deliverable: "工具调用链路 Demo + 成本看板",
  },
  {
    week: "W6",
    topic: "RAG 与检索增强",
    tasks: [
      "完成文档切片策略与召回评估",
      "对比关键词召回与向量召回表现",
      "为答案增加可追溯引用来源",
    ],
    deliverable: "RAG 方案报告（准确率、时延、成本）",
  },
  {
    week: "W7",
    topic: "AI 能力上线化",
    tasks: [
      "加入限流、熔断、降级策略",
      "设计用户级风控策略与权限模型",
      "完善失败重试与兜底文案",
    ],
    deliverable: "可上线 AI 模块（含应急预案）",
  },
  {
    week: "W8",
    topic: "前端可观测性",
    tasks: [
      "接入错误上报并定义 error taxonomy",
      "补齐核心业务事件埋点",
      "建立错误归因路径（页面、接口、用户动作）",
    ],
    deliverable: "错误监控仪表盘 + 告警规则",
  },
  {
    week: "W9",
    topic: "性能指标体系",
    tasks: [
      "监控 LCP、CLS、INP 并按页面拆解",
      "建立首屏性能预算和报警阈值",
      "验证优化项真实收益，避免伪优化",
    ],
    deliverable: "性能周报模板 + 优化回归机制",
  },
  {
    week: "W10",
    topic: "发布质量门禁",
    tasks: [
      "整理上线前检查项（功能、性能、监控、回滚）",
      "落地冒烟脚本并绑定发布流程",
      "对一次真实发布做复盘",
    ],
    deliverable: "发布门禁 checklist + 自动化脚本",
  },
  {
    week: "W11",
    topic: "E2E 关键链路",
    tasks: [
      "覆盖登录、搜索、AI 对话、管理后台核心路径",
      "为 flaky case 建立重跑和隔离策略",
      "统一测试数据准备和回收",
    ],
    deliverable: "稳定 E2E 套件（通过率 >= 95%）",
  },
  {
    week: "W12",
    topic: "求职/晋升作品集打包",
    tasks: [
      "整理 2 个最能体现价值的项目案例",
      "每个案例补齐问题、方案、指标、复盘",
      "准备 10 个高频面试问题的标准化回答",
    ],
    deliverable: "作品集页面 + 面试话术文档",
  },
];

const dailyTemplate = [
  "60 分钟：原理学习（官方文档 + 实验）",
  "90 分钟：编码实现（必须可运行）",
  "30 分钟：输出笔记（今日结论、踩坑、指标）",
  "20 分钟：回顾昨日 TODO 并调整节奏",
];

const weeklyReview = [
  "本周最有价值的 3 个结论是什么？",
  "哪些优化是“感觉更好”但指标无提升？",
  "本周最大的阻塞是什么？下周如何规避？",
  "计划完成率是多少？原因是高估还是低估？",
];

const successMetrics = [
  "12 周完成率 >= 85%",
  "至少产出 8 篇高质量技术笔记",
  "至少 2 个可展示的完整项目案例",
  "AI 模块具备真实线上可用性（监控 + 降级 + 回滚）",
  "形成一套可复用的个人开发流程（需求 -> 实施 -> 测试 -> 发布）",
];

const StudyPage = () => {
  return (
    <PageContainer className="bg-gradient-to-br from-slate-50 via-white to-indigo-50 min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 pt-4 sm:pt-6">
        <section className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-8">
          <p className="text-xs sm:text-sm text-indigo-600 font-semibold tracking-wide">
            FRONTEND GROWTH ROADMAP
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
            AI Native 前端学习计划（12 周）
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-7">
            这个计划面向你当前的能力基础，目标不是“多学几个名词”，而是把能力升级为可交付、可上线、可复用。
            学习过程遵循“原理理解 + 项目落地 + 指标验证 + 复盘沉淀”的闭环，每周都有明确产出。
          </p>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
              <p className="text-xs text-indigo-500">总周期</p>
              <p className="mt-1 font-semibold text-indigo-700">12 周</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-xs text-emerald-500">每周投入</p>
              <p className="mt-1 font-semibold text-emerald-700">12-15 小时</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-xs text-amber-500">核心目标</p>
              <p className="mt-1 font-semibold text-amber-700">
                从高级前端到 AI 工程化前端
              </p>
            </div>
          </div>
          <div className="mt-5">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/study-log"
                className="inline-flex items-center rounded-lg border border-cyan-200 bg-cyan-50 text-cyan-700 text-sm px-3 py-2 hover:bg-cyan-100 transition-colors"
              >
                查看学习对话记录页
              </Link>
              <Link
                href="/study/cache-lab"
                className="inline-flex items-center rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 text-sm px-3 py-2 hover:bg-indigo-100 transition-colors"
              >
                打开缓存实验室 Demo
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">
            阶段规划
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {phases.map((phase) => (
              <article
                key={phase.id}
                className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1">
                    {phase.id}
                  </span>
                  <span className="text-xs text-slate-500">{phase.weeks}</span>
                </div>
                <h3 className="mt-3 text-base sm:text-lg font-semibold text-slate-900">
                  {phase.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{phase.focus}</p>
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-800">阶段目标</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                    {phase.goals.map((goal) => (
                      <li key={goal}>- {goal}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-800">阶段产出</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                    {phase.outputs.map((output) => (
                      <li key={output}>- {output}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">
            每周执行清单
          </h2>
          <div className="space-y-3">
            {weeklyPlan.map((item) => (
              <article
                key={item.week}
                className="rounded-xl bg-white border border-slate-100 shadow-sm p-4 sm:p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="text-base font-semibold text-slate-900">
                    {item.week} · {item.topic}
                  </h3>
                  <span className="text-xs inline-flex w-fit rounded-full border border-slate-200 px-2.5 py-1 text-slate-500">
                    Weekly Sprint
                  </span>
                </div>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                  {item.tasks.map((task) => (
                    <li key={task}>- {task}</li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg p-3">
                  本周交付：{item.deliverable}
                </p>
              </article>
            ))}
          </div>
        </section>

        <ProgressBoard
          items={weeklyPlan.map((item) => ({
            week: item.week,
            topic: item.topic,
            deliverable: item.deliverable,
          }))}
        />

        <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <article className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
            <h2 className="text-lg font-semibold text-slate-900">每日节奏模板</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {dailyTemplate.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
            <h2 className="text-lg font-semibold text-slate-900">每周复盘模板</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {weeklyReview.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mt-8 rounded-2xl bg-slate-900 text-slate-100 p-5 sm:p-6 shadow-lg">
          <h2 className="text-lg sm:text-xl font-semibold">最终验收标准（12 周后）</h2>
          <ul className="mt-3 space-y-2 text-sm sm:text-base text-slate-200">
            {successMetrics.map((metric) => (
              <li key={metric}>- {metric}</li>
            ))}
          </ul>
        </section>
      </main>
    </PageContainer>
  );
};

export default StudyPage;
