import { Calendar, User, ListTodo, LayoutDashboard } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

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
  label: "Admin Liste",
  icon: LayoutDashboard,
};

