import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const isAdmin = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user?.role === "admin";
};

export const isLoggedIn = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return !!session?.user;
};
