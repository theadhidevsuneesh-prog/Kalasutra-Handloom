import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { Artisan } from "@/types";
import { getProductsByArtisan } from "@/data/products";
import SafeImage from "./SafeImage";

export default function ArtisanCard({ artisan }: { artisan: Artisan }) {
  const count = getProductsByArtisan(artisan.id).length;
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-sand bg-white transition-shadow hover:shadow-xl">
      <div className="relative aspect-[4/3] bg-linen-dark">
        <SafeImage src={artisan.image} alt={artisan.community ? `${artisan.craft} from ${artisan.village}` : `Portrait of ${artisan.name}`} className="h-full w-full object-cover" />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-indigo">{artisan.craft}</span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-xl">{artisan.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-ink-soft">
            <MapPin aria-hidden className="h-3.5 w-3.5 text-terracotta" />
            {artisan.village}, {artisan.state}
          </p>
        </div>
        <p className="line-clamp-3 text-sm leading-relaxed text-ink-soft">{artisan.story}</p>
        {artisan.quote && <blockquote className="border-l-2 border-brass pl-3 font-serif text-sm italic text-charcoal">“{artisan.quote}”</blockquote>}
        <dl className="flex justify-around gap-2 border-t border-sand pt-3 text-center text-xs">
          {artisan.yearsOfPractice !== undefined && <div><dt className="text-ink-soft">Practice</dt><dd className="font-semibold">{artisan.yearsOfPractice} yrs</dd></div>}
          {artisan.teamSize !== undefined && <div><dt className="text-ink-soft">Team</dt><dd className="font-semibold">{artisan.teamSize}</dd></div>}
          {artisan.giTag && <div><dt className="text-ink-soft">GI</dt><dd className="font-semibold">Registered</dd></div>}
          <div><dt className="text-ink-soft">Pieces</dt><dd className="font-semibold">{count}</dd></div>
        </dl>
        <Link
          href={`/shop?artisan=${artisan.id}`}
          className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta hover:gap-2.5 transition-all"
        >
          Shop {artisan.name.split(" ")[0]}&apos;s work <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
