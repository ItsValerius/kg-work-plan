import { SignInForm } from "@/components/features/auth/SignInForm";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Anmelden",
};

export default async function SignInPage(props: {
  searchParams: Promise<{ callbackUrl?: string; email?: string }>;
}) {
  const { callbackUrl, email } = await props.searchParams;
  const comesFromSignUp = callbackUrl?.includes("#aufgabe-") ?? false;
  // Only same-site paths are valid targets for the back link.
  const isInternal = !!callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//");
  const back =
    comesFromSignUp && isInternal
      ? { href: callbackUrl, label: "Zurück zur Veranstaltung" }
      : { href: "/events", label: "Alle Veranstaltungen" };

  return (
    <main
      id="main-content"
      className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1fr_minmax(0,440px)] md:items-center md:gap-16 md:py-16 lg:px-8"
    >
      <div>
        <Link
          href={back.href}
          className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-md pr-2 text-[15px] font-semibold text-primary hover:underline md:mb-8"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {back.label}
        </Link>
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
          {comesFromSignUp
            ? "Damit wir wissen, wer hilft, melde dich kurz an. Danach geht es direkt zurück zur Aufgabe."
            : "Melde dich an, um dich für Aufgaben einzutragen und deine Einsätze zu sehen."}
        </p>
      </div>

      <div className="rounded-xl border bg-muted p-6 md:p-9">
        <p className="mb-5 text-[17px] font-semibold">
          Kein Passwort nötig: Wir schicken dir einen Anmeldelink per E-Mail.
        </p>
        <SignInForm callbackUrl={callbackUrl} initialEmail={email} />
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Deine E-Mail-Adresse brauchen wir, um Missbrauch zu vermeiden. Ansonsten schreiben wir dir
          nur bei Änderungen oder Rückfragen zu deiner Anmeldung.
        </p>
      </div>
    </main>
  );
}
