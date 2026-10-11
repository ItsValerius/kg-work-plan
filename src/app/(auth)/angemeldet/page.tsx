import { CircleCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Angemeldet",
};

/**
 * Where the magic link lands while an AI assistant connects. The connection continues in
 * the window that asked for the link (see ContinueWhenSignedIn), not in this tab.
 */
export default function SignedInPage() {
  return (
    <main id="main-content" className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6 md:py-16">
      <div className="rounded-xl border bg-muted p-6 md:p-10">
        <CircleCheck className="size-10 text-primary" aria-hidden="true" />
        <h1 className="mt-5 text-[44px] md:text-[56px]">Du bist angemeldet</h1>
        <p className="mt-3 text-[17px] text-muted-foreground">
          Geh zurück zum Fenster, in dem du den KI-Assistenten verbindest. Dort geht es automatisch
          weiter. Diesen Tab kannst du schließen.
        </p>
      </div>
    </main>
  );
}
