import { auth } from "@/auth";
import Footer from "@/components/Footer";
import SignInButton from "@/components/SignInButton";

export default async function EventsLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const user = (await auth())?.user;

  return (
    <div className="px-2 flex flex-col justify-between min-h-screen">
      {!user && <SignInButton />}
      {children}
      <Footer />
    </div>
  );
}
