import { auth } from "@/auth";
import ErrorBoundary from "@/components/ErrorBoundary";
import Footer from "@/components/Footer";
import NavigationBar from "@/components/navigation/NavigationBar";

export default async function EventsLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const user = (await auth())?.user;

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
