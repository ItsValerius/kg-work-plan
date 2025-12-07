"use client";

import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { duplicateEvent } from "@/app/events/actions";

const DuplicateButton = ({
    eventId,
    className,
    showText = false,
}: {
    className: string;
    eventId: string;
    showText?: boolean;
}) => {
    const [isPending, startTransition] = useTransition();

    return (
        <Button
            variant={showText ? "outline" : "secondary"}
            size={showText ? "default" : "icon"}
            className={cn(showText ? "" : "aspect-square", className)}
            disabled={isPending}
            onClick={() => {
                startTransition(async () => {
                    try {
                        await duplicateEvent(eventId);
                    } catch {
                        // Error will be handled by the server action
                    }
                });
            }}
        >
            <Copy className={showText ? "h-4 w-4 mr-2" : ""} />
            {showText && (isPending ? "Duplizieren..." : "Duplizieren")}
        </Button>
    );
};

export default DuplicateButton;

