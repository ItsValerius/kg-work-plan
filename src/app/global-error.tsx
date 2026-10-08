"use client";

import "./globals.css";

// Shown only when the root layout itself fails, so it brings its own <html> and <body>.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="de">
      <body>
        <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-4 py-16">
          <h1 className="text-[44px]">Da ist etwas schiefgelaufen</h1>
          <p className="mt-3 text-[17px] text-muted-foreground">
            Der Arbeitsplan konnte gerade nicht geladen werden. Bitte versuch es in einem Moment
            noch einmal.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-8 min-h-11 self-start rounded-lg bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary-dark"
          >
            Noch einmal versuchen
          </button>
        </main>
      </body>
    </html>
  );
}
