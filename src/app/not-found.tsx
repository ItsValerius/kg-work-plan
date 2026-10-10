import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-4 py-16 sm:px-6"
    >
      <Image src="/logo.png" alt="" width={88} height={88} className="size-20" />
      <h1 className="mt-6 text-[48px] md:text-[62px]">Seite nicht gefunden</h1>
      <p className="mt-3 text-[17px] text-muted-foreground">
        Diese Seite gibt es nicht (mehr). Vielleicht wurde die Veranstaltung oder Aufgabe gelöscht.
      </p>
      <Link href="/veranstaltungen" className={cn(buttonVariants(), "mt-8 self-start")}>
        Zu den Veranstaltungen
      </Link>
    </main>
  );
}
