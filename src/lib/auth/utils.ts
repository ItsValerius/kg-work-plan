import { User } from "next-auth";

export const isAdmin = (user: User | undefined) => {
  return typeof user !== "undefined" && user.role === "admin";
};
