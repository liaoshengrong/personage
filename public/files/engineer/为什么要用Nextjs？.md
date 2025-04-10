思考这个问题前，可以先了解一下 **浏览器的渲染原理**  
了解了渲染原理后，才知道浏览器太忙啦！！它有很多活要干的

# Nextjs 有什么优势？

## SPA(单页面应用) 和 MPA(多页面应用)

咱们先简单看 2 个图

### 这是 React SPA 请求下来的 html(CSR)

<img src="/img/engineer/next-1.png" alt="1" style="max-width: 100%;">
只有一个元素 div#root，里面的内容是由浏览器执行 bundle.js 文件生成的。  
如果有很多 js 代码，浏览器的执行 js 的时间就会很长，所以为什么 SPA 讨论最多的就是 **首屏优化**  
首屏优化手段可以看下 `前端知识散点` 那篇，简单概括为文件压缩、代码分割、TreeShaking,cache,web worker。其实都是在减少js代码的执行时间，和执行体积。

### 这是 Next MPA 请求下来的 html(SSR)

<img src="/img/engineer/next-2.png" alt="1" style="max-width: 100%;">
html拿到手动的时候，dom结构就是拼接好的，浏览器负责渲染html结构就行，就算有js代码，也得等用户点击执行，或者你手动写的useEffect等触发。  这大大的在根本上就减少了js代码的执行时间。

## 支持服务端渲染（SSR）和静态站点生成（SSG）

服务端渲染（SSR）：允许在服务器上预先渲染页面，然后将 HTML 发送到客户端。这对于提升首次内容展示速度（First Contentful Paint, FCP）和搜索引擎优化（SEO）特别有用。
静态站点生成（SSG）：在构建时生成静态 HTML 文件，这些文件可以直接由 CDN 分发。对于博客、文档网站等内容更新频率较低的网站来说，这是一种非常有效的加速方式。

## 开发

Next.js 为 React 开发者提供了一个结构化的开发环境。它消除了许多配置步骤，例如设置 Webpack、Babel 等工具链。通过内置支持如热重载（Hot Reloading）、CSS 模块和 TypeScript，开发者能够更快地开始编码而不需要担心复杂的配置问题。此外，它还支持最新的 React 特性，比如 Concurrent Mode 和 Server Components，使得采用最新技术更加简单。

### 自动代码分割

Next.js 会自动分析你的应用，并仅加载当前页面所需的 JavaScript 代码。这意味着用户不会下载整个应用程序的脚本，而是只下载他们访问的特定页面所需的部分。这不仅减少了初始加载时间，也提高了用户体验，尤其是在移动网络环境中。

### 强大的优化特性

Next.js 提供了多种优化功能，包括图片优化（自动调整大小和格式转换以适应不同设备）、预取资源（Prefetching resources），以及智能的缓存策略等。这些优化措施共同作用，确保了快速的页面加载时间和良好的用户体验，同时也有助于提高搜索引擎排名。

### 你的 SPA 应用真的有这么快吗？

这不是一个 demo，这是沉淀了一年多的老项目了，这是 performance 显示的结果。
<img src="/img/engineer/next-3.png" alt="1" style="max-width: 100%;">
