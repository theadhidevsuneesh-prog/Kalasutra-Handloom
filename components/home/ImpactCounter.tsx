"use client";
// HOME > IMPACT COUNTER: row of headline numbers that count up once when scrolled into view.

import { useEffect, useRef, useState } from "react";
import { BadgeCheck, HandHeart, Landmark, Users } from "lucide-react";

const stats = [
  { icon: Users, value: 500, suffix: "+", label: "Rural artisans supported" },
  { icon: HandHeart, value: 100, suffix: "%", label: "Fair-trade certified" },
  { icon: Landmark, value: 28, suffix: "", label: "GI-tagged crafts" },
  { icon: BadgeCheck, value: 62, suffix: "%", label: "of price reaches the maker" },
];

// Counts from 0 up to `to` (ease-out, ~1.4s) the first time it scrolls into view; skips animation if reduced-motion is on.
function Count({ to, suffix }: { to: number; suffix: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      if (reduce) return setN(to);
      const start = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - start) / 1400);
        setN(Math.round((1 - Math.pow(1 - k, 3)) * to));
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return <span ref={ref}>{n}{suffix}</span>;
}

export default function ImpactCounter() {
  return (
    <section aria-labelledby="impact" className="border-b border-sand bg-linen-dark">
      <h2 id="impact" className="sr-only">Our impact</h2>
      <dl className="container-x grid grid-cols-2 gap-8 py-10 lg:grid-cols-4">
        {stats.map(({ icon: Icon, value, suffix, label }) => (
          <div key={label} className="flex flex-col items-center text-center">
            <Icon aria-hidden className="mb-2 h-7 w-7 text-terracotta" />
            <dd className="font-serif text-4xl font-bold text-indigo"><Count to={value} suffix={suffix} /></dd>
            <dt className="mt-1 text-sm text-ink-soft">{label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
