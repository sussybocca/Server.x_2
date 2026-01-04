"use client";

import { useEffect } from "react";

export default function FullscreenGuard({ children }) {
  useEffect(() => {
    const enforce = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    };

    enforce();
    document.addEventListener("click", enforce);
    return () => document.removeEventListener("click", enforce);
  }, []);

  return children;
}
