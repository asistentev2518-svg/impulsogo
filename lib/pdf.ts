"use client";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export async function exportElementsToPdf(
  elements: HTMLElement[],
  filename: string,
) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "letter" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < elements.length; i++) {
    const canvas = await html2canvas(elements[i], {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");
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
