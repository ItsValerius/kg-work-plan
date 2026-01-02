import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <Button type="submit" variant="ghost" className="justify-start w-full" onClick={() => signOut()}>
      Abmelden <LogOut className="ml-auto" />
    </Button>
  );
}

