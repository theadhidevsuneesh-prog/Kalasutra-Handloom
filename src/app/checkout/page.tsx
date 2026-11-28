"use client";
/**
 * CHECKOUT PAGE ( /checkout ): 4-step form: Shipping -> Delivery -> Payment -> Review.
 * - Each step is validated before "Continue" moves on (see `validate`).
 * - Delivery method and COD add fees on top of the cart totals (see computeTotals).
 * - "Place order" is a DEMO: it makes a fake order id and clears the cart. No payment is
 *   processed and nothing is sent to a server.
 */

import Link from "next/link";
import { useState } from "react";
import { Banknote, Building2, Check, CreditCard, Smartphone, Truck, Zap } from "lucide-react";
import { products } from "@/backend/data/products";
import SafeImage from "@/frontend/components/SafeImage";
import { computeTotals, useMounted, useShop } from "@/frontend/store/useStore";
import { cn, inr } from "@/shared/utils";

const steps = ["Shipping", "Delivery", "Payment", "Review"] as const;
const delivery = [
  { id: "standard", label: "Standard delivery", eta: "5–8 business days", fee: 0, icon: Truck },
  { id: "express", label: "Express delivery", eta: "2–3 business days", fee: 199, icon: Zap },
] as const;
const payments = [
  { id: "upi", label: "UPI", hint: "GPay, PhonePe, Paytm", icon: Smartphone },
  { id: "card", label: "Credit / Debit card", hint: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "netbanking", label: "Net banking", hint: "All major Indian banks", icon: Building2 },
  { id: "cod", label: "Cash on delivery", hint: "₹50 handling fee", icon: Banknote },
] as const;
const COD_FEE = 50;
const banks = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "Punjab National Bank"];

type Addr = { name: string; phone: string; email: string; line1: string; city: string; state: string; pin: string };
const emptyAddr: Addr = { name: "", phone: "", email: "", line1: "", city: "", state: "", pin: "" };

export default function CheckoutPage() {
  const mounted = useMounted();
  const { cart, coupon, clearCart } = useShop();
  const [step, setStep] = useState(0);
  const [addr, setAddr] = useState<Addr>(emptyAddr);
  const [dMethod, setDMethod] = useState<(typeof delivery)[number]["id"]>("standard");
  const [pay, setPay] = useState<(typeof payments)[number]["id"]>("upi");
  const [payInfo, setPayInfo] = useState({ upi: "", card: "", expiry: "", cvv: "", bank: banks[0] });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderId, setOrderId] = useState<string | null>(null);

  if (!mounted) return <div className="container-x py-24 text-center text-ink-soft">Loading…</div>;

  if (orderId) {
    return (
      <div className="container-x max-w-xl py-24 text-center">
        <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-forest text-white"><Check aria-hidden className="h-8 w-8" /></span>
        <h1 className="text-3xl sm:text-4xl">Thank you, {addr.name.split(" ")[0]}!</h1>
        <p className="mt-3 text-ink-soft">Order <strong className="text-charcoal">{orderId}</strong> is confirmed. We&apos;ve shared your order with the makers, and a confirmation will arrive at {addr.email}.</p>
        <p className="mt-2 text-xs text-ink-soft">This is a demo storefront: no payment was taken.</p>
        <Link href="/shop" className="btn btn-primary mt-8">Continue shopping</Link>
      </div>
    );
  }

  const lines = cart.flatMap((l) => { const p = products.find((x) => x.id === l.productId); return p ? [{ ...l, p }] : []; });
  if (lines.length === 0) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-3xl">Your cart is empty</h1>
        <Link href="/shop" className="btn btn-primary mt-6">Browse the shop</Link>
      </div>
    );
  }

  // Extra charges on top of normal shipping: express fee and cash-on-delivery handling fee.
  const extra = (delivery.find((d) => d.id === dMethod)?.fee ?? 0) + (pay === "cod" ? COD_FEE : 0);
  const t = computeTotals(cart, coupon, extra);

  // Checks the fields of step `s` (0 = shipping, 2 = payment); fills `errors` and returns true if all are OK.
  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (addr.name.trim().length < 2) e.name = "Enter your full name";
      if (!/^[6-9]\d{9}$/.test(addr.phone)) e.phone = "Enter a valid 10-digit mobile number";
      if (!/^\S+@\S+\.\S+$/.test(addr.email)) e.email = "Enter a valid email";
      if (addr.line1.trim().length < 5) e.line1 = "Enter your address";
      if (!addr.city.trim()) e.city = "Enter your city";
      if (!addr.state.trim()) e.state = "Enter your state";
      if (!/^\d{6}$/.test(addr.pin)) e.pin = "Enter a 6-digit PIN code";
    }
    if (s === 2) {
      if (pay === "upi" && !/^[\w.-]{2,}@[a-z]{2,}$/i.test(payInfo.upi)) e.upi = "Enter a valid UPI ID, e.g. name@okbank";
      if (pay === "card") {
        if (payInfo.card.replace(/\s/g, "").length !== 16) e.card = "Enter a 16-digit card number";
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(payInfo.expiry)) e.expiry = "Use MM/YY";
        if (!/^\d{3}$/.test(payInfo.cvv)) e.cvv = "3 digits";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => validate(step) && setStep((s) => s + 1);
  // DEMO ONLY: creates a fake order id and empties the cart. No payment happens.
  const place = () => {
    setOrderId(`KS-${Date.now().toString().slice(-8)}`);
    clearCart();
  };

  const field = (key: keyof Addr, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={key} className="mb-1 block text-sm font-medium">{label}</label>
      <input id={key} className="input" value={addr[key]} onChange={(e) => setAddr({ ...addr, [key]: e.target.value })} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `${key}-err` : undefined} {...props} />
      {errors[key] && <p id={`${key}-err`} role="alert" className="mt-1 text-xs text-terracotta">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="container-x py-10">
      <h1 className="text-3xl sm:text-4xl">Checkout</h1>

      <ol className="my-8 flex items-center gap-2 text-sm" aria-label="Checkout progress">
        {steps.map((s, i) => (
          <li key={s} aria-current={i === step ? "step" : undefined} className="flex flex-1 items-center gap-2">
            <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold", i < step ? "bg-forest text-white" : i === step ? "bg-terracotta text-white" : "bg-sand text-ink-soft")}>
              {i < step ? <Check aria-hidden className="h-4 w-4" /> : i + 1}
            </span>
            <span className={cn("hidden sm:inline", i === step ? "font-semibold" : "text-ink-soft")}>{s}</span>
            {i < steps.length - 1 && <span aria-hidden className={cn("h-px flex-1", i < step ? "bg-forest" : "bg-sand")} />}
          </li>
        ))}
      </ol>

      <div className="grid gap-8 lg:grid-cols-3">
        <form className="space-y-6 lg:col-span-2" noValidate onSubmit={(e) => { e.preventDefault(); step === 3 ? place() : next(); }}>
          {step === 0 && (
            <fieldset className="space-y-4 rounded-2xl border border-sand bg-white p-5 sm:p-7">
              <legend className="mb-2 font-serif text-xl">Shipping address</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                {field("name", "Full name", { autoComplete: "name" })}
                {field("phone", "Mobile number", { autoComplete: "tel-national", inputMode: "numeric", maxLength: 10 })}
              </div>
              {field("email", "Email", { type: "email", autoComplete: "email" })}
              {field("line1", "Address (house, street, area)", { autoComplete: "street-address" })}
              <div className="grid gap-4 sm:grid-cols-3">
                {field("city", "City", { autoComplete: "address-level2" })}
                {field("state", "State", { autoComplete: "address-level1" })}
                {field("pin", "PIN code", { inputMode: "numeric", maxLength: 6, autoComplete: "postal-code" })}
              </div>
            </fieldset>
          )}

          {step === 1 && (
            <fieldset className="space-y-3 rounded-2xl border border-sand bg-white p-5 sm:p-7">
              <legend className="mb-2 font-serif text-xl">Delivery method</legend>
              {delivery.map((d) => (
                <label key={d.id} className={cn("flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4", dMethod === d.id ? "border-terracotta bg-terracotta/5" : "border-sand")}>
                  <input type="radio" name="delivery" checked={dMethod === d.id} onChange={() => setDMethod(d.id)} className="accent-terracotta" />
                  <d.icon aria-hidden className="h-5 w-5 text-indigo" />
                  <span className="flex-1"><span className="block font-medium">{d.label}</span><span className="text-sm text-ink-soft">{d.eta}</span></span>
                  <span className="text-sm font-semibold">{d.fee === 0 ? (t.shipping - extra === 0 ? "Free" : inr(t.shipping - extra)) : `+${inr(d.fee)}`}</span>
                </label>
              ))}
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="space-y-3 rounded-2xl border border-sand bg-white p-5 sm:p-7">
              <legend className="mb-2 font-serif text-xl">Payment method</legend>
              {payments.map((m) => (
                <div key={m.id} className={cn("rounded-xl border-2 p-4", pay === m.id ? "border-terracotta bg-terracotta/5" : "border-sand")}>
                  <label className="flex cursor-pointer items-center gap-4">
                    <input type="radio" name="payment" checked={pay === m.id} onChange={() => { setPay(m.id); setErrors({}); }} className="accent-terracotta" />
                    <m.icon aria-hidden className="h-5 w-5 text-indigo" />
                    <span className="flex-1"><span className="block font-medium">{m.label}</span><span className="text-sm text-ink-soft">{m.hint}</span></span>
                  </label>
                  {pay === m.id && m.id === "upi" && (
                    <div className="mt-4"><label htmlFor="upi" className="mb-1 block text-sm font-medium">UPI ID</label><input id="upi" className="input" placeholder="name@okbank" value={payInfo.upi} onChange={(e) => setPayInfo({ ...payInfo, upi: e.target.value })} aria-invalid={!!errors.upi} />{errors.upi && <p role="alert" className="mt-1 text-xs text-terracotta">{errors.upi}</p>}</div>
                  )}
                  {pay === m.id && m.id === "card" && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="sm:col-span-2"><label htmlFor="card" className="mb-1 block text-sm font-medium">Card number</label><input id="card" className="input" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" maxLength={19} value={payInfo.card} onChange={(e) => setPayInfo({ ...payInfo, card: e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim() })} />{errors.card && <p role="alert" className="mt-1 text-xs text-terracotta">{errors.card}</p>}</div>
                      <div><label htmlFor="expiry" className="mb-1 block text-sm font-medium">Expiry</label><input id="expiry" className="input" autoComplete="cc-exp" placeholder="MM/YY" maxLength={5} value={payInfo.expiry} onChange={(e) => setPayInfo({ ...payInfo, expiry: e.target.value })} />{errors.expiry && <p role="alert" className="mt-1 text-xs text-terracotta">{errors.expiry}</p>}</div>
                      <div><label htmlFor="cvv" className="mb-1 block text-sm font-medium">CVV</label><input id="cvv" type="password" className="input" inputMode="numeric" autoComplete="cc-csc" maxLength={3} value={payInfo.cvv} onChange={(e) => setPayInfo({ ...payInfo, cvv: e.target.value })} />{errors.cvv && <p role="alert" className="mt-1 text-xs text-terracotta">{errors.cvv}</p>}</div>
                    </div>
                  )}
                  {pay === m.id && m.id === "netbanking" && (
                    <div className="mt-4"><label htmlFor="bank" className="mb-1 block text-sm font-medium">Choose your bank</label><select id="bank" className="input" value={payInfo.bank} onChange={(e) => setPayInfo({ ...payInfo, bank: e.target.value })}>{banks.map((b) => <option key={b}>{b}</option>)}</select></div>
                  )}
                </div>
              ))}
              <p className="text-xs text-ink-soft">Demo checkout: payment details are validated for format only and never stored or sent anywhere.</p>
            </fieldset>
          )}

          {step === 3 && (
            <section aria-labelledby="review" className="space-y-5 rounded-2xl border border-sand bg-white p-5 sm:p-7">
              <h2 id="review" className="font-serif text-xl">Review your order</h2>
              <div className="grid gap-4 text-sm sm:grid-cols-3">
                <div><h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-ink-soft">Ship to</h3><p className="mt-1">{addr.name}<br />{addr.line1}<br />{addr.city}, {addr.state} {addr.pin}<br />{addr.phone}</p></div>
                <div><h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-ink-soft">Delivery</h3><p className="mt-1">{delivery.find((d) => d.id === dMethod)?.label}<br />{delivery.find((d) => d.id === dMethod)?.eta}</p></div>
                <div><h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-ink-soft">Payment</h3><p className="mt-1">{payments.find((m) => m.id === pay)?.label}{pay === "upi" && <><br />{payInfo.upi}</>}{pay === "card" && <><br />•••• {payInfo.card.slice(-4)}</>}{pay === "netbanking" && <><br />{payInfo.bank}</>}</p></div>
              </div>
              <ul className="divide-y divide-sand">
                {lines.map(({ p, qty }) => (
                  <li key={p.id} className="flex items-center gap-4 py-3 text-sm">
                    <SafeImage src={p.images[0]} alt="" className="h-16 w-14 rounded-lg object-cover" />
                    <span className="flex-1">{p.name}<span className="block text-xs text-ink-soft">Qty {qty}</span></span>
                    <span className="font-semibold">{inr(p.price * qty)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="flex justify-between gap-3">
            {step > 0 ? <button type="button" onClick={() => setStep(step - 1)} className="btn btn-outline">Back</button> : <Link href="/shop" className="btn btn-outline">Keep shopping</Link>}
            <button type="submit" className="btn btn-primary">{step === 3 ? `Place order · ${inr(t.total)}` : "Continue"}</button>
          </div>
        </form>

        <aside aria-label="Order summary" className="h-fit rounded-2xl border border-sand bg-white p-5 lg:sticky lg:top-32">
          <h2 className="mb-4 font-serif text-xl">Order summary</h2>
          <ul className="mb-4 space-y-3">
            {lines.map(({ p, qty }) => (
              <li key={p.id} className="flex gap-3 text-sm">
                <SafeImage src={p.images[0]} alt="" className="h-14 w-12 shrink-0 rounded-md object-cover" />
                <span className="line-clamp-2 flex-1">{p.name} <span className="text-ink-soft">× {qty}</span></span>
                <span>{inr(p.price * qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 border-t border-sand pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-ink-soft">Subtotal</dt><dd>{inr(t.subtotal)}</dd></div>
            {t.discount > 0 && <div className="flex justify-between text-forest"><dt>Coupon {coupon}</dt><dd>−{inr(t.discount)}</dd></div>}
            <div className="flex justify-between"><dt className="text-ink-soft">Shipping{pay === "cod" ? " + COD fee" : ""}</dt><dd>{t.shipping === 0 ? "Free" : inr(t.shipping)}</dd></div>
            <div className="flex justify-between border-t border-sand pt-3 text-base font-semibold"><dt>Total</dt><dd>{inr(t.total)}</dd></div>
            <p className="text-xs text-ink-soft">Includes {inr(t.includedTax)} GST</p>
          </dl>
        </aside>
      </div>
    </div>
  );
}
