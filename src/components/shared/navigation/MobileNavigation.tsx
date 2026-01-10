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
import type { NavItem } from "./types";
import { LogoutButton } from "@/components/features/auth/LogoutButton";

interface MobileNavigationProps {
    items: NavItem[];
}

export function MobileNavigation({ items }: MobileNavigationProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex lg:hidden items-center gap-1 shrink-0">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Menü öffnen">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle className="sr-only">Navigation</SheetTitle>
                        <SheetDescription className="sr-only">
                            Hauptnavigation und Menüoptionen
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-2 mt-6">
                        <NavItems items={items} mobile onItemClick={() => setIsOpen(false)} />
                        <div className="pt-4 border-t">
                            <LogoutButton showText />
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

