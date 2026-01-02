"use client";

import { NavItems } from "./NavItems";
import { LogoutButton } from "../auth/LogoutButton";
import type { NavItem } from "./types";

interface DesktopNavigationProps {
  items: NavItem[];
}

export function DesktopNavigation({ items }: DesktopNavigationProps) {
  return (
    <div className="hidden lg:flex items-center gap-1">
      <NavItems items={items} />
      <LogoutButton showText />
    </div>
  );
}

