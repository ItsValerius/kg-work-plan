"use client";

import { authClient } from "@/lib/auth/client";
import { useEffect } from "react";

/**
 * Continues an AI assistant's connection in this window once the magic link (opened in
 * another tab of the same browser) has signed the person in. The assistant keeps its
 * login state in this window, so the flow has to finish here.
 */
export function ContinueWhenSignedIn({ next }: { next: string }) {
  useEffect(() => {
    let done = false;
    const check = async () => {
      if (done) return;
      const { data } = await authClient.getSession();
      if (data?.session && !done) {
        done = true;
        window.location.replace(next);
      }
    };
    const timer = setInterval(check, 2000);
    // Coming back to this tab after clicking the link continues at once.
    window.addEventListener("focus", check);
    return () => {
      done = true;
      clearInterval(timer);
      window.removeEventListener("focus", check);
    };
  }, [next]);

  return (
    <p role="status" className="mt-6 rounded-lg border bg-background p-4 text-[17px]">
      Öffne den Link im selben Browser. Sobald du angemeldet bist, geht es hier automatisch weiter
      zum Verbinden des KI-Assistenten.
    </p>
  );
}
