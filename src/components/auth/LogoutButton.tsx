"use client";

import { useTransition } from "react";
import { Button } from "../ui/button";
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
} from "../ui/alert-dialog";
import { LogOut, Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";

interface LogoutButtonProps {
    showText?: boolean;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function LogoutButton({ showText = false, variant = "ghost" }: LogoutButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleSignOut = () => {
        startTransition(() => {
            signOut();
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant={variant}
                    size={showText ? "default" : "icon"}
                    className={showText ? "h-9 gap-2 w-full justify-start" : "h-9 w-9"}
                    aria-label="Abmelden"
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
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Abmelden bestätigen</AlertDialogTitle>
                    <AlertDialogDescription>
                        Möchtest du dich wirklich abmelden?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleSignOut}
                        disabled={isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Wird abgemeldet...
                            </>
                        ) : (
                            "Abmelden"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

