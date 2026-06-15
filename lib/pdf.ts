"use client";

import { jsPDF } from "jspdf";
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

export async function exportElementsToPdf(
  elements: HTMLElement[],
  filename: string,
) {
  await waitForFonts();

  // Usar un tamaño de página cercano al “816x1056” del layout (1080x1350 se usa para tablas/documentos).
  // Esto evita escalados raros que causan solapamientos visuales cuando el contenido ya viene “posicionado”.
  const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [816, 1056] });
  const pageWidth = 816;
  const pageHeight = 1056;

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    await waitForAllImages(element);
    forceLayout(element);

    const width = element.offsetWidth || 816;
    const height = element.offsetHeight || 1056;

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
      // En el render clonado forzamos tipografías y layout estable para que no “salten” caracteres.
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
        cloned.style.transform = "none";
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

        // Evitar que algunos navegadores “reflow” con transform durante el clon.
        (clonedDocument.documentElement as HTMLElement).style.overflow = "hidden";
      },
    });

    const imgData = canvas.toDataURL("image/png", 1.0);

    // Insertar centrado pero usando el tamaño exacto de página para minimizar solapes.
    const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
    const imgWidth = canvas.width * ratio;
    const imgHeight = canvas.height * ratio;
    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
  }

  pdf.save(filename);
}

export async function exportElementToPdf(element: HTMLElement, filename: string) {
  await exportElementsToPdf([element], filename);
}
