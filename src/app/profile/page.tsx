import { auth } from "@/auth";
import { UserDataForm } from "./UserDataFrom";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const ProfilePage = async () => {
  const session = await auth();
  // Layout handles authentication redirect, so user should always exist here
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  return (
    <main id="main-content" className="container mx-auto py-8 px-4 md:px-0">
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
    </main>
  );
};

export default ProfilePage;
