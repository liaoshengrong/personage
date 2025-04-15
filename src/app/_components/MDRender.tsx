"use client";
import ReactMarkdown from "react-markdown";
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
