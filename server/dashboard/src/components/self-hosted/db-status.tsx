"use client";

import { useEffect, useState } from "react";

type DbState = "checking" | "connected" | "degraded" | "unreachable";

const DOT_COLORS: Record<DbState, string> = {
  checking: "#9ca3af",
  connected: "#22c55e",
  degraded: "#f59e0b",
  unreachable: "#ef4444",
};

const LABELS: Record<DbState, string> = {
  checking: "DB checking…",
  connected: "DB connected",
  degraded: "DB degraded",
  unreachable: "DB unreachable",
};

export function DbStatus({ tone = "auto" }: { tone?: "auto" | "light" }) {
  const [state, setState] = useState<DbState>("checking");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    let active = true;

    const check = async () => {
      const base = process.env.NEXT_PUBLIC_API_URL || "";
      try {
        const res = await fetch(`${base}/api/health`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!active) return;
        setState(data.status === "ok" ? "connected" : "degraded");
        setDetail(`database: ${data.database}; vectors: ${data.vector_store}`);
      } catch {
        if (!active) return;
        setState("unreachable");
        setDetail("Could not reach the API. Check that it is running.");
      }
    };

    check();
    const id = setInterval(check, 30000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  return (
    <span
      className="flex items-center gap-1.5 text-xs"
      title={detail || "Database connection status"}
    >
      <span
        className="inline-block size-2 rounded-full"
        style={{ backgroundColor: DOT_COLORS[state] }}
      />
      <span
        className={
          tone === "light"
            ? "text-white/80"
            : "text-onSurface-default-tertiary"
        }
      >
        {LABELS[state]}
      </span>
    </span>
  );
}
