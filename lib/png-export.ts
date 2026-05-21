"use client";

import html2canvas from "html2canvas";

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
    useCORS: true,
  });

  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
