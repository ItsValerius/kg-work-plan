import { Card, CardContent, CardHeader } from "@/components/ui/card";

const VerifyRequestPage = () => {
  return (
    <main className="flex justify-center p-4">
      <div className="w-full max-w-3xl">
        <Card>
          <CardHeader>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Wir haben dir eine Bestätigungsmail geschickt.
            </h3>
          </CardHeader>
          <CardContent>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Du kannst dieses Fenster jetzt schließen.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default VerifyRequestPage;
