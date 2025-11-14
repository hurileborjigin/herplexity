"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import * as prismStyles from "react-syntax-highlighter/dist/esm/styles/prism";

export default function LLMMarkdown({ content }) {
  return (
    <div className="w-full flex justify-center">
      <div
        className="
          max-w-3xl w-full 
          bg-[#f5f5f5] 
          rounded-xl 
          p-6 
          shadow-xl 
          relative 
          leading-7 
          chatgpt-response
        "
      >
        {/* Left green bar like ChatGPT */}
        <div className="absolute top-0 left-0 h-full w-1 rounded-l-xl" />

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            // Code blocks
            code({ inline, className, children, ...props }) {
              const language = /language-(\w+)/.exec(className || "");
              const codeString = String(children).replace(/\n$/, "");

              if (inline) {
                return (
                  <code className="bg-gray-800 px-1.5 py-0.5 rounded text-sm">
                    {children}
                  </code>
                );
              }

              return (
                <div className="relative my-4">
                  <SyntaxHighlighter
                    style={prismStyles.oneDark}
                    language={language ? language[1] : "text"}
                    PreTag="div"
                    className="rounded-lg shadow-lg"
                    {...props}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              );
            },

            // Headings
            h1: ({ children }) => (
              <h1 className="text-2xl mt-6 mb-3 font-semibold">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl mt-5 mb-3 font-semibold">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg mt-4 mb-2 font-semibold">{children}</h3>
            ),

            // Bullet lists spacing
            ul: ({ children }) => (
              <ul className="list-disc ml-6 space-y-1">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal ml-6 space-y-1">{children}</ol>
            ),

            // Blockquotes → Beautiful callout blocks
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-gray-500 pl-4 my-4 italic text-gray-300">
                {children}
              </blockquote>
            ),

            // Tables
            table: ({ children }) => (
              <table className="border border-gray-700 my-4">{children}</table>
            ),
            th: ({ children }) => (
              <th className="border border-gray-600 bg-gray-800 px-3 py-2">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-600 px-3 py-2">{children}</td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
