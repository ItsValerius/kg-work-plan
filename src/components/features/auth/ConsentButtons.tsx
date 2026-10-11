"use client";

import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

/**
 * Allow or deny an AI assistant's access. The client plugin sends the signed OAuth query
 * from this page's URL; the answer is the assistant's callback URL to continue to.
 */
export function ConsentButtons({ canAllow }: { canAllow: boolean }) {
  const [pending, setPending] = useState<"allow" | "deny" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const answer = async (accept: boolean) => {
    setPending(accept ? "allow" : "deny");
    setError(null);
    const { data, error } = await authClient.oauth2.consent({ accept });
    const next = data?.url;
    if (error || !next) {
      setPending(null);
      setError("Das hat nicht geklappt. Starte die Verbindung im KI-Assistenten bitte neu.");
      return;
    }
    window.location.href = next;
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row">
        {canAllow && (
          <Button onClick={() => answer(true)} disabled={pending !== null} className="sm:flex-1">
            {pending === "allow" && <Loader2 className="animate-spin" aria-hidden="true" />}
            Zugriff erlauben
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => answer(false)}
          disabled={pending !== null}
          className="sm:flex-1"
        >
          {pending === "deny" && <Loader2 className="animate-spin" aria-hidden="true" />}
          Ablehnen
        </Button>
      </div>
      {error && (
        <p role="alert" className="mt-4 text-[15px] text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
