import { useEffect, useMemo, useState } from "react";

// Curated timezone list (label, IANA zone)
const TIMEZONES: Array<{ label: string; zone: string }> = [
  { label: "Honolulu (HST)", zone: "Pacific/Honolulu" },
  { label: "Los Angeles (PT)", zone: "America/Los_Angeles" },
  { label: "Denver (MT)", zone: "America/Denver" },
  { label: "Chicago (CT)", zone: "America/Chicago" },
  { label: "New York (ET)", zone: "America/New_York" },
  { label: "São Paulo", zone: "America/Sao_Paulo" },
  { label: "London", zone: "Europe/London" },
  { label: "Paris / Berlin", zone: "Europe/Paris" },
  { label: "Cairo", zone: "Africa/Cairo" },
  { label: "Istanbul", zone: "Europe/Istanbul" },
  { label: "Dubai", zone: "Asia/Dubai" },
  { label: "Mumbai (IST)", zone: "Asia/Kolkata" },
  { label: "Bangkok", zone: "Asia/Bangkok" },
  { label: "Singapore", zone: "Asia/Singapore" },
  { label: "Shanghai / Beijing", zone: "Asia/Shanghai" },
  { label: "Tokyo", zone: "Asia/Tokyo" },
  { label: "Sydney", zone: "Australia/Sydney" },
  { label: "Auckland", zone: "Pacific/Auckland" },
];

// Compute the UTC timestamp that corresponds to May 10, 2026 00:00 in the given IANA zone.
function getTargetMs(zone: string): number {
  // Reference UTC midnight for the target wall-clock date
  const utcMidnight = Date.UTC(2026, 4, 10, 0, 0, 0);
  // Find what wall-clock that UTC instant displays as in `zone`
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
  const parts = dtf.formatToParts(new Date(utcMidnight));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour") % 24, get("minute"), get("second"));
  const offset = asUtc - utcMidnight; // zone offset at that moment
  return utcMidnight - offset;
}

function getRemaining(now: number, target: number) {
  const diff = Math.max(0, target - now);
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
  const [paused, setPaused] = useState(false);
  const [zone, setZone] = useState<string>("America/New_York");

  // Detect user's local zone on mount, and ensure it's in the list
  useEffect(() => {
    try {
      const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (local) setZone(local);
    } catch {
      // keep default
    }
  }, []);

  const target = useMemo(() => {
    try {
      return getTargetMs(zone);
    } catch {
      return getTargetMs("UTC");
    }
  }, [zone]);

  useEffect(() => {
    setT(getRemaining(Date.now(), target));
    if (paused) return;
    const id = setInterval(() => setT(getRemaining(Date.now(), target)), 1000);
    return () => clearInterval(id);
  }, [paused, target]);

  // Build options list, ensuring the detected zone appears even if not curated
  const options = useMemo(() => {
    const list = [...TIMEZONES];
    if (!list.some((tz) => tz.zone === zone)) {
      list.unshift({ label: `${zone} (your time)`, zone });
    }
    return list;
  }, [zone]);

  const isDone = t?.done;

  return (
    <div className="flex flex-col items-center gap-8">
      {isDone ? (
        <div className="text-center animate-pulse-soft">
          <p className="font-script text-5xl text-gradient sm:text-7xl">Happy Birthday!</p>
          <p className="mt-4 font-serif italic text-xl text-muted-foreground">The day is finally here ♥</p>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          <Unit value={t?.days ?? 0} label="Days" />
          <Unit value={t?.hours ?? 0} label="Hours" />
          <Unit value={t?.minutes ?? 0} label="Minutes" />
          <Unit value={t?.seconds ?? 0} label="Seconds" />
        </div>
      )}

      {!isDone && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-6 py-2.5 backdrop-blur-md transition-all hover:scale-105 hover:bg-card/60 hover:shadow-card-romantic"
        >
          <span className="text-sm uppercase tracking-[0.25em] text-foreground/90">
            {paused ? "▶  Resume" : "❙❙  Pause"}
          </span>
        </button>
      )}

      {paused && !isDone && (
        <p className="font-script text-lg text-accent animate-fade-in -mt-4">
          paused — take your time, beautiful ✦
        </p>
      )}

      {/* Timezone selector */}
      <div className="flex flex-col items-center gap-2">
        <label
          htmlFor="tz-select"
          className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground"
        >
          Her timezone
        </label>
        <div className="relative">
          <select
            id="tz-select"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="appearance-none rounded-full border border-border bg-card/40 px-5 py-2 pr-10 font-serif text-sm italic text-foreground/90 backdrop-blur-md transition-all hover:bg-card/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {options.map((tz) => (
              <option key={tz.zone} value={tz.zone} className="bg-background text-foreground">
                {tz.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-accent">
            ▾
          </span>
        </div>
        <p className="font-script text-base text-accent/80">
          midnight on May 10 in {zone.split("/").pop()?.replace(/_/g, " ")}
        </p>
      </div>
    </div>
  );
}
