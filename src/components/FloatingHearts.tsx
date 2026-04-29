import { useMemo } from "react";

const SYMBOLS = ["♥", "✦", "❀", "♡", "✧", "❁"];

export function FloatingHearts({ count = 14 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 14 + Math.random() * 22,
        duration: 12 + Math.random() * 14,
        delay: Math.random() * 18,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        hue: Math.random() > 0.5 ? "var(--rose-glow)" : "var(--gold)",
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((it) => (
        <span
          key={it.id}
          className="absolute animate-float-up select-none"
          style={{
            left: `${it.left}%`,
            bottom: 0,
            fontSize: `${it.size}px`,
            color: it.hue,
            animationDuration: `${it.duration}s`,
            animationDelay: `${it.delay}s`,
            filter: "drop-shadow(0 0 8px currentColor)",
          }}
        >
          {it.symbol}
        </span>
      ))}
    </div>
  );
}
