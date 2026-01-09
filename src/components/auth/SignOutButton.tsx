"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <Button type="submit" variant="ghost" className="justify-start w-full" onClick={() => authClient.signOut()}>
      Abmelden <LogOut className="ml-auto" />
    </Button>
  );
}

