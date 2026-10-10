import { Calendar, User, ListTodo, LayoutDashboard } from "lucide-react";
import type { NavItem } from "./types";

export const navItems: NavItem[] = [
  {
    href: "/veranstaltungen",
    label: "Veranstaltungen",
    icon: Calendar,
  },
  {
    href: "/meine-aufgaben",
    label: "Meine Aufgaben",
    icon: ListTodo,
  },
  {
    href: "/profil",
    label: "Profil",
    icon: User,
  },
];

export const adminNavItem: NavItem = {
  href: "/organisation",
  label: "Organisation",
  icon: LayoutDashboard,
};
