import React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const LinkButton = ({
  url,
  text,
  className,
}: {
  url: string;
  text: string;
  className?: string;
}) => {
  return (
    <Link href={url} className={cn(buttonVariants({ variant: "link" }), className)}>
      {text}
    </Link>
  );
};

export default LinkButton;
