import { getSession } from "@/lib/auth/utils";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import Footer from "@/components/layout/Footer";
import NavigationBar from "@/components/shared/navigation/NavigationBar";

export default async function EventsLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const user = session?.user;
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
