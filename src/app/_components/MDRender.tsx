import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

import "highlight.js/styles/atom-one-dark.css";

const Markdown = ({ content }: { content: string }) => {
  return (
    <div>
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        className="prose prose-zinc max-w-none"
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
