"use client";

import html2canvas from "html2canvas";
import { makeHtml2CanvasSafe } from "./export-sanitize";

async function waitForAllImages(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll("img"));
  await Promise.all(
    images.map((img) => {
      if (img.complete && img.naturalHeight > 0) return Promise.resolve();
      return new Promise((resolve) => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
        setTimeout(resolve, 3000);
      });
    }),
  );
}

async function waitForFonts(): Promise<void> {
  try {
    await document.fonts.ready;
  } catch {
    void 0;
  }
}

function forceLayout(element: HTMLElement): void {
  element.offsetHeight;
  element.getBoundingClientRect();
}

export async function exportElementToPng(
  element: HTMLElement,
  filename: string,
  width: number,
  height: number,
) {
  await waitForFonts();
  await waitForAllImages(element);
  forceLayout(element);

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    width,
    height,
    windowWidth: width + 20,
    windowHeight: height + 20,
    scrollX: 0,
    scrollY: 0,
    useCORS: true,
    allowTaint: true,
    logging: false,
    imageTimeout: 5000,
    removeContainer: true,
    onclone: (clonedDocument, clonedElement) => {
      const cloned = clonedElement as HTMLElement;
      cloned.style.width = `${width}px`;
      cloned.style.height = `${height}px`;
      cloned.style.position = "absolute";
      cloned.style.left = "0";
      cloned.style.top = "0";
      cloned.style.overflow = "hidden";
      cloned.style.visibility = "visible";
      cloned.style.display = "block";
      makeHtml2CanvasSafe(clonedElement as HTMLElement);
      const allImages = Array.from(cloned.querySelectorAll("img"));
      allImages.forEach((img) => {
        img.style.visibility = "visible";
        img.style.display = "block";
        if (!img.complete || img.naturalHeight === 0) {
          img.style.width = img.style.width || "100px";
          img.style.height = img.style.height || "100px";
        }
      });
    },
  });

  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png", 1.0);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
