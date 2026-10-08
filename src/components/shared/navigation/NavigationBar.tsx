import { Suspense } from "react";
import BrandLogo from "./BrandLogo";
import { SessionNav, SessionNavPlaceholder } from "./SessionNav";

interface NavigationBarProps {
  showLogoOnly?: boolean;
}

export default function NavigationBar({ showLogoOnly = false }: NavigationBarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background print:hidden">
      <nav
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        aria-label="Hauptnavigation"
      >
        <BrandLogo />
        {!showLogoOnly && (
          <Suspense fallback={<SessionNavPlaceholder />}>
            <SessionNav />
          </Suspense>
        )}
      </nav>
    </header>
  );
}
