import { redirect } from "next/navigation";
import { signIn, auth, providerMap } from "@/auth";
import { AuthError } from "next-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default async function SignInPage(props: {
  searchParams: Promise<{ callbackUrl: string | undefined }>;
}) {
  const callbackUrl = (await props.searchParams).callbackUrl;
  return (
    <main className="flex h-screen w-full items-center justify-center px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Anmeldung</CardTitle>
          <CardDescription>
            Gib deine Email an um dich anzumelden.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {Object.values(providerMap).map((provider) => (
              <form
                key={provider.id}
                className="space-y-4"
                action={async (formData) => {
                  "use server";

                  try {
                    if (provider.id === "nodemailer") {
                      return await signIn(provider.id, {
                        redirectTo: callbackUrl ?? "",
                        email: formData.get("email"),
                      });
                    }
                    await signIn(provider.id, {
                      redirectTo: callbackUrl ?? "",
                    });
                  } catch (error) {
                    // Signin can fail for a number of reasons, such as the user
                    // not existing, or the user not having the correct role.
                    // In some cases, you may want to redirect to a custom error
                    if (error instanceof AuthError) {
                      return redirect(
                        `${process.env.APP_URL}?error=${error.type}`
                      );
                    }

                    // Otherwise if a redirects happens Next.js can handle it
                    // so you can just re-thrown the error and let Next.js handle it.
                    // Docs:
                    // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
                    throw error;
                  }
                }}
              >
                {provider.id === "nodemailer" ? (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        name="email"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <span>Mit {provider.name} Anmelden</span>
                    </Button>
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
                  <Button type="submit" className="w-full" variant={"outline"}>
                    {provider.id === "google" && (
                      <div className="relative w-6 h-6">
                        <Image src={"/google.svg"} fill alt="google-logo" />
                      </div>
                    )}
                    <span>Mit {provider.name} Anmelden</span>
                  </Button>
                )}
              </form>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}