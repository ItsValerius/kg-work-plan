import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ZodLocale } from "@/components/layout/ZodLocale";
import { ThemeProvider } from "next-themes";

const barlow = localFont({
  src: "./fonts/BarlowCondensed-Bold.woff2",
  variable: "--font-barlow",
  weight: "700",
  display: "swap",
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
    // next-themes sets the dark class before hydration.
    <html lang="de" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={barlow.variable}>
        <a href="#main-content" className="skip-to-content">
          Zum Hauptinhalt springen
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-center" />
          <ZodLocale />
        </ThemeProvider>
      </body>
    </html>
  );
}
