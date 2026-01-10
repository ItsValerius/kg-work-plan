"use client";

import { DesktopNavigation } from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";
import { navItems, adminNavItem } from "./types";
import SignInButton from "@/components/features/auth/SignInButton";
import BrandLogo from "./BrandLogo";

interface NavigationBarProps {
  isAdmin?: boolean;
  showSignInButton?: boolean;
}

export default function NavigationBar({
  isAdmin = false,
  showSignInButton = false
}: NavigationBarProps) {
  const allNavItems = isAdmin ? [...navItems, adminNavItem] : navItems;

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      aria-label="Hauptnavigation"
    >
      <div className="w-full max-w-7xl mx-auto flex h-14 items-center px-4 sm:px-6 lg:px-8">
        <BrandLogo />
        <div className="flex-1" />
        {showSignInButton ? (
          <SignInButton />
        ) : (
          <>
            <DesktopNavigation items={allNavItems} />
            <MobileNavigation items={allNavItems} />
          </>
        )}
      </div>
    </nav>
  );
}

