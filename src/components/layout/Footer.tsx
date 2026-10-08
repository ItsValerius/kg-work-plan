import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-16 border-t bg-muted print:hidden">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-6 text-sm text-muted-foreground sm:px-6 lg:px-8">
        <p>KG Knallköpp Golkrath e.V.</p>
        <nav aria-label="Rechtliches" className="flex gap-5">
          <Link href="/datenschutz" className="hover:text-primary hover:underline">
            Datenschutz
          </Link>
          <Link href="/nutzungsbedingungen" className="hover:text-primary hover:underline">
            Nutzungsbedingungen
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
