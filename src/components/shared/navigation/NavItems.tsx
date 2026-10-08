"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "./types";

interface NavItemsProps {
  items: NavItem[];
  mobile?: boolean;
  onItemClick?: () => void;
}

function isActiveRoute(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavItems({ items, mobile = false, onItemClick }: NavItemsProps) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = isActiveRoute(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-2.5 font-semibold transition-colors",
              mobile
                ? "min-h-12 rounded-md px-3 text-[17px] hover:bg-muted aria-[current=page]:bg-accent aria-[current=page]:text-primary-dark"
                : "relative h-16 px-3 text-[15px] text-foreground after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:rounded-t-sm after:bg-primary after:opacity-0 after:transition-opacity hover:text-primary aria-[current=page]:text-primary aria-[current=page]:after:opacity-100",
            )}
          >
            <Icon className={mobile ? "size-5" : "size-4"} aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );
}
