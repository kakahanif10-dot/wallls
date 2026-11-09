"use client";

import { useMemo, useState } from "react";
import { fmtPct, fmtPrice } from "@/lib/market";

type Props = {
  values: number[];
  label: string;
  height?: number;
};

const RANGES = [
  { key: "1M", days: 22 },
  { key: "3M", days: 66 },
  { key: "6M", days: 130 },
  { key: "1Y", days: 260 },
];

const W = 900;
const H = 320;
const PAD = { top: 16, right: 8, bottom: 26, left: 0 };

export default function TrendChart({ values, label, height = 320 }: Props) {
  const [range, setRange] = useState("6M");
  const [hover, setHover] = useState<number | null>(null);

  const active = RANGES.find((r) => r.key === range) ?? RANGES[2];
  const data = useMemo(() => values.slice(-active.days), [values, active.days]);

  const { min, max, path, area, smaPath, coords } = useMemo(() => {
    if (data.length < 2) {
      return { min: 0, max: 0, path: "", area: "", smaPath: "", coords: [] as (readonly [number, number])[] };
    }
    const lo = Math.min(...data);
    const hi = Math.max(...data);
    const pad = (hi - lo) * 0.12 || hi * 0.05 || 1;
    const mn = lo - pad;
    const mx = hi + pad;
    const innerW = W - PAD.left - PAD.right;
    const innerH = height - PAD.top - PAD.bottom;

    const x = (i: number) => PAD.left + (i / (data.length - 1)) * innerW;
    const y = (v: number) => PAD.top + innerH - ((v - mn) / (mx - mn)) * innerH;

    const pts = data.map((v, i) => [x(i), y(v)] as const);
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ");
    const fill = `${line} L${pts[pts.length - 1][0].toFixed(2)},${(height - PAD.bottom).toFixed(
      2,
    )} L${pts[0][0].toFixed(2)},${(height - PAD.bottom).toFixed(2)} Z`;

    const window = 20;
    const sma: (number | null)[] = data.map((_, i) => {
      if (i < window - 1) return null;
      const slice = data.slice(i - window + 1, i + 1);
      return slice.reduce((a, b) => a + b, 0) / slice.length;
    });
    const smaLine = sma
      .map((v, i) => (v === null ? null : `${i === window - 1 ? "M" : "L"}${x(i).toFixed(2)},${y(v).toFixed(2)}`))
      .filter(Boolean)
      .join(" ");

    return { min: mn, max: mx, path: line, area: fill, smaPath: smaLine, coords: pts };
  }, [data, height]);

  if (data.length < 2) {
    return (
      <div className="flex h-[220px] items-center justify-center rounded-lg border border-line/70 bg-ink-900/40 text-sm text-muted">
        Price history for {label} is unavailable right now.
      </div>
    );
  }

  const rising = data[data.length - 1] >= data[0];
  const stroke = rising ? "#3ecf8e" : "#f0645f";
  const last = data[data.length - 1];
  const first = data[0];
  const change = last / first - 1;

  const hoverPoint = hover !== null ? coords[hover] : null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-sm text-muted">{label}</span>
          <span className={`font-mono text-xs ${change >= 0 ? "text-up" : "text-down"}`}>
            {fmtPct(change)} · {range}
          </span>
        </div>
        <div className="flex gap-1 rounded-full border border-line bg-ink-900 p-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => {
                setRange(r.key);
                setHover(null);
              }}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                range === r.key ? "bg-gold/15 text-gold-bright" : "text-muted hover:text-bone"
              }`}
            >
              {r.key}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${height}`}
          className="h-auto w-full"
          preserveAspectRatio="none"
          onMouseLeave={() => setHover(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const rel = ((e.clientX - rect.left) / rect.width) * W;
            const innerW = W - PAD.left - PAD.right;
            const idx = Math.round(((rel - PAD.left) / innerW) * (data.length - 1));
            setHover(Math.min(data.length - 1, Math.max(0, idx)));
          }}
        >
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity="0.26" />
              <stop offset="100%" stopColor={stroke} stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <line
              key={f}
              x1={PAD.left}
              x2={W - PAD.right}
              y1={PAD.top + f * (height - PAD.top - PAD.bottom)}
              y2={PAD.top + f * (height - PAD.top - PAD.bottom)}
              stroke="#242a35"
              strokeWidth="1"
              strokeDasharray="2 6"
            />
          ))}

          <path d={area} fill="url(#chartFill)" />
          <path d={smaPath} fill="none" stroke="#d8ab5a" strokeWidth="1.2" strokeOpacity="0.7" />
          <path d={path} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />

          <circle cx={coords[coords.length - 1][0]} cy={coords[coords.length - 1][1]} r="3.5" fill={stroke} />

          {hoverPoint && (
            <>
              <line
                x1={hoverPoint[0]}
                x2={hoverPoint[0]}
                y1={PAD.top}
                y2={height - PAD.bottom}
                stroke="#d8ab5a"
                strokeWidth="1"
                strokeOpacity="0.6"
              />
              <circle cx={hoverPoint[0]} cy={hoverPoint[1]} r="4" fill="#0b0d12" stroke="#d8ab5a" strokeWidth="2" />
            </>
          )}
        </svg>

        {hover !== null && (
          <div className="pointer-events-none absolute right-2 top-2 rounded-md border border-line bg-ink-900/95 px-3 py-1.5 font-mono text-xs text-bone">
            {fmtPrice(data[hover])}
          </div>
        )}

        <div className="mt-1 flex justify-between font-mono text-[10px] text-muted/70">
          <span>low {fmtPrice(min)}</span>
          <span className="text-gold/70">20-day average</span>
          <span>high {fmtPrice(max)}</span>
        </div>
      </div>
    </div>
  );
}
