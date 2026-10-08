"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { NavItems } from "./NavItems";
import { adminNavItem, navItems } from "./navItemsData";
import { LogoutButton } from "@/components/features/auth/LogoutButton";

interface MobileNavigationProps {
    isAdmin: boolean;
}

export function MobileNavigation({ isAdmin }: MobileNavigationProps) {
    const items = isAdmin ? [...navItems, adminNavItem] : navItems;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex lg:hidden items-center gap-1 shrink-0">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" className="gap-2 px-3.5" aria-label="Menü öffnen">
                        <Menu className="size-5" />
                        <span>Menü</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle className="sr-only">Navigation</SheetTitle>
                        <SheetDescription className="sr-only">
                            Hauptnavigation und Menüoptionen
                        </SheetDescription>
                    </SheetHeader>
                    <nav className="flex flex-col gap-1 mt-8" aria-label="Hauptnavigation">
                        <NavItems items={items} mobile onItemClick={() => setIsOpen(false)} />
                        <div className="mt-3 pt-3 border-t">
                            <LogoutButton showText />
                        </div>
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
    );
}

