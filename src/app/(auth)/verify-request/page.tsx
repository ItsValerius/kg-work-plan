import BackButton from "@/components/shared/buttons/BackButton";
import Footer from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface VerifyRequestPageProps {
  searchParams: Promise<{ email?: string }>;
}

const VerifyRequestPage = async (props: VerifyRequestPageProps) => {
  const { email } = await props.searchParams;

  return (
    <>
      <main id="main-content" className="flex h-screen w-full items-center justify-center px-4 flex-col">
        <div className="w-full max-w-md mx-auto my-auto flex flex-col gap-4">
          <Card>
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">
                Bestätigungsmail gesendet
              </CardTitle>
              <CardDescription className="text-base">
                Wir haben dir eine E-Mail mit einem Anmeldelink geschickt.
              </CardDescription>
              {email && (
                <div className="mt-4 p-3 bg-muted rounded-md border">
                  <p className="text-sm text-muted-foreground mb-1">
                    E-Mail-Adresse:
                  </p>
                  <p className="text-base font-semibold text-foreground break-all">
                    {email}
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <p>
                    Prüfe dein E-Mail-Postfach (auch den Spam-Ordner)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <p>
                    Klicke auf den Link in der E-Mail, um dich anzumelden
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <p>
                    Du wirst automatisch zur Anwendung weitergeleitet
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Keine E-Mail erhalten? Überprüfe deine Eingabe oder{" "}
                  <Link
                    href={email ? `/signin?email=${encodeURIComponent(email)}` : "/signin"}
                    className="text-primary hover:underline font-medium"
                  >
                    versuche es erneut
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
          <BackButton className="w-fit self-center" />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default VerifyRequestPage;
