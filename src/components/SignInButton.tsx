import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const SignInButton = () => {
  return (
    <Button asChild variant="link" className="absolute right-0">
      <Link href={"/signin"}>Anmelden</Link>
    </Button>
  );
};

export default SignInButton;
