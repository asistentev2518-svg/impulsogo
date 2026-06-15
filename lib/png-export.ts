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
  element.getBoundingClientRect();
}

async function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((nextBlob) => {
      if (nextBlob) {
        resolve(nextBlob);
      } else {
        reject(new Error("No se pudo preparar la imagen para descarga."));
      }
    }, "image/png", 1);
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
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
    // Evita reflows/duplicaciones en el clone ajustando scale de forma consistente.
    scale: 1.75,
    backgroundColor: "#ffffff",
    width,
    height,
    windowWidth: width,
    windowHeight: height,
    scrollX: 0,
    scrollY: 0,
    useCORS: true,
    allowTaint: true,
    logging: false,
    imageTimeout: 5000,
    removeContainer: true,
    // Menos agresividad en el clone: el layout se mantiene mejor y evita textos superpuestos.
    onclone: (_clonedDocument, clonedElement) => {
      const cloned = clonedElement as HTMLElement;
      cloned.style.width = `${width}px`;
      cloned.style.height = `${height}px`;
      cloned.style.position = "absolute";
      cloned.style.left = "0";
      cloned.style.top = "0";
      cloned.style.overflow = "hidden";
      cloned.style.visibility = "visible";
      cloned.style.display = "block";
      cloned.style.transform = "none";
      cloned.style.filter = "none";

      makeHtml2CanvasSafe(clonedElement as HTMLElement);

      const allImages = Array.from(cloned.querySelectorAll("img"));
      allImages.forEach((img) => {
        img.style.visibility = "visible";
        img.style.display = "block";
      });

      // Asegura tipografías consistentes en el render del clone.
      const allText = Array.from(cloned.querySelectorAll("*"));
      allText.forEach((el) => {
        const style = (el as HTMLElement).style;
        if (style) {
          (style as any).webkitFontSmoothing = "antialiased";
          (style as any).mozOsxFontSmoothing = "grayscale";
        }
      });
    },
  });

  await downloadCanvas(canvas, filename);
}
