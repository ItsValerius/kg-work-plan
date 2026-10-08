"use client";
import { Loader2 } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "@/components/ui/button";

const SubmitButton = ({
  name,
  variant,
  children,
  label,
  pendingLabel,
}: {
  name: string;
  variant?: ButtonProps["variant"];
  children?: React.ReactNode;
  label?: string;
  pendingLabel?: string;
}) => {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} type="submit" className="w-full" variant={variant}>
      {pending ? (
        <>
          <Loader2 className="animate-spin" aria-hidden="true" />
          {pendingLabel && <span>{pendingLabel}</span>}
        </>
      ) : (
        <>
          {children}
          <span>{label ?? `Mit ${name} Anmelden`}</span>
        </>
      )}
    </Button>
  );
};

export default SubmitButton;
