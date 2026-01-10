import BackButton from "@/components/shared/buttons/BackButton";
import Footer from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";
import { SignInForm } from "./SignInForm";

export default async function SignInPage(props: {
  searchParams: Promise<{ callbackUrl?: string; email?: string }>;
}) {
  const { callbackUrl, email } = await props.searchParams;

  return (
    <>
      <main id="main-content" className="flex h-screen w-full items-center justify-center px-4 flex-col">
        <div className="w-full max-w-md mx-auto my-auto flex flex-col gap-2 ">
          <Card className="">
            <CardHeader>
              <CardTitle className="text-2xl">
                <span className="flex">
                  Anmeldung
                  <Popover>
                    <PopoverTrigger className="self-start">
                      <Info size={16} className="stroke-popover-foreground" />
                    </PopoverTrigger>
                    <PopoverContent side="top" className="max-h-32 w-full">
                      Wir brauchen deine Email, um missbräuchliche Nutzung zu
                      vermeiden.
                      <br /> Du erhälst von uns ansonsten nur Informationen zu
                      Änderungen oder Nachfragen zu deiner Anmeldung.
                    </PopoverContent>
                  </Popover>
                </span>
              </CardTitle>
              <CardDescription>
                Gib deine Email an um dich anzumelden.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <SignInForm callbackUrl={callbackUrl} initialEmail={email} />
            </CardContent>
          </Card>{" "}
          <BackButton className="w-fit self-center" />
        </div>
      </main>
      <Footer />
    </>
  );
}
