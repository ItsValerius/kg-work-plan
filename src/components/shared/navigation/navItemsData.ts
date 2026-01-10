import { Calendar, User, ListTodo, LayoutDashboard } from "lucide-react";
import type { NavItem } from "./types";

export const navItems: NavItem[] = [
  {
    href: "/events",
    label: "Veranstaltungen",
    icon: Calendar,
  },
  {
    href: "/meine-aufgaben",
    label: "Meine Aufgaben",
    icon: ListTodo,
  },
  {
    href: "/profile",
    label: "Profil",
    icon: User,
  },
];

export const adminNavItem: NavItem = {
  href: "/dashboard",
  label: "Admin Dashboard",
  icon: LayoutDashboard,
};

