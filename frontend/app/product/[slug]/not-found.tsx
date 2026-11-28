// Shown when /product/<slug> does not match any product.
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-32 text-center">
      <h1 className="text-4xl">This piece has found a new home</h1>
      <p className="mt-3 text-ink-soft">We couldn&apos;t find that product.</p>
      <Link href="/shop" className="btn btn-primary mt-6">Back to the shop</Link>
    </div>
  );
}
