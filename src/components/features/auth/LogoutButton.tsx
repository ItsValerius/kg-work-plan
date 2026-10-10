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
import { LogOut, Loader2 } from "lucide-react";
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
      <AlertDialogTrigger
        render={
          <Button
            variant={variant}
            size={showText ? "default" : "icon"}
            className={
              showText
                ? "w-full justify-start gap-2.5 px-3 text-muted-foreground hover:text-foreground"
                : ""
            }
            aria-label="Abmelden"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LogOut className="size-4" aria-hidden="true" />
            )}
            {showText && <span>Abmelden</span>}
          </Button>
        }
      />
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Abmelden?</AlertDialogTitle>
          <AlertDialogDescription>
            Deine Einträge bleiben erhalten. Zum Eintragen meldest du dich einfach wieder an.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} className="mt-0">
            Abbrechen
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleSignOut} disabled={isPending} className="gap-1.5">
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Wird abgemeldet...
              </>
            ) : (
              <>
                <LogOut className="size-4" />
                Abmelden
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
