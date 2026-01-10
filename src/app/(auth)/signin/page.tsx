import BackButton from "@/components/shared/buttons/BackButton";
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
import { SignInForm } from "@/components/features/auth/SignInForm";
import { PageContainer } from "@/components/layout/PageContainer";

export default async function SignInPage(props: {
  searchParams: Promise<{ callbackUrl?: string; email?: string }>;
}) {
  const { callbackUrl, email } = await props.searchParams;

  return (
    <PageContainer variant="auth">
      <Card>
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
      </Card>
      <BackButton className="w-fit self-center" />
    </PageContainer>
  );
}
