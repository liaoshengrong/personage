# Next.js 学习记录

## 核心特性

- **文件系统路由**：pages 目录下的文件自动映射为路由
- **API Routes**：在 pages/api 目录下创建 API 端点
- **预渲染**：
  - 静态生成（SSG）
  - 服务端渲染（SSR）
- **图像优化**：自动优化图片，支持 WebP 格式
- **国际化**：内置 i18n 路由支持

## 性能优化

| 技术         | 描述             | 使用场景               |
| ------------ | ---------------- | ---------------------- |
| 静态生成     | 构建时生成 HTML  | 内容不频繁变化的页面   |
| 服务端渲染   | 请求时生成 HTML  | 内容频繁变化的页面     |
| 增量静态再生 | 后台更新静态页面 | 需要定期更新的静态页面 |

```javascript
// 示例：getStaticProps
export async function getStaticProps() {
  const res = await fetch("https://api.example.com/data");
  const data = await res.json();

  return {
    props: {
      data,
    },
    revalidate: 60, // 每60秒重新生成页面
  };
}
```

## 最佳实践

1. **项目结构**

```bash
my-app/
├── components/
├── pages/
│   ├── api/
│   ├── _app.js
│   └── index.js
├── public/
├── styles/
└── utils/
```

2. **数据获取策略**

- **getStaticProps**：构建时获取数据
- **getServerSideProps**：每次请求时获取数据
- **getStaticPaths**：动态路由预生成

3. **样式方案**

- CSS Modules
- Styled JSX
- Tailwind CSS

## 常见问题

### 1. 如何处理动态路由？

```javascript
// pages/posts/[id].js
export async function getStaticPaths() {
  const paths = await getAllPostIds();
  return {
    paths,
    fallback: "blocking",
  };
}
```

### 2. 如何实现 API 路由？

```javascript
// pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: "Hello World" });
}
```

### 3. 如何进行 SEO 优化？

#### 1. 使用`next/head`组件

```javascript
import Head from "next/head";

function Page() {
  return (
    <>
      <Head>
        <title>页面标题</title>
        <meta name="description" content="页面描述" />
        <meta property="og:title" content="分享标题" />
        <meta property="og:description" content="分享描述" />
        <meta property="og:image" content="/images/share.png" />
      </Head>
      {/* 页面内容 */}
    </>
  );
}
```

#### 2. 添加 meta 标签

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        // 匹配所有路由
        source: "/(.*)",
        headers: [
          {
            // 防止页面被嵌入到iframe中
            key: "X-Frame-Options",
            value: "SAMEORIGIN", // 只允许同源网站嵌入
          },
          {
            // 防止MIME类型嗅探攻击
            key: "X-Content-Type-Options",
            value: "nosniff", // 强制浏览器使用指定的MIME类型
          },
        ],
      },
    ];
  },
};
```

#### 3. 生成 sitemap.xml

```javascript
// scripts/generate-sitemap.js
const fs = require("fs");
const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");

// 定义网站地图中的链接
const links = [
  {
    url: "/",
    changefreq: "daily", // 更新频率：每天
    priority: 1.0, // 优先级：最高
  },
  {
    url: "/about",
    changefreq: "monthly", // 更新频率：每月
    priority: 0.8, // 优先级：较高
  },
];

// 创建sitemap流
const stream = new SitemapStream({
  hostname: "https://example.com", // 网站域名
});

// 生成sitemap.xml文件
streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
  fs.writeFileSync("./public/sitemap.xml", data.toString())
);
```

#### 4. 配置 robots.txt

```text
# public/robots.txt
User-agent: *  # 适用于所有搜索引擎爬虫
Allow: /       # 允许爬取所有页面

Sitemap: https://example.com/sitemap.xml  # 指定sitemap位置
```

## 参考资源

- [Next.js 官方文档](https://nextjs.org/docs)
- [Next.js GitHub 仓库](https://github.com/vercel/next.js)
- [Awesome Next.js](https://github.com/unicodeveloper/awesome-nextjs)
