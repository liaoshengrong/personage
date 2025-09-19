"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { ImageViewer, Tooltip } from "tdesign-react";
import { useState } from "react";
import Image from "next/image";

import "highlight.js/styles/atom-one-dark.css";

const Markdown = ({ content }: { content: string }) => {
  const [visible, setVisible] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");

  return (
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        className="prose prose-zinc max-w-none"
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
              // 内联代码样式 - 只用字体颜色，无背景
              // 去掉反引号
              return (
                <span
                  className="text-blue-600 font-mono text-sm font-medium"
                  {...props}
                >
                  {children}
                </span>
              );
            }
            // 代码块样式保持不变
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
            <th className="px-4 py-3 text-left text-sm font-medium text-black border-b border-black">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-black border-b border-black border-opacity-20">
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
