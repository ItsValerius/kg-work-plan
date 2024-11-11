import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserDataForm } from "./UserDataFrom";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const ProfilePage = async () => {
  const session = await auth();
  if (!session?.user) return redirect("/signin");

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between mb-6 flex-col gap-2">
        <Button asChild variant="outline" className="w-fit">
          <Link href="/events">
            {" "}
            <ArrowLeft />
            Zurück
          </Link>
        </Button>
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Mein Profil
          </h1>
          <small className="text-sm font-medium leading-none"></small>
        </div>
      </div>
      <UserDataForm user={session.user} />
    </div>
  );
};

export default ProfilePage;
