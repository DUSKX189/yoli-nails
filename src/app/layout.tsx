import type { Metadata } from "next";
import { Kalnia, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import Header from "@/components/header";
import Footer from "@/components/footer";

// Ambas familias son variables: sin `weight` se descarga un único fichero por familia.
const kalnia = Kalnia({
  variable: "--font-display",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-body",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: "YOLI NAILS | Salón de belleza y uñas",
    template: "%s | YOLI NAILS",
  },
  description:
    "YOLI NAILS — Manicura, pedicura, pestañas, depilación y tienda de productos profesionales de belleza en Salamanca, Madrid. Realza tu belleza, eleva tu confianza.",
  openGraph: {
    siteName: "YOLI NAILS",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${kalnia.variable} ${cormorant.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
