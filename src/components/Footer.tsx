import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <div className="flex justify-center items-center flex-wrap border-t w-full">
      <Button asChild variant="link">
        <Link href="/datenschutz">Datenschutz</Link>
      </Button>
      <Button asChild variant="link">
        <Link href="/impressum">Impressum</Link>
      </Button>{" "}
      <Button asChild variant="link">
        <Link href="/nutzungsbedingungen">Nutzungsbedingungen</Link>
      </Button>
    </div>
  );
};

export default Footer;
