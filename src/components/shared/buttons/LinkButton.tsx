import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LinkButton = ({ url, text, className }: { url: string; text: string; className?: string }) => {
  return (
    <Button asChild variant="link" className={className}>
      <Link href={url}>{text}</Link>
    </Button>
  );
};

export default LinkButton;

