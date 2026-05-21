"use client";

import { useEffect, useRef } from "react";
import SignaturePadLib from "signature_pad";

export function SignaturePad({
  onChange,
}: {
  onChange: (dataUrl: string | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePadLib | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pad = new SignaturePadLib(canvas, {
      backgroundColor: "rgb(255, 255, 255)",
      penColor: "#06245C",
    });
    padRef.current = pad;

    const resize = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d")?.scale(ratio, ratio);
      pad.clear();
      onChange(null);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleEnd = () => {
      onChange(pad.isEmpty() ? null : pad.toDataURL("image/png"));
    };
    canvas.addEventListener("pointerup", handleEnd);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerup", handleEnd);
      pad.off();
    };
  }, [onChange]);

  return (
    <div className="space-y-3">
      <canvas
        ref={canvasRef}
        className="h-44 w-full rounded-xl border border-slate-300 bg-white"
      />
      <button
        type="button"
        className="text-sm font-medium text-[var(--color-action)]"
        onClick={() => {
          padRef.current?.clear();
          onChange(null);
        }}
      >
        Limpiar firma
      </button>
    </div>
  );
}
