import { useEffect } from "react";

export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (!locked) return;

    const scrollY = window.scrollY; // mantém posição
    const prevHtml = html.style.cssText;
    const prevBody = body.style.cssText;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {
      html.style.cssText = prevHtml;
      body.style.cssText = prevBody;
      window.scrollTo({ top: scrollY });
    };
  }, [locked]);
}
