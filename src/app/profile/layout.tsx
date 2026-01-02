import { auth } from "@/auth";
import Footer from "@/components/Footer";
import NavigationBar from "@/components/navigation/NavigationBar";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const user = (await auth())?.user;

  if (!user) {
    redirect("/signin");
  }

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
