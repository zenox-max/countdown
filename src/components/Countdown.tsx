import { useEffect, useState } from "react";

const TARGET = new Date(2026, 4, 10, 0, 0, 0).getTime();

function getRemaining(now: number) {
  const diff = Math.max(0, TARGET - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const minutes = Math.floor((diff / 60000) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, done: diff === 0 };
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/20 blur-xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card/40 backdrop-blur-md shadow-card-romantic sm:h-28 sm:w-28">
          <span className="font-serif text-4xl font-medium tabular-nums text-gradient sm:text-6xl animate-shimmer">
            {String(value).padStart(2, "0")}
          </span>
        </div>
      </div>
      <span className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground sm:text-sm">
        {label}
      </span>
    </div>
  );
}

export function Countdown() {
  const [t, setT] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    setT(getRemaining(Date.now()));
    const id = setInterval(() => setT(getRemaining(Date.now())), 1000);
    return () => clearInterval(id);
  }, []);

  if (!t) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
        <Unit value={0} label="Days" />
        <Unit value={0} label="Hours" />
        <Unit value={0} label="Minutes" />
        <Unit value={0} label="Seconds" />
      </div>
    );
  }

  if (t.done) {
    return (
      <div className="text-center animate-pulse-soft">
        <p className="font-script text-5xl text-gradient sm:text-7xl">Happy Birthday!</p>
        <p className="mt-4 font-serif italic text-xl text-muted-foreground">The day is finally here ♥</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
      <Unit value={t.days} label="Days" />
      <Unit value={t.hours} label="Hours" />
      <Unit value={t.minutes} label="Minutes" />
      <Unit value={t.seconds} label="Seconds" />
    </div>
  );
}
