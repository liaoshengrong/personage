---
name: add-article-workflow
description: >
  Adds or reorganizes blog articles in the personage project. Use when the user wants to create, move, or retag a post:
  create Markdown under public/files, choose the right folder/tag, and update src/config/data.json to keep the homepage
  and detail pages in sync.
---

# Add Article Workflow for personage

本 Skill 约定了在 `personage` 项目里**新增 / 调整一篇博客文章**时，AI 应该遵循的固定流程，避免只写了 Markdown 却忘记同步元数据，或者 tag / 路径对不上。

目标场景：

- 用户说「帮我写一篇文章并接入博客」
- 用户说「把这篇文章移动到新的分类 / 文件夹里」
- 用户说「新建一个专题，比如 AI，文章也要能在首页列表里看到」

## 总体原则

- **一篇文章 = 一个 Markdown 文件 + 一条 data.json 元数据**
- Markdown 文件放在 `public/files/{分类}` 目录下。
- `src/config/data.json` 只存 **列表信息**：`tag`、`title`、`desc`、`date`，不存正文。
- `title` 与 Markdown 文件名（不含 `.md`）保持一致，方便人类维护。
- `tag` 与文件夹名强相关，例如：
  - `public/files/Browser` → `tag: "Browser"`
  - `public/files/engineer` → `tag: "engineer"`
  - `public/files/AI` → `tag: "AI"`

## 步骤一：确定分类与文件路径

1. 根据用户描述判断文章属于哪个分类：
   - 浏览器相关 → `Browser`
   - 工程化 / 构建 / 自动化 → `engineer`
   - Taro / 小程序 → `Taro`
   - Ajax / 网络相关 → `ajax`
   - TypeScript → `TS`
   - 通用前端 / 心得 → `general`
   - AI 相关 → `AI`
   - 如确实不符合任何现有分类，再考虑新建目录，但要让 `tag` 与目录名对应。
2. 构造 Markdown 路径：
   - 目录：`public/files/{tag}`
   - 文件名：`{title}.md`
   - 确保文件名与 `data.json` 中的 `title` 一致。

## 步骤二：创建 Markdown 文章

创建新文件：`public/files/{tag}/{title}.md`，写入正文内容。

风格约定（参考现有文章）：

- 使用一级标题作为文章标题。
- 适度使用 emoji + 小标题（`##`、`###`）增强可读性。
- 开头用 1–3 行简短导语说明这篇文章在解决什么问题。
- 尽量用列表和小节表达结构，少用大段长文。

示例（结构示意）：

```markdown
# 文章主标题

> 一句话说明这篇文章要解决什么问题。

## 小节一

正文...

## 小节二

更多内容...
```

## 步骤三：更新 src/config/data.json

当新增或移动文章时，**必须同步更新** `src/config/data.json`，保持文章列表正确。

1. 打开 `src/config/data.json`，它是一个数组，每个元素形如：

   ```json
   {
     "tag": "Browser",
     "desc": "浏览器对于文件的获取方式",
     "date": "2022/6/21",
     "title": "浏览器缓存"
   }
   ```

2. 为新文章追加一条记录，字段规则：
   - `tag`：与选择的分类一致（如 `AI`）。
   - `title`：与 Markdown 文件名（去掉 `.md`）完全一致。
   - `desc`：1 句简短中文描述，语气可以轻松一点，但信息密度要高。
   - `date`：使用字符串格式 `YYYY/M/D` 或 `YYYY/MM/DD`，与现有数据风格一致。
3. **插入位置建议**：按日期倒序，大部分情况下将新文章插入到数组靠前位置，以便在列表页靠前展示。

### 移动或改分类的情况

如果只是把文章移动到新分类（例如从 `general` 移到 `AI`）：

1. 移动 Markdown 文件到新目录。
2. 更新 `data.json` 中对应 `title` 的那一条，将 `tag` 改为新分类（例如改为 `"AI"`）。

在不修改标题的前提下，`title` 一般不需要变。

## 步骤四：自检与约束

在完成上述修改后，AI 在回复用户前应自检以下内容：

- 确认：
  - Markdown 文件路径存在，并与 `title` 对应。
  - `data.json` 中新增或修改的条目 JSON 结构合法（逗号、引号等无误）。
  - `tag`、目录名、文件真实位置三者一致。
- 不要：
  - 擅自重排 `data.json` 的所有条目顺序，只在需要的地方插入或修改。
  - 修改与当前任务无关的文章条目。

## 何时不要直接改 data.json

如果用户特别说明「我会用 Excel（datalist.xlsx）来驱动，不要直接改 data.json」，则：

- 遵从用户指令，只创建 / 移动 Markdown 文件。
- 提醒用户自行通过 XLSX → JSON 的脚本刷新 `data.json`。

在用户没有特别说明的前提下，可以按本 Skill 直接编辑 `src/config/data.json`，这是本仓库目前的常用工作流。
