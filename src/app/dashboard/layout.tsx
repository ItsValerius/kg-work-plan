import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import Footer from "@/components/Footer";
import NavigationBar from "@/components/navigation/NavigationBar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

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

