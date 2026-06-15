"use client";

import { useEffect } from "react";

import {
  applyAdminTheme,
  defaultAdminTheme,
  loadAdminTheme,
} from "@/lib/admin-theme";

export function AdminThemeLoader() {
  useEffect(() => {
    const applySavedTheme = () => {
      const savedTheme = loadAdminTheme();

      applyAdminTheme(savedTheme ?? defaultAdminTheme);
    };

    applySavedTheme();

    const observer = new MutationObserver(applySavedTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}