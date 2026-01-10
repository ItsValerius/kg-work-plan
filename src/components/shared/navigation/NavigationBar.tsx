"use client";

import { DesktopNavigation } from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";
import { navItems, adminNavItem } from "./navItemsData";
import SignInButton from "@/components/features/auth/SignInButton";
import BrandLogo from "./BrandLogo";

interface NavigationBarProps {
  isAdmin?: boolean;
  showSignInButton?: boolean;
  showLogoOnly?: boolean;
}

export default function NavigationBar({
  isAdmin = false,
  showSignInButton = false,
  showLogoOnly = false,
}: NavigationBarProps) {
  const navItemsToShow = isAdmin ? [...navItems, adminNavItem] : navItems;
  const showNavigationContent = !showLogoOnly;

  let navigationContent = null;
  if (showNavigationContent && showSignInButton) {
    navigationContent = <SignInButton />;
  } else if (showNavigationContent) {
    navigationContent = (
      <>
        <DesktopNavigation items={navItemsToShow} />
        <MobileNavigation items={navItemsToShow} />
      </>
    );
  }

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      aria-label="Hauptnavigation"
    >
      <div className="w-full max-w-7xl mx-auto flex h-14 items-center px-4 sm:px-6 lg:px-8">
        <BrandLogo />
        {showNavigationContent && <div className="flex-1" />}
        {navigationContent}
      </div>
    </nav>
  );
}

