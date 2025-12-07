import { auth } from "@/auth";
import ErrorBoundary from "@/components/ErrorBoundary";
import Footer from "@/components/Footer";
import SignInButton from "@/components/SignInButton";
import UserMenu from "@/components/UserMenu";

export default async function EventsLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const user = (await auth())?.user;

  return (
    <div className="px-2 flex flex-col justify-between min-h-screen">
      {!user ? <SignInButton /> : <UserMenu isAdmin={user.role === "admin"} />}
      <ErrorBoundary>{children}</ErrorBoundary>
      <Footer />
    </div>
  );
}
