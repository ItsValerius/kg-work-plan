"use client";

import { NavItems } from "./NavItems";
import { LogoutButton } from "@/components/features/auth/LogoutButton";
import { adminNavItem, navItems } from "./navItemsData";

interface DesktopNavigationProps {
  isAdmin: boolean;
}

export function DesktopNavigation({ isAdmin }: DesktopNavigationProps) {
  const items = isAdmin ? [...navItems, adminNavItem] : navItems;
  return (
    <div className="hidden lg:flex items-center">
      <NavItems items={items} />
      <div className="ml-2 border-l pl-2">
        <LogoutButton showText />
      </div>
    </div>
  );
}
