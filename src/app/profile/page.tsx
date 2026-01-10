import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { UserDataForm } from "./UserDataFrom";

const ProfilePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // Layout handles authentication redirect, so user should always exist here
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  return (
    <main id="main-content" className="container mx-auto py-6 md:py-8 lg:py-10 px-4 md:px-6 lg:px-8 max-w-7xl">
      <div className="mb-6 md:mb-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Mein Profil
        </h1>
        <small className="text-sm font-medium leading-none"></small>
      </div>
      <UserDataForm user={session.user} />
    </main>
  );
};

export default ProfilePage;
