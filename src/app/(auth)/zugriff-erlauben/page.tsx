import { ASSISTANT_CAN, ASSISTANT_CANNOT } from "@/components/features/assistants/capabilities";
import { ConsentButtons } from "@/components/features/auth/ConsentButtons";
import { ConsentSkeleton } from "@/components/layout/Skeletons";
import { auth } from "@/lib/auth/auth";
import { isAdminRole } from "@/lib/auth/roles";
import { getSession } from "@/lib/auth/utils";
import { Bot } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Zugriff erlauben",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** The assistant's registered name, or a neutral fallback if it has none. */
async function clientName(clientId: string | undefined) {
  if (!clientId) return null;
  try {
    const client = await auth.api.getOAuthClientPublic({
      query: { client_id: clientId },
      headers: await headers(),
    });
    return client.client_name ?? null;
  } catch {
    return null;
  }
}

/** Who asks and whether this person may answer yes; everything else on the page is fixed. */
async function Request({ searchParams }: { searchParams: SearchParams }) {
  const { client_id, redirect_uri } = await searchParams;
  const session = await getSession();
  if (!session?.user) {
    return (
      <p className="mt-6 text-[17px]">
        Deine Anmeldung ist abgelaufen.{" "}
        <Link href="/anmelden" className="font-semibold text-primary underline">
          Melde dich an
        </Link>{" "}
        und starte die Verbindung im KI-Assistenten neu.
      </p>
    );
  }
  const isAdmin = isAdminRole(session.user.role);
  const name = await clientName(typeof client_id === "string" ? client_id : undefined);
  // Anyone can register an assistant under any name; where the access goes can't be faked.
  const target = typeof redirect_uri === "string" ? URL.parse(redirect_uri)?.host : undefined;

  return (
    <>
      <p className="mt-6 text-[17px]">
        <strong className="font-semibold">{name ?? "Ein KI-Assistent"}</strong> möchte in deinem
        Namen auf den Arbeitsplan zugreifen.
      </p>
      {target && (
        <p className="mt-2 text-[15px] text-muted-foreground">
          Der Zugriff geht an <strong className="font-semibold text-foreground">{target}</strong>.
          Erlaube ihn nur, wenn du die Verbindung gerade selbst dort gestartet hast.
        </p>
      )}
      {!isAdmin && (
        <p role="alert" className="mt-4 text-[17px] text-destructive">
          Nur Organisatoren können KI-Assistenten verbinden.
        </p>
      )}
      <ConsentButtons canAllow={isAdmin} />
    </>
  );
}

export default function ConsentPage(props: { searchParams: SearchParams }) {
  return (
    <main id="main-content" className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6 md:py-16">
      <div className="rounded-xl border bg-muted p-6 md:p-10">
        <Bot className="size-10 text-primary" aria-hidden="true" />
        <h1 className="mt-5 text-[44px] md:text-[56px]">Zugriff erlauben</h1>
        <Suspense fallback={<ConsentSkeleton />}>
          <Request searchParams={props.searchParams} />
        </Suspense>

        <div className="mt-8 border-t pt-6">
          <p className="text-[15px] font-semibold">Der Assistent kann dann:</p>
          <ul className="mt-3 grid list-disc gap-2 pl-5 text-[15px] text-muted-foreground">
            {ASSISTANT_CAN.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-[15px] text-muted-foreground">{ASSISTANT_CANNOT}</p>
        </div>
      </div>
    </main>
  );
}
