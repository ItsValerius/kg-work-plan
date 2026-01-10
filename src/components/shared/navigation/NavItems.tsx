"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NavItem } from "./types";

interface NavItemsProps {
  items: NavItem[];
  mobile?: boolean;
  onItemClick?: () => void;
}

function isActiveRoute(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  // Only match sub-routes for specific paths, not for root-like paths
  if (href === "/events" && pathname.startsWith("/events/")) return true;
  if (href === "/meine-aufgaben" && pathname.startsWith("/meine-aufgaben")) return true;
  if (href === "/profile" && pathname.startsWith("/profile")) return true;
  if (href === "/dashboard" && pathname.startsWith("/dashboard")) return true;
  return false;
}

export function NavItems({ items, mobile = false, onItemClick }: NavItemsProps) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = isActiveRoute(pathname, item.href);
        const className = mobile
          ? "w-full justify-start"
          : "h-9 gap-2";

        return (
          <Button
            key={item.href}
            asChild
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              className,
              !mobile && isActive && "bg-secondary font-medium"
            )}
            aria-current={isActive ? "page" : undefined}
            onClick={onItemClick}
          >
            <Link href={item.href}>
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span className={mobile ? "" : "hidden md:inline-block"}>
                {item.label}
              </span>
            </Link>
          </Button>
        );
      })}
    </>
  );
}

