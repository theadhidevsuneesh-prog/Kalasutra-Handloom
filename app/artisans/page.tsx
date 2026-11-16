"use client";

import { useState } from "react";
import { artisans, artisanStates } from "@/data/artisans";
import ArtisanCard from "@/components/ArtisanCard";
import { cn } from "@/lib/utils";

// Schematic projection of cluster coordinates onto a card (not a cartographic map)
const LAT = [8, 35], LNG = [68, 98];
const pos = ([lat, lng]: [number, number]) => ({
  left: `${((lng - LNG[0]) / (LNG[1] - LNG[0])) * 100}%`,
  top: `${(1 - (lat - LAT[0]) / (LAT[1] - LAT[0])) * 100}%`,
});

export default function ArtisansPage() {
  const [state, setState] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const list = state ? artisans.filter((a) => a.state === state) : artisans;

  return (
    <div className="container-x py-10">
      <header className="max-w-2xl">
        <p className="kicker">Meet our artisans</p>
        <h1 className="mt-2 text-3xl sm:text-5xl">{artisanStates.length} states. {artisans.length} craft communities.</h1>
        <p className="mt-4 leading-relaxed text-ink-soft">Each of these communities has practised its craft for generations. Choose a region on the map or from the list to read their story and shop what they make.</p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <section aria-label="Artisan cluster map" className="lg:col-span-2">
          <div className="pattern-bg relative aspect-square w-full overflow-hidden rounded-3xl border border-sand bg-white lg:sticky lg:top-32">
            <p className="absolute left-4 top-4 text-xs uppercase tracking-widest text-ink-soft">Schematic map of clusters</p>
            {artisans.map((a) => {
              const on = state === a.state;
              return (
                <button
                  key={a.id}
                  type="button"
                  style={pos(a.coords)}
                  onClick={() => setState(on ? null : a.state)}
                  onMouseEnter={() => setHover(a.id)} onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(a.id)} onBlur={() => setHover(null)}
                  aria-pressed={on}
                  aria-label={`${a.village}, ${a.state}: ${a.craft}`}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                >
                  <span className={cn("block h-4 w-4 rounded-full border-2 border-white shadow transition-transform group-hover:scale-150", on ? "scale-150 bg-terracotta" : "bg-indigo")} />
                  {(hover === a.id || on) && (
                    <span className="pointer-events-none absolute left-1/2 top-6 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-charcoal px-2 py-1 text-xs text-white">{a.village} · {a.craft}</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section aria-label="Artisan profiles" className="lg:col-span-3">
          <div role="group" aria-label="Filter by state" className="mb-6 flex flex-wrap gap-2">
            <button type="button" aria-pressed={!state} onClick={() => setState(null)} className={cn("rounded-full border px-4 py-1.5 text-sm", !state ? "border-terracotta bg-terracotta text-white" : "border-sand bg-white hover:border-terracotta")}>All regions</button>
            {artisanStates.map((s) => (
              <button key={s} type="button" aria-pressed={state === s} onClick={() => setState(state === s ? null : s)} className={cn("rounded-full border px-4 py-1.5 text-sm", state === s ? "border-terracotta bg-terracotta text-white" : "border-sand bg-white hover:border-terracotta")}>{s}</button>
            ))}
          </div>
          <p role="status" className="mb-4 text-sm text-ink-soft">{list.length} {list.length === 1 ? "artisan" : "artisans"}{state ? ` in ${state}` : ""}</p>
          <div className="grid gap-6 sm:grid-cols-2">
            {list.map((a) => <ArtisanCard key={a.id} artisan={a} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
