/**
 * ROOT LAYOUT: wraps every page.
 * Loads the two fonts (Playfair Display for headings, Inter for body), sets the site-wide
 * SEO title/description, and renders the parts shared by all pages: skip-link, Navbar,
 * the page content, Footer and the slide-over CartDrawer.
 */
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/frontend/components/Navbar";
import Footer from "@/frontend/components/Footer";
import CartDrawer from "@/frontend/components/CartDrawer";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: { default: "KalaSutra | Artisan Handicrafts & Handloom", template: "%s | KalaSutra" },
  description: "Preserving heritage, empowering artisans. Authentic GI-tagged handloom, pottery, brass and wood crafts direct from India's artisan clusters.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
