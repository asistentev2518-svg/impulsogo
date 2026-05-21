"use client";

const UNSUPPORTED_COLOR = /(oklch|oklab|lab|lch|color-mix)\(/i;

const COLOR_PROPS = [
  "color",
  "backgroundColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "outlineColor",
  "textDecorationColor",
] as const;

function fallbackFor(prop: (typeof COLOR_PROPS)[number], element: HTMLElement) {
  if (prop === "backgroundColor") return "transparent";
  if (prop.startsWith("border") || prop === "outlineColor" || prop === "textDecorationColor") {
    return "rgba(15, 23, 42, 0.18)";
  }

  const darkParent = element.closest("[data-export-dark='true']");
  return darkParent ? "#ffffff" : "#172033";
}

export function makeHtml2CanvasSafe(root: HTMLElement) {
  const win = root.ownerDocument.defaultView;
  if (!win) return;

  const elements = [root, ...Array.from(root.querySelectorAll<HTMLElement>("*"))];
  for (const element of elements) {
    const computed = win.getComputedStyle(element);
    for (const prop of COLOR_PROPS) {
      const value = computed[prop];
      if (value && UNSUPPORTED_COLOR.test(value)) {
        element.style[prop] = fallbackFor(prop, element);
      }
    }

    const shadow = computed.boxShadow;
    if (shadow && UNSUPPORTED_COLOR.test(shadow)) {
      element.style.boxShadow = "none";
    }
  }
}
