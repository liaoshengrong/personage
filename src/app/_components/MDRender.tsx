"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { ImageViewer, Tooltip } from "tdesign-react";
import { useState } from "react";
import Image from "next/image";

import "highlight.js/styles/atom-one-dark.css";

const Markdown = ({ content, theme }: { content: string; theme?: "dark" | "white" }) => {
  const [visible, setVisible] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");
  const className = theme === "white" ? "prose prose-invert max-w-none text-gray-100" : "prose prose-zinc max-w-none";

  return (
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        className={className}
        components={{
          img: ({ node, ...props }) => (
            <Tooltip content="点击预览图片">
              <Image
                className="max-w-full cursor-pointer hover:opacity-90 transition-opacity"
                style={props.style}
                src={props.src || ""}
                alt=""
                width={700}
                height={400}
                onClick={() => {
                  setPreviewSrc(props.src || "");
                  setVisible(true);
                }}
              />
            </Tooltip>
          ),
          code: ({ node, className, children, ...props }: any) => {
            const isInline = !className || !className.includes('language-');
            if (isInline) {
              // 内联代码样式 - 改为白色主题
              return (
                <span
                  className="text-cyan-300 font-mono text-sm font-medium bg-gray-800/50 px-1 py-0.5 rounded"
                  {...props}
                >
                  {children}
                </span>
              );
            }
            // 代码块样式 - 使用深色主题
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead>
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody>
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr>
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-100 border-b border-gray-300">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-gray-200 border-b border-gray-300 border-opacity-30">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
      <ImageViewer
        visible={visible}
        onClose={() => setVisible(false)}
        images={[previewSrc]}
        defaultIndex={0}
      />
    </div>
  );
};

export default Markdown;
