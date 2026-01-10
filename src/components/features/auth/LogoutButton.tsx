"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogOut, Loader2, AlertTriangle } from "lucide-react";
import { authClient } from "@/lib/auth/client";

interface LogoutButtonProps {
    showText?: boolean;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function LogoutButton({ showText = false, variant = "ghost" }: LogoutButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);

    const handleSignOut = async () => {
        startTransition(async () => {
            try {
                await authClient.signOut();
                setOpen(false);
                // Navigate to home page - router.push will trigger a fresh server-side fetch
                router.push("/");
            } catch (error) {
                console.error("Sign out error:", error);
                // Still redirect even if there's an error
                setOpen(false);
                router.push("/");
            }
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant={variant}
                    size={showText ? "default" : "icon"}
                    className={showText ? "h-9 gap-2 w-full justify-start" : "h-9 w-9"}
                    aria-label="Abmelden"
                    disabled={isPending}
                >
                    {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                    )}
                    {showText && (
                        <span>Abmelden</span>
                    )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-6 w-6 text-destructive" />
                        </div>
                        <div className="flex-1">
                            <AlertDialogTitle className="text-xl">
                                Abmelden bestätigen
                            </AlertDialogTitle>
                        </div>
                    </div>
                    <AlertDialogDescription className="text-base pt-2">
                        Bist du sicher, dass du dich abmelden möchtest?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:gap-0">
                    <AlertDialogCancel disabled={isPending} className="mt-0">
                        Abbrechen
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleSignOut}
                        disabled={isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Wird abgemeldet...
                            </>
                        ) : (
                            <>
                                <LogOut className="mr-2 h-4 w-4" />
                                Abmelden
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

