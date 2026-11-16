import { Leaf, Package, ShieldCheck, Star, Recycle, Scroll } from "lucide-react";
import { testimonials } from "@/data/products";

const badges = [
  { icon: ShieldCheck, name: "Silk Mark", text: "Certifies 100% natural silk, tested and verified by the Silk Mark Organisation of India." },
  { icon: Scroll, name: "Craft Mark", text: "Awarded by the All India Artisans & Craftworkers Welfare Association for genuine handmade crafts." },
  { icon: Leaf, name: "Handloom Mark", text: "Government of India label that guarantees a product was woven on a handloom." },
  { icon: Recycle, name: "Sustainable packaging", text: "Recycled kraft, jute and cotton wraps. No single-use plastic, ever." },
];

export default function TrustSection() {
  return (
    <>
      <section aria-labelledby="reviews" className="container-x pt-24">
        <div className="mb-8 text-center">
          <p className="kicker">Loved by collectors</p>
          <h2 id="reviews" className="mt-2 text-3xl sm:text-4xl">What our customers say</h2>
        </div>
        <ul className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <li key={t.name}>
              <figure className="flex h-full flex-col rounded-2xl border border-sand bg-white p-6">
                <p className="mb-3 flex gap-0.5" aria-label="5 out of 5 stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} aria-hidden className="h-4 w-4 fill-brass text-brass" />)}</p>
                <blockquote className="flex-1 leading-relaxed">“{t.quote}”</blockquote>
                <figcaption className="mt-4 border-t border-sand pt-3 text-sm"><strong>{t.name}</strong>, {t.city}<span className="block text-xs text-ink-soft">Bought: {t.product}</span></figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section id="trust" aria-labelledby="trust-h" className="container-x pt-20">
        <div className="rounded-3xl bg-forest p-8 text-linen sm:p-12">
          <div className="mb-8 max-w-2xl">
            <p className="kicker !text-brass-light">Authenticity, guaranteed</p>
            <h2 id="trust-h" className="mt-2 text-3xl sm:text-4xl">Every piece is verified at source</h2>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {badges.map(({ icon: Icon, name, text }) => (
              <li key={name} className="rounded-2xl bg-white/10 p-5">
                <Icon aria-hidden className="mb-3 h-8 w-8 text-brass-light" />
                <h3 className="text-lg">{name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-linen/75">{text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 flex items-center gap-2 text-sm text-linen/80"><Package aria-hidden className="h-4 w-4" /> Free 7-day returns on unused items, plus a certificate of authenticity in every parcel.</p>
        </div>
      </section>
    </>
  );
}
