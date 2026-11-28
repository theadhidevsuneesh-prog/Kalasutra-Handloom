// PHOTO CREDITS PAGE ( /credits ): lists every photo's author and licence, generated from backend/lib/images.ts.
import type { Metadata } from "next";
import { credits } from "@backend/lib/images";

export const metadata: Metadata = { title: "Photo credits" };

export default function CreditsPage() {
  return (
    <div className="container-x max-w-4xl py-12">
      <p className="kicker">Credits</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">Photo credits</h1>
      <p className="mt-4 leading-relaxed text-ink-soft">
        Photographs of the crafts on this site come from Wikimedia Commons and are used under the licences shown. Thank you to the photographers. Craft information is summarised from public sources, including the state-wise list in the All India Handicrafts Week 2025 article by Indiahandmade.
      </p>
      <ul className="mt-8 divide-y divide-sand rounded-2xl border border-sand bg-white">
        {credits.map((c) => (
          <li key={c.key} className="flex flex-col gap-1 p-4 text-sm sm:flex-row sm:items-baseline sm:justify-between">
            <a href={c.page} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo underline-offset-2 hover:underline">{c.title}</a>
            <span className="text-ink-soft">{c.author} · {c.license}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
