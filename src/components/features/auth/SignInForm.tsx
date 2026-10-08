"use client";

import { authClient } from "@/lib/auth/client";
import { providerMap } from "@/lib/auth/providers";
import SubmitButton from "@/components/shared/buttons/SubmitButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

interface SignInFormProps {
  callbackUrl?: string;
  initialEmail?: string;
}

// Helper function to parse and translate error messages
function parseErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    // Handle string errors from better-auth
    if (error.includes("body.email") || error.includes("Invalid email")) {
      return "Bitte gib eine gültige E-Mail-Adresse ein.";
    }
    if (error.includes("email") && error.includes("required")) {
      return "Bitte gib eine E-Mail-Adresse ein.";
    }
    return error;
  }

  if (error && typeof error === "object") {
    const errorObj = error as { message?: string; error?: string };

    // Check for better-auth formatted errors
    if (errorObj.message) {
      const msg = errorObj.message;
      if (msg.includes("body.email") || msg.includes("Invalid email")) {
        return "Bitte gib eine gültige E-Mail-Adresse ein.";
      }
      if (msg.includes("email") && msg.includes("required")) {
        return "Bitte gib eine E-Mail-Adresse ein.";
      }
      return msg;
    }

    if (errorObj.error) {
      return parseErrorMessage(errorObj.error);
    }
  }

  return "Ein Fehler ist aufgetreten. Bitte versuche es erneut.";
}

// Simple email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function SignInForm({ callbackUrl, initialEmail }: SignInFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleEmailSignIn = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setEmailError(null);

    try {
      const email = formData.get("email") as string;

      // Client-side validation
      if (!email || !email.trim()) {
        setEmailError("Bitte gib eine E-Mail-Adresse ein.");
        setIsLoading(false);
        return;
      }

      if (!isValidEmail(email.trim())) {
        setEmailError("Bitte gib eine gültige E-Mail-Adresse ein.");
        setIsLoading(false);
        return;
      }

      // Use magic link for passwordless email authentication
      const result = await authClient.signIn.magicLink({
        email: email.trim(),
        callbackURL: callbackUrl || "/",
      });

      if (result.error) {
        const errorMessage = parseErrorMessage(result.error);
        setError(errorMessage);

        // Check if it's an email-specific error
        if (result.error.message?.includes("email") || result.error.message?.includes("Invalid")) {
          setEmailError(errorMessage);
        }
      } else {
        // Email sent successfully - redirect to verification page with email as query param
        router.push(`/verify-request?email=${encodeURIComponent(email.trim())}`);
      }
    } catch (error) {
      const errorMessage = parseErrorMessage(error);
      setError(errorMessage);
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    setEmailError(null);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl || "/",
      });

      if (result.error) {
        const errorMessage = parseErrorMessage(result.error);
        setError(errorMessage || "Google-Anmeldung fehlgeschlagen. Bitte versuche es erneut.");
      }
    } catch (error) {
      const errorMessage = parseErrorMessage(error);
      setError(errorMessage || "Google-Anmeldung fehlgeschlagen. Bitte versuche es erneut.");
      console.error("Google sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-4">
      {error && !emailError && (
        <div role="alert" className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive-surface p-3 text-[15px] text-destructive">
          <AlertCircle className="size-4 mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}
      {providerMap.map((provider) => (
        <form
          key={provider.id}
          className="space-y-4"
          action={provider.id === "email" ? handleEmailSignIn : undefined}
        >
          {provider.id === "email" ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-[15px] font-semibold">Deine E-Mail-Adresse</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@beispiel.de"
                  autoComplete="email"
                  inputMode="email"
                  required
                  name="email"
                  defaultValue={initialEmail}
                  disabled={isLoading}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                  className="h-12 text-[17px]"
                  onChange={() => {
                    // Clear error when user starts typing
                    if (emailError) setEmailError(null);
                    if (error) setError(null);
                  }}
                />
                {emailError && (
                  <p id="email-error" className="flex items-center gap-1.5 text-sm text-destructive" role="alert">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {emailError}
                  </p>
                )}
              </div>
              <SubmitButton name={provider.name} label="Anmeldelink schicken" pendingLabel="Wird gesendet …" />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-muted px-3 text-muted-foreground">
                    oder
                  </span>
                </div>
              </div>
            </>
          ) : (
            <Button
              variant="outline"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-background"
            >
              {provider.id === "google" && (
                <div className="relative size-5">
                  <Image src={"/google.svg"} fill alt="" />
                </div>
              )}
              Mit {provider.name} anmelden
            </Button>
          )}
        </form>
      ))}
    </div>
  );
}

