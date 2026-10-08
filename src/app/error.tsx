"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { logger } from "@/lib/logger";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Route error", error, { digest: error.digest });
  }, [error]);

  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col justify-center px-4 py-16 sm:px-6"
    >
      <Image src="/logo.png" alt="" width={88} height={88} className="size-20" />
      <h1 className="mt-6 text-[44px] md:text-[56px]">Da ist etwas schiefgelaufen</h1>
      <p className="mt-3 text-[17px] text-muted-foreground">
        Die Seite konnte gerade nicht geladen werden. Das liegt nicht an dir – versuch es bitte noch
        einmal. Deine Einträge sind dadurch nicht verloren.
      </p>
      {error.digest && (
        <p className="mt-3 text-sm text-muted-foreground">
          Fehlercode für Rückfragen: {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={reset}>Noch einmal versuchen</Button>
        <Link href="/events" className={buttonVariants({ variant: "outline" })}>
          Zu den Veranstaltungen
        </Link>
      </div>
    </main>
  );
}
