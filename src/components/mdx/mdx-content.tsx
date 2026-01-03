"use client";

import * as runtime from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { Callout } from "@/components/mdx/callout";
import { YouTube } from "@/components/mdx/youtube";

const sharedComponents = {
  Image,
  Callout,
  YouTube,
};

// For velite pre-compiled MDX
const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

interface MDXContentProps {
  code: string;
}

export function MDXContent({ code }: MDXContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const Component = useMDXComponent(code);

  useEffect(() => {
    if (!containerRef.current) return;

    const figures = containerRef.current.querySelectorAll(
      "figure[data-rehype-pretty-code-figure]"
    );

    figures.forEach((figure) => {
      // 이미 버튼이 있으면 스킵
      if (figure.querySelector(".code-copy-button")) return;

      const pre = figure.querySelector("pre");
      if (!pre) return;

      // figure를 relative로 설정
      (figure as HTMLElement).style.position = "relative";
      figure.classList.add("group");

      // 복사 버튼 생성
      const button = document.createElement("button");
      button.className =
        "code-copy-button absolute right-2 top-2 p-2 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 hover:text-white";
      button.setAttribute("aria-label", "코드 복사");
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;

      button.addEventListener("click", async () => {
        const code = pre.querySelector("code")?.textContent || "";
        await navigator.clipboard.writeText(code);

        // 체크 아이콘으로 변경
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

        setTimeout(() => {
          button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
        }, 2000);
      });

      figure.appendChild(button);
    });
  }, [code]);

  return (
    <div ref={containerRef}>
      <Component components={sharedComponents} />
    </div>
  );
}
