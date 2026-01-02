import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <footer className="flex justify-center items-center flex-wrap border-t w-full">
      <Button asChild variant="link">
        <Link href="/datenschutz">Datenschutz</Link>
      </Button>
      <Button asChild variant="link">
        <Link href="/nutzungsbedingungen">Nutzungsbedingungen</Link>
      </Button>
    </footer>
  );
};

export default Footer;
