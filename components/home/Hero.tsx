// HOME > HERO: big banner with the tagline, two call-to-action buttons and two craft photos.
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SafeImage from "../SafeImage";
import { artisans, artisanStates } from "@/data/artisans";

import { img } from "@/lib/images";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-indigo text-linen">
      <div className="pattern-bg absolute inset-0 opacity-40" aria-hidden />
      <div className="container-x relative grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-24">
        <div className="anim-rise space-y-6">
          <p className="kicker !text-brass-light">Direct from {artisans.length} artisan communities in {artisanStates.length} states</p>
          <h1 className="text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
            Preserving Heritage, <em className="text-brass-light">Empowering Artisans</em>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-linen/80 sm:text-lg">
            Every sari, vase and figurine here carries the signature of the hands that made it. Buy directly from the weaver, potter or caster, and keep a centuries-old craft alive.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop?category=handloom" className="btn btn-primary">Explore Handloom <ArrowRight aria-hidden className="h-4 w-4" /></Link>
            <Link href="/artisans" className="btn btn-light">Meet the Makers</Link>
          </div>
        </div>

        <div className="relative mx-auto grid w-full max-w-lg grid-cols-2 gap-4" aria-hidden>
          <SafeImage src={img("ikat")} alt="" loading="eager" className="aspect-[3/4] w-full rounded-t-[6rem] rounded-b-2xl object-cover" />
          <SafeImage src={img("bluepot2")} alt="" loading="eager" className="mt-10 aspect-[3/4] w-full rounded-2xl rounded-b-[6rem] object-cover" />
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-indigo shadow-lg">
            ✦ Every piece ships with its maker&apos;s story
          </div>
        </div>
      </div>
    </section>
  );
}
