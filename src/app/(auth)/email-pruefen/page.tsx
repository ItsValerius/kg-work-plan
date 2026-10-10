import { Mail } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Bestätigungsmail gesendet",
};

interface VerifyRequestPageProps {
  searchParams: Promise<{ email?: string }>;
}

const steps = [
  "Prüfe dein E-Mail-Postfach (auch den Spam-Ordner).",
  "Klicke auf den Link in der E-Mail, um dich anzumelden.",
  "Du wirst automatisch zur Anwendung weitergeleitet.",
];

/** "…geschickt an <email>." – the only part of the page that waits for the URL. */
async function SentTo({ searchParams }: VerifyRequestPageProps) {
  const { email } = await searchParams;
  return email ? (
    <>
      {" "}
      an <strong className="font-semibold break-all text-foreground">{email}</strong>.
    </>
  ) : (
    "."
  );
}

/** The retry link keeps the address, so the sign-in form comes back filled in. */
async function RetryLink({ searchParams }: VerifyRequestPageProps) {
  const { email } = await searchParams;
  return (
    <RetryAnchor href={email ? `/anmelden?email=${encodeURIComponent(email)}` : "/anmelden"} />
  );
}

function RetryAnchor({ href }: { href: string }) {
  return (
    <Link href={href} className="font-semibold text-primary underline">
      versuche es erneut
    </Link>
  );
}

const VerifyRequestPage = (props: VerifyRequestPageProps) => {
  return (
    <main id="main-content" className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6 md:py-16">
      <div className="rounded-xl border bg-muted p-6 md:p-10">
        <Mail className="size-10 text-primary" aria-hidden="true" />
        <h1 className="mt-5 text-[44px] md:text-[56px]">Schau in dein Postfach</h1>
        <p className="mt-3 text-[17px] text-muted-foreground">
          Wir haben dir eine E-Mail mit einem Anmeldelink geschickt
          <Suspense fallback=".">
            <SentTo searchParams={props.searchParams} />
          </Suspense>
        </p>

        <ol className="mt-8 grid gap-4">
          {steps.map((step, index) => (
            <li key={step} className="grid grid-cols-[36px_1fr] items-baseline gap-2 text-[17px]">
              <span className="tabular font-display text-[26px] leading-none font-bold text-primary">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <p className="mt-8 border-t pt-6 text-[15px] text-muted-foreground">
          Keine E-Mail erhalten? Überprüfe deine Eingabe oder{" "}
          <Suspense fallback={<RetryAnchor href="/anmelden" />}>
            <RetryLink searchParams={props.searchParams} />
          </Suspense>
          .
        </p>
      </div>
    </main>
  );
};

export default VerifyRequestPage;
