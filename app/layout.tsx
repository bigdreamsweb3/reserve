import type { Metadata } from "next";
import { Archivo, Cormorant_SC } from "next/font/google";

import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cormorantSc = Cormorant_SC({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Reserve | Apartments & Restaurant",
  description:
    "Reserve is a trusted restaurant and hospitality destination offering quality meals, fair pricing, respectful service, and serviced apartments in one property.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${cormorantSc.variable}`}>{children}</body>
    </html>
  );
}
