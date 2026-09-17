import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

const WORKER_URL =
  "https://uy8ownl2yz4lsl6hrf2snzxn7yg6jyvf.bopistaken.workers.dev/";
const STORAGE_KEY = "baritonebot_visits_net";

/**
 * Sends an anonymous visit ping to our own Cloudflare Worker, once per
 * browser session (tab). No personal data is collected — only page,
 * referrer, screen/viewport and locale.
 */

export function VisitorPing() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only one ping per browser session (tab) — matches the updated worker.
    const SESSION_KEY = "baritonebot_pinged";
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* storage unavailable — still send the ping */
    }



    let visits: number[] = [];
    try {
      visits = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(visits)) visits = [];
    } catch {
      visits = [];
    }

    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    visits = visits.filter((t) => typeof t === "number" && t > cutoff);
    visits.push(Date.now());
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
    } catch {
      /* storage unavailable — ignore */
    }

    const payload = {
      visitNumber: visits.length,
      page: window.location.href,
      referrer: document.referrer || "Direct / None",
      screen: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language || "Unknown",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
      mobile: /Mobi|Android/i.test(navigator.userAgent),
    };

    fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
