"use client";

import { useMemo } from "react";

export type DeviceQuality = "high" | "medium" | "low";

/**
 * Returns a stable performance tier for the current device.
 * - high:   desktop with 8+ CPU cores, wide screen
 * - medium: mid-range device
 * - low:    mobile / low-end (few cores, small screen, reduced-motion preference)
 */
export function useDevicePerformance(): DeviceQuality {
  return useMemo<DeviceQuality>(() => {
    if (typeof window === "undefined") return "high";

    const cores = navigator.hardwareConcurrency ?? 4;
    const width = window.screen.width;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (prefersReducedMotion) return "low";
    if (isTouchDevice && width < 768) return "low";
    if (cores <= 2 || width < 480) return "low";
    if (cores <= 4 || width < 1024) return "medium";
    return "high";
  }, []);
}
