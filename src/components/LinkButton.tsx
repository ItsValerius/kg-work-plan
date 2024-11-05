import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const LinkButton = ({ url, text }: { url: string; text: string }) => {
  return (
    <Button asChild variant="link" className="absolute right-0">
      <Link href={url}>{text}</Link>
    </Button>
  );
};

export default LinkButton;
