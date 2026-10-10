import { SignInForm } from "@/components/features/auth/SignInForm";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Anmelden",
};

type SearchParams = Promise<{ callbackUrl?: string; email?: string }>;

const DEFAULT_BACK = { href: "/veranstaltungen", label: "Alle Veranstaltungen" };
const DEFAULT_INTRO =
  "Melde dich an, um dich für Aufgaben einzutragen und deine Einsätze zu sehen.";

/** What the URL changes on this page: a sign-up link brings the helper back to its task. */
async function readOrigin(searchParams: SearchParams) {
  const { callbackUrl, email } = await searchParams;
  const comesFromSignUp = callbackUrl?.includes("#aufgabe-") ?? false;
  // Only same-site paths are valid targets for the back link.
  // Resolve it like a browser would, so "//host" and "/\host" count as external.
  const isInternal =
    !!callbackUrl && URL.parse(callbackUrl, "http://intern")?.origin === "http://intern";
  return {
    callbackUrl,
    email,
    back:
      comesFromSignUp && isInternal
        ? { href: callbackUrl, label: "Zurück zur Veranstaltung" }
        : DEFAULT_BACK,
    intro: comesFromSignUp
      ? "Damit wir wissen, wer hilft, melde dich kurz an. Danach geht es direkt zurück zur Aufgabe."
      : DEFAULT_INTRO,
  };
}

function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-md pr-2 text-[15px] font-semibold text-primary hover:underline md:mb-8"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      {label}
    </Link>
  );
}

async function OriginBackLink({ searchParams }: { searchParams: SearchParams }) {
  return <BackLink {...(await readOrigin(searchParams)).back} />;
}

async function OriginIntro({ searchParams }: { searchParams: SearchParams }) {
  return <>{(await readOrigin(searchParams)).intro}</>;
}

async function OriginForm({ searchParams }: { searchParams: SearchParams }) {
  const { callbackUrl, email } = await readOrigin(searchParams);
  return <SignInForm callbackUrl={callbackUrl} initialEmail={email} />;
}

/**
 * Static apart from three small parts that read the URL (back link, intro, the form's
 * return target and prefilled email); each falls back to its plain version meanwhile.
 */
export default function SignInPage(props: { searchParams: SearchParams }) {
  return (
    <main
      id="main-content"
      className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1fr_minmax(0,440px)] md:items-center md:gap-16 md:py-16 lg:px-8"
    >
      <div>
        <Suspense fallback={<BackLink {...DEFAULT_BACK} />}>
          <OriginBackLink searchParams={props.searchParams} />
        </Suspense>
        <div className="flex items-center gap-4 md:block">
          <Image
            src="/logo.png"
            alt=""
            width={112}
            height={112}
            priority
            className="hidden md:block md:size-28"
          />
          <h1 className="text-[48px] md:mt-6 md:text-[62px]">Anmelden</h1>
        </div>
        <p className="mt-4 max-w-[46ch] text-[17px] leading-relaxed text-muted-foreground">
          <Suspense fallback={DEFAULT_INTRO}>
            <OriginIntro searchParams={props.searchParams} />
          </Suspense>
        </p>
      </div>

      <div className="rounded-xl border bg-muted p-6 md:p-9">
        <p className="mb-5 text-[17px] font-semibold">
          Kein Passwort nötig: Wir schicken dir einen Anmeldelink per E-Mail.
        </p>
        <Suspense fallback={<SignInForm />}>
          <OriginForm searchParams={props.searchParams} />
        </Suspense>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Deine E-Mail-Adresse brauchen wir, um Missbrauch zu vermeiden. Ansonsten schreiben wir dir
          nur bei Änderungen oder Rückfragen zu deiner Anmeldung.
        </p>
      </div>
    </main>
  );
}
