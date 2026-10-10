import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

/** Same footer as kg-eventplan: club, motto, legal links and the theme switch. */
const Footer = () => {
  return (
    <footer className="mx-auto mt-16 flex w-full max-w-6xl items-center justify-between gap-6 border-t px-4 pt-6.75 pb-8 text-xs max-md:flex-wrap max-md:justify-center max-md:gap-x-5 max-md:gap-y-3 max-md:py-6 max-md:text-center sm:px-6 lg:px-8 print:hidden">
      {/* Phones: links and toggle on top, the club centered below. */}
      <div className="max-md:order-4 max-md:basis-full">
        <Link
          href="/"
          className="relative block py-1 font-semibold after:absolute after:inset-x-0 after:-inset-y-2.5"
        >
          KG Knallköpp Golkrath e.V.
        </Link>
        <span className="text-muted-foreground">Karneval zum Anfassen. Seit 1929.</span>
      </div>
      <p className="flex-1 text-center italic max-md:hidden">Jolkere Knall Mött!</p>
      <nav
        aria-label="Rechtliches"
        className="flex gap-5 max-md:order-1 max-md:gap-3.75 [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a:hover]:underline"
      >
        <Link href="/datenschutz">Datenschutz</Link>
        <Link href="/nutzungsbedingungen">Nutzungsbedingungen</Link>
      </nav>
      <span aria-hidden className="h-4 w-px self-center bg-border max-md:order-2" />
      {/* Pulled in so the icon, not the button's edge, sits one gap from the rule. */}
      <ThemeToggle className="-ml-3 max-md:order-3" />
    </footer>
  );
};

export default Footer;
