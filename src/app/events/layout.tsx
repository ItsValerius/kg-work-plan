import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ErrorBoundary from "@/components/ErrorBoundary";
import Footer from "@/components/Footer";
import NavigationBar from "@/components/navigation/NavigationBar";

export default async function EventsLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  console.log(user);
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar
        isAdmin={user?.role === "admin"}
        showSignInButton={!user}
      />
      <div className="flex-1">
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>
      <Footer />
    </div>
  );
}
