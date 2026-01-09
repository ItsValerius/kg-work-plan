"use client";

import { authClient } from "@/lib/auth-client";
import { providerMap } from "@/lib/auth/providers";
import SubmitButton from "@/components/buttons/SubmitButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SignInFormProps {
  callbackUrl?: string;
}

export function SignInForm({ callbackUrl }: SignInFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignIn = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const email = formData.get("email") as string;
      // Use magic link for passwordless email authentication
      const result = await authClient.signIn.magicLink({
        email,
        callbackURL: callbackUrl || "/",
      });

      if (result.error) {
        setError(result.error.message || "Anmeldung fehlgeschlagen");
      } else {
        // Email sent successfully - redirect to verification page
        router.push("/verify-request");
      }
    } catch (error) {
      setError("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl || "/",
      });
    } catch (error) {
      setError("Google-Anmeldung fehlgeschlagen");
      console.error("Google sign in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-4">
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  name="email"
                  disabled={isLoading}
                />
              </div>
              <SubmitButton name={provider.name} />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
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
              className="w-full"
            >
              {provider.id === "google" && (
                <div className="relative w-6 h-6 mr-2">
                  <Image src={"/google.svg"} fill alt="google-logo" />
                </div>
              )}
              Mit {provider.name} Anmelden
            </Button>
          )}
        </form>
      ))}
    </div>
  );
}

