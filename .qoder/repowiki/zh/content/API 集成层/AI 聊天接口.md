# AI 聊天接口

<cite>
**本文档引用文件**  
- [ai-chat.js](file://functions/ai-chat.js)
- [common.js](file://functions/utils/common.js)
- [ChatCom.tsx](file://src/app/chat/ChatCom.tsx)
- [api.ts](file://src/app/common/api.ts)
</cite>

## 目录
1. [简介](#简介)
2. [请求处理机制](#请求处理机制)
3. [请求结构详解](#请求结构详解)
4. [流式响应实现原理](#流式响应实现原理)
5. [前端消费流式数据](#前端消费流式数据)
6. [实际调用示例](#实际调用示例)
7. [错误处理策略](#错误处理策略)
8. [与 useEffect 和 fetch 的集成](#与-useeffect-和-fetch-的集成)
9. [总结](#总结)

## 简介
`ai-chat.js` 是一个部署在 Netlify 平台的云函数，用于处理前端发起的 AI 聊天请求。该接口通过代理方式调用火山引擎的 AI 模型服务，并以流式响应（SSE）的形式将 AI 回复逐块返回给客户端。整个系统实现了低延迟、高响应性的对话体验，适用于多轮对话场景。

**Section sources**  
- [ai-chat.js](file://functions/ai-chat.js#L1-L10)

## 请求处理机制
该云函数仅接受 POST 请求，拒绝其他 HTTP 方法。对于 OPTIONS 预检请求，自动返回 CORS 头以支持跨域调用。所有有效请求均需携带 JSON 格式的请求体，包含 `messages` 数组作为对话上下文。

当接收到合法请求后，服务端会构造对第三方 AI 接口的代理请求，附带预设的系统提示词和用户传递的消息历史，并启用流式传输模式（`stream: true`），确保响应可以分块返回。

**Section sources**  
- [ai-chat.js](file://functions/ai-chat.js#L3-L25)

## 请求结构详解

### 请求路径
```
POST /.netlify/functions/ai-chat
```

### 请求头要求
| 请求头 | 值 |
|--------|-----|
| Content-Type | application/json |

### 请求体结构
请求体必须为 JSON 对象，包含 `messages` 字段：

```json
{
  "messages": [
    {
      "role": "user",
      "content": "你好"
    }
  ]
}
```

#### messages 数组格式
- 每个元素为一个消息对象
- 必须包含 `role` 和 `content` 字段
- `role` 可取值：`"user"`（用户）、`"system"`（系统）
- `content` 为字符串，表示消息内容

在服务端，系统会自动注入一条 `system` 角色的初始消息，包含 AI 助手的身份设定、背景知识和技术栈信息，随后拼接客户端传入的 `messages`。

**Section sources**  
- [ai-chat.js](file://functions/ai-chat.js#L27-L60)

## 流式响应实现原理
服务端通过 `@netlify/functions` 提供的 `stream` 函数创建流式处理器。当调用第三方 AI 接口时，设置 `stream: true`，并直接将返回的 `response.body` 作为函数响应体。

响应头中设置：
```http
Content-Type: text/event-stream
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

这使得浏览器能够以 `text/event-stream` 格式接收持续的数据流，每一块数据以 `data: {chunk}` 形式发送，直到收到 `[DONE]` 标志结束。

**Section sources**  
- [ai-chat.js](file://functions/ai-chat.js#L66-L75)
- [common.js](file://functions/utils/common.js#L1-L6)

## 前端消费流式数据
前端通过 `fetch` API 发起请求，并使用 `ReadableStream` 的 `getReader()` 方法逐块读取响应数据。每个数据块经 `TextDecoder` 解码后按行解析，提取以 `data: ` 开头的内容，JSON 解析后获取 `delta.content` 字段，逐步拼接并实时更新界面显示。

关键步骤包括：
1. 创建 `reader = response.body.getReader()`
2. 循环调用 `reader.read()` 直到 `done: true`
3. 分割文本行，过滤 `data:` 前缀
4. 忽略 `[DONE]` 结束标记
5. 累积内容并更新状态 `setStreamingMessage`

这种方式实现了“打字机”效果，提升用户体验。

**Section sources**  
- [ChatCom.tsx](file://src/app/chat/ChatCom.tsx#L43-L87)

## 实际调用示例
在 `ChatCom.tsx` 中，通过以下方式发起请求：

```ts
const response = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: chatHistory }),
});
```

其中 `chatHistory` 是包含历史对话的数组，每次用户发送消息后都会更新该状态。流式响应过程中，使用 `streamingMessage` 状态暂存正在接收的内容，最终合并为完整回复并追加到聊天历史中。

UI 层通过 `MDRender` 组件渲染 AI 返回的 Markdown 内容，支持代码块、列表等格式化输出。

**Section sources**  
- [ChatCom.tsx](file://src/app/chat/ChatCom.tsx#L30-L42)
- [ChatCom.tsx](file://src/app/chat/ChatCom.tsx#L111-L148)

## 错误处理策略
### 后端异常
- 若 AI 接口无响应体，抛出 `"No stream available"`
- 捕获所有异常，返回 `500 Internal Server Error`
- 错误详情包含 `error.message`

### 前端异常
- 检查 `reader` 是否存在，否则提示 `"No reader available"`
- `try-catch` 包裹整个流读取过程
- 出错时向聊天历史添加错误提示：“发生错误，请重试。”
- `finally` 块中关闭加载状态

### 网络与超时
- 浏览器原生处理网络中断
- 可结合 AbortController 实现请求超时控制（当前未实现）
- 用户可手动重试发送

**Section sources**  
- [ai-chat.js](file://functions/ai-chat.js#L77-L89)
- [ChatCom.tsx](file://src/app/chat/ChatCom.tsx#L78-L86)

## 与 useEffect 和 fetch 的集成
`useEffect` 被用于监听聊天状态变化，自动滚动聊天容器到底部：

```ts
useEffect(() => {
  if (chatContainerRef.current) {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }
}, [chatHistory, isLoading, streamingMessage]);
```

此副作用确保无论新增历史消息还是流式内容更新，视图始终保持在最新位置。`fetch` 调用位于 `sendMessage` 异步函数中，与 React 状态管理紧密结合，实现完整的请求-响应-渲染闭环。

**Section sources**  
- [ChatCom.tsx](file://src/app/chat/ChatCom.tsx#L89-L109)

## 总结
`ai-chat.js` 云函数成功实现了 AI 聊天的流式响应机制，结合前端的 `fetch` 流式读取和状态管理，提供了流畅的交互体验。系统具备良好的错误处理能力和跨域支持，适合集成于各类前端应用中。通过 `useEffect` 自动化 UI 更新，确保了多轮对话的状态一致性与可视性。

**Section sources**  
- [ai-chat.js](file://functions/ai-chat.js#L1-L89)
- [ChatCom.tsx](file://src/app/chat/ChatCom.tsx#L1-L201)