"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

interface MarkdownMessageProps {
  content: string;
}

/**
 * Robust Zero-Dependency Markdown Renderer for Chatbot Responses
 * Eliminates raw symbols (##, **, ---, [url]) and renders rich formatted UI.
 */
export function MarkdownMessage({ content }: MarkdownMessageProps) {
  const blocks = splitIntoBlocks(content);

  return (
    <div className="space-y-3 text-sm leading-relaxed text-slate-200">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}

// ─── Block Parsing ──────────────────────────────────────────────────────────

type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "hr" }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "list"; items: string[]; ordered: boolean }
  | { type: "paragraph"; text: string };

function splitIntoBlocks(text: string): Block[] {
  const lines = text.split("\n");
  const blocks: Block[] = [];
  let currentList: { items: string[]; ordered: boolean } | null = null;
  let currentTableLines: string[] = [];

  const flushList = () => {
    if (currentList) {
      blocks.push({
        type: "list",
        items: currentList.items,
        ordered: currentList.ordered
      });
      currentList = null;
    }
  };

  const flushTable = () => {
    if (currentTableLines.length >= 2) {
      const parsed = parseTableLines(currentTableLines);
      if (parsed) blocks.push(parsed);
      currentTableLines = [];
    } else if (currentTableLines.length > 0) {
      currentTableLines.forEach((l) => blocks.push({ type: "paragraph", text: l }));
      currentTableLines = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i] ?? "";
    const line = rawLine.trim();

    // Check Table line
    if (line.startsWith("|") && line.endsWith("|")) {
      flushList();
      currentTableLines.push(line);
      continue;
    } else {
      flushTable();
    }

    // Horizontal rule: --- or ***
    if (/^(\-{3,}|\*{3,})$/.test(line)) {
      flushList();
      blocks.push({ type: "hr" });
      continue;
    }

    // Headings: #, ##, ###, ####
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1]?.length || 3;
      // Clean any wrapped ** inside the heading
      const cleanText = (headingMatch[2] || "").replace(/^\*\*|\*\*$/g, "").trim();
      blocks.push({ type: "heading", level, text: cleanText });
      continue;
    }

    // Bullet list item: - item or * item
    const bulletMatch = line.match(/^[\*\-]\s+(.+)$/);
    if (bulletMatch && bulletMatch[1]) {
      if (!currentList || currentList.ordered) {
        flushList();
        currentList = { items: [], ordered: false };
      }
      currentList.items.push(bulletMatch[1]);
      continue;
    }

    // Numbered list item: 1. item
    const numMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (numMatch && numMatch[2]) {
      if (!currentList || !currentList.ordered) {
        flushList();
        currentList = { items: [], ordered: true };
      }
      currentList.items.push(numMatch[2]);
      continue;
    }

    // Empty line
    if (!line) {
      flushList();
      continue;
    }

    // Regular paragraph line
    flushList();
    blocks.push({ type: "paragraph", text: line });
  }

  flushList();
  flushTable();

  return blocks;
}

function parseTableLines(lines: string[]): Block | null {
  if (lines.length < 2) return null;
  const parseRow = (rowStr: string) =>
    rowStr
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());

  const headers = parseRow(lines[0] || "");
  const rows: string[][] = [];

  // Skip lines[1] if it's the separator | :--- | :---: |
  const startIndex = lines[1]?.includes("---") ? 2 : 1;

  for (let i = startIndex; i < lines.length; i++) {
    const r = lines[i];
    if (r) {
      rows.push(parseRow(r));
    }
  }

  return { type: "table", headers, rows };
}

// ─── Block Rendering ────────────────────────────────────────────────────────

function renderBlock(block: Block, key: number): React.ReactNode {
  switch (block.type) {
    case "heading": {
      // Clean any remaining markdown markup
      const content = parseInline(block.text);
      if (block.level === 1 || block.level === 2) {
        return (
          <h2
            key={key}
            className="text-lg font-bold text-white tracking-tight mt-4 mb-2 flex items-center gap-2 border-b border-white/10 pb-1.5"
          >
            {content}
          </h2>
        );
      }
      if (block.level === 3) {
        return (
          <h3
            key={key}
            className="text-base font-bold text-brand-300 mt-3 mb-1.5 flex items-center gap-2"
          >
            {content}
          </h3>
        );
      }
      return (
        <h4
          key={key}
          className="text-sm font-semibold text-teal-300 uppercase tracking-wider mt-2.5 mb-1"
        >
          {content}
        </h4>
      );
    }

    case "hr":
      return <div key={key} className="h-px bg-white/10 my-3" />;

    case "list": {
      if (block.ordered) {
        return (
          <ol key={key} className="space-y-1.5 my-2 pl-2">
            {block.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                <span className="font-mono text-xs font-bold text-brand-400 shrink-0 w-5 h-5 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                <span className="flex-1">{parseInline(item)}</span>
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ul key={key} className="space-y-1.5 my-2 pl-1">
          {block.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0 mt-2" />
              <span className="flex-1">{parseInline(item)}</span>
            </li>
          ))}
        </ul>
      );
    }

    case "table":
      return (
        <div key={key} className="overflow-x-auto my-3 rounded-2xl border border-white/10 bg-slate-900/60 shadow-inner">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                {block.headers.map((h, i) => (
                  <th key={i} className="py-2.5 px-3.5 font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                    {parseInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {block.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="py-2.5 px-3.5 text-slate-300">
                      {parseInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "paragraph": {
      // Check if it's an italic footer line like *Would you like me to...*
      const trimmed = block.text.trim();
      if (trimmed.startsWith("*") && trimmed.endsWith("*") && !trimmed.slice(1, -1).includes("*")) {
        return (
          <p key={key} className="text-xs italic text-teal-300/90 pt-1">
            {trimmed.slice(1, -1)}
          </p>
        );
      }
      return (
        <p key={key} className="text-xs sm:text-sm leading-relaxed text-slate-200">
          {parseInline(block.text)}
        </p>
      );
    }
  }
}

// ─── Inline Markdown Parsing ────────────────────────────────────────────────

/**
 * Parse bold (**text**), links ([label](url)), inline code (`code`), and italics (*text*)
 */
function parseInline(text: string): React.ReactNode {
  if (!text) return null;

  // Split tokens using regex for [text](url), **bold**, `code`, *italic*
  const pattern = /(\[[^\]]+\]\([^\)]+\)|\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    if (!part) return null;

    // Link: [label](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch && linkMatch[1] && linkMatch[2]) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-brand-400 hover:text-brand-300 underline decoration-brand-500/50 hover:decoration-brand-300 transition-colors"
        >
          <span>{linkMatch[1]}</span>
          <ExternalLink className="w-3 h-3 inline shrink-0" />
        </a>
      );
    }

    // Bold: **text**
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      const boldContent = part.slice(2, -2);
      return (
        <strong key={index} className="font-semibold text-slate-50 text-brand-200">
          {boldContent}
        </strong>
      );
    }

    // Inline Code: `code`
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded bg-slate-800 text-teal-300 font-mono text-[11px] border border-white/10"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Italic: *text*
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return (
        <em key={index} className="italic text-slate-300">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Clean stray symbols if any
    const cleaned = part.replace(/^#+\s*/g, "");
    return cleaned;
  });
}
