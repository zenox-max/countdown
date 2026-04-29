import { createFileRoute } from "@tanstack/react-router";
import { Countdown } from "@/components/Countdown";
import { StarField } from "@/components/StarField";
import { FloatingHearts } from "@/components/FloatingHearts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Countdown to May 10 ♥" },
      { name: "description", content: "Counting down every second to a very special day." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16">
      {/* Aurora glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ background: "var(--gradient-aurora)" }}
      />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--rose-glow), transparent 70%)" }}
      />

      <StarField count={90} />
      <FloatingHearts count={16} />

      {/* Crescent moon */}
      <div className="pointer-events-none absolute right-8 top-10 sm:right-16 sm:top-16 animate-bounce-gentle">
        <div className="relative h-16 w-16 sm:h-24 sm:w-24">
          <div className="absolute inset-0 rounded-full bg-accent/90 shadow-[0_0_60px_rgba(245,210,140,0.6)]" />
          <div className="absolute inset-0 translate-x-3 rounded-full bg-[oklch(0.15_0.06_280)]" />
        </div>
      </div>

      <section className="relative z-10 flex flex-col items-center text-center">
        <p className="font-script text-2xl text-accent sm:text-3xl animate-fade-in">
          A little something special
        </p>
        <h1 className="mt-3 font-serif text-4xl font-medium leading-tight text-gradient sm:text-7xl animate-fade-in">
          Counting down to
          <br />
          <span className="italic">your birthday</span>
        </h1>
        <p className="mt-4 max-w-md font-serif text-base italic text-muted-foreground sm:text-lg">
          May 10 — the most wonderful day of the year ♥
        </p>

        <div className="mt-12 sm:mt-16">
          <Countdown />
        </div>

        <div className="mt-14 max-w-lg">
          <p className="font-serif text-lg leading-relaxed text-foreground/90 sm:text-xl">
            Every second that passes is one second closer to celebrating
            <span className="text-gradient font-medium"> you</span>.
          </p>
          <p className="mt-3 font-script text-2xl text-primary sm:text-3xl">
            ✦ get ready, beautiful ✦
          </p>
        </div>
      </section>

      {/* Bottom shimmer line */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[oklch(0.1_0.04_275)] to-transparent" />
    </main>
  );
}
