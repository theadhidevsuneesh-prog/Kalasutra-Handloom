export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const FREE_SHIPPING_THRESHOLD = 2999;
export const SHIPPING_FEE = 149;

export const COUPONS: Record<string, { label: string; type: "percent"; value: number; min: number }> = {
  HERITAGE10: { label: "10% off your order", type: "percent", value: 10, min: 0 },
  WEAVE15: { label: "15% off orders above ₹5,000", type: "percent", value: 15, min: 5000 },
};

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
