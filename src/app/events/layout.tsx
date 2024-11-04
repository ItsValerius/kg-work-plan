import { auth } from "@/auth";
import SignInButton from "@/components/SignInButton";

export default async function EventsLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const user = (await auth())?.user;

  return (
    <div className="px-2">
      {!user && <SignInButton />}
      {children}
    </div>
  );
}
