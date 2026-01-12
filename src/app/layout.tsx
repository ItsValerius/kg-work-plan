import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    template: "%s | KG Knallköpp Golkrath Arbeitsplan",
    default: "KG Knallköpp Golkrath Arbeitsplan",
  },
  description: "Arbeitsplan für Veranstaltungen der KG Knallköpp Golkrath e.V.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <a href="#main-content" className="skip-to-content">
          Zum Hauptinhalt springen
        </a>
        {children}
        <Toaster richColors={true} position="top-right" />
      </body>
    </html>
  );
}
