import { auth } from "@/auth";

export const isAdmin = async () => {
  const session = await auth();
  return typeof session?.user !== "undefined" && session.user.role === "admin";
};

export const isLoggedIn = async () => {
  const session = await auth();
  return !!session?.user;
};
