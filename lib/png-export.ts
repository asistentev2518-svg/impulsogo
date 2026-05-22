"use client";

import html2canvas from "html2canvas";
import { makeHtml2CanvasSafe } from "./export-sanitize";

export async function exportElementToPng(
  element: HTMLElement,
  filename: string,
  width: number,
  height: number,
) {
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    width,
    height,
    windowWidth: Math.max(document.documentElement.scrollWidth, width),
    windowHeight: Math.max(document.documentElement.scrollHeight, height),
    scrollX: 0,
    scrollY: 0,
    useCORS: true,
    onclone: (_document, clonedElement) => {
      const cloned = clonedElement as HTMLElement;
      cloned.style.width = `${width}px`;
      cloned.style.height = `${height}px`;
      makeHtml2CanvasSafe(clonedElement as HTMLElement);
    },
  });

  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  document.body.appendChild(link);
  link.click();
  link.remove();
}
