import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <Button type="submit" variant="destructive" onClick={() => signOut()}>
      Abmelden <LogOut />
    </Button>
  );
}
