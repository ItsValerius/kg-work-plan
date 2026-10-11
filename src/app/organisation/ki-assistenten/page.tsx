import { ASSISTANT_CAN, ASSISTANT_CANNOT } from "@/components/features/assistants/capabilities";
import { DisconnectAssistantButton } from "@/components/features/assistants/DisconnectAssistantButton";
import { PageContainer } from "@/components/layout/PageContainer";
import { getAssistantConnections } from "@/domains/assistants/queries";
import { MCP_RESOURCE } from "@/lib/auth/auth";
import { requireAdminUserId } from "@/lib/auth/utils";
import { formatDate } from "@/lib/datetime";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "KI-Assistenten",
};

const steps = [
  "Lege im Assistenten einen eigenen MCP-Server oder Connector an (in ChatGPT: Plugins → + → „Benutzerdefinierten MCP-Server hinzufügen“) und trage als Server-URL ein:",
  "Wähle als Authentifizierung „OAuth“ und bestätige („Als Plugin erstellen“).",
  "Melde dich hier an, wenn der Assistent dich herschickt, und erlaube den Zugriff.",
];

/** Where the assistant comes from, e.g. "chatgpt.com", to tell same-named entries apart. */
function host(uri: string | null) {
  return uri ? URL.parse(uri)?.host : undefined;
}

const AssistantsPage = async () => {
  const userId = await requireAdminUserId("/organisation/ki-assistenten");
  const connections = await getAssistantConnections(userId);

  return (
    <PageContainer>
      <div className="mx-auto max-w-2xl">
        <Link
          href="/organisation"
          className="inline-flex min-h-11 items-center gap-2 rounded-md pr-2 text-[15px] font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Zurück zur Organisation
        </Link>
        <h1 className="mt-4 text-[44px] md:text-[56px]">KI-Assistenten</h1>
        <p className="mt-2 text-[17px] text-muted-foreground">
          Verbinde ChatGPT, Claude oder einen anderen KI-Assistenten mit dem Arbeitsplan. Er kann
          dann:
        </p>
        <ul className="mt-3 grid list-disc gap-2 pl-5 text-[17px] text-muted-foreground">
          {ASSISTANT_CAN.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-3 text-[17px] text-muted-foreground">{ASSISTANT_CANNOT}</p>

        <section aria-labelledby="verbindungen" className="mt-10">
          <h2 id="verbindungen" className="text-[32px]">
            Deine Verbindungen
          </h2>
          {connections.length === 0 ? (
            <p className="mt-3 text-[17px] text-muted-foreground">
              Noch kein KI-Assistent verbunden.
            </p>
          ) : (
            <ul className="mt-3 border-t">
              {connections.map((connection) => {
                const name = connection.name ?? "Unbenannter Assistent";
                const from = host(connection.uri);
                return (
                  <li
                    key={connection.clientId}
                    className="flex items-center justify-between gap-4 border-b py-4"
                  >
                    <div className="min-w-0">
                      <p className="text-[17px] font-semibold wrap-break-word">{name}</p>
                      <p className="text-[15px] text-muted-foreground">
                        {from && <>{from} · </>}verbunden am {formatDate(connection.connectedAt)}
                      </p>
                    </div>
                    <DisconnectAssistantButton clientId={connection.clientId} name={name} />
                  </li>
                );
              })}
            </ul>
          )}
          <p className="mt-3 text-[15px] text-muted-foreground">
            Trennen wirkt sofort. Verlierst du die Organisator-Rolle, sind alle Verbindungen
            ebenfalls gesperrt.
          </p>
        </section>

        <section
          aria-labelledby="verbinden"
          className="mt-10 rounded-xl border bg-muted p-6 md:p-9"
        >
          <h2 id="verbinden" className="text-[32px]">
            Neuen Assistenten verbinden
          </h2>
          <ol className="mt-5 grid gap-4">
            {steps.map((step, index) => (
              <li key={step} className="grid grid-cols-[36px_1fr] items-baseline gap-2 text-[17px]">
                <span className="tabular font-display text-[26px] leading-none font-bold text-primary">
                  {index + 1}
                </span>
                <span>
                  {step}
                  {index === 0 && (
                    <code className="mt-2 block rounded-md border bg-background px-3 py-2 text-[15px] break-all select-all">
                      {MCP_RESOURCE}
                    </code>
                  )}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </PageContainer>
  );
};

export default AssistantsPage;
