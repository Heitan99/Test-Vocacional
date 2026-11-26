import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "voca — Descubrí tu perfil vocacional",
    template: "%s · voca",
  },
  description:
    "Un test vocacional de 18 preguntas que ilumina tu cerebro según tus intereses. Perfil RIASEC, carreras sugeridas y una tarjeta para compartir.",
  keywords: [
    "test vocacional",
    "RIASEC",
    "orientación vocacional",
    "carreras",
    "perfil profesional",
  ],
  openGraph: {
    title: "voca — Descubrí tu perfil vocacional",
    description:
      "18 preguntas. Tu cerebro se ilumina por zonas. Al final, tu perfil y las carreras donde más te vas a parecer a vos.",
    type: "website",
    locale: "es_AR",
    siteName: "voca",
  },
  twitter: {
    card: "summary_large_image",
    title: "voca — Descubrí tu perfil vocacional",
    description:
      "18 preguntas. Un cerebro que se ilumina. Un perfil vocacional para compartir.",
  },
};

export const viewport: Viewport = {
  themeColor: "#05060b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body
        className={`${sora.variable} min-h-svh bg-[#05060b] font-sans text-[#f4f6ff] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
