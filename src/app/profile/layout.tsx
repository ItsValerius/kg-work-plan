import { getSession } from "@/lib/auth/utils";
import Footer from "@/components/layout/Footer";
import NavigationBar from "@/components/shared/navigation/NavigationBar";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/signin");
  }
  
  const user = session.user;

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar isAdmin={user.role === "admin"} />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}
