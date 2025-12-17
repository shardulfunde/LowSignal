import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp?: string;
}

const preprocessMarkdown = (s: string) => {
  if (!s) return s;
  let out = s.replace(/\u00A0/g, " ");
  out = out.replace(/\r\n/g, "\n");
  out = out.replace(/\*\*(.+?)\*\*/gs, "<strong>$1</strong>");
  out = out.replace(/\*(.+?)\*/gs, "<em>$1</em>");
  return out;
};

const ChatMessage = ({ content, isUser, timestamp }: ChatMessageProps) => {
  const processed = preprocessMarkdown(content);
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-slide-up`}>
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md"
        }`}
      >
        <div className="text-base leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({ node, inline, className, children, ...props }) {
                return inline ? (
                  <code className="bg-muted px-1 rounded text-sm" {...props}>
                    {children}
                  </code>
                ) : (
                  <pre className="bg-surface rounded-md p-2 overflow-auto">
                    <code className={className} {...props}>
                      {String(children).replace(/\n$/, "")}
                    </code>
                  </pre>
                );
              },
            }}
            className="prose prose-sm dark:prose-invert max-w-none"
          >
            {processed}
          </ReactMarkdown>
        </div>
        {timestamp && (
          <p
            className={`text-xs mt-1 ${
              isUser ? "text-primary-foreground/70" : "text-muted-foreground"
            }`}
          >
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
