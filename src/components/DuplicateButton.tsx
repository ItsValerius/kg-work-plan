"use client";

import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { DuplicateEventDialog } from "./DuplicateEventDialog";

const DuplicateButton = ({
    eventId,
    eventName,
    eventStartDate,
    eventEndDate,
    className,
    showText = false,
}: {
    className: string;
    eventId: string;
    eventName: string;
    eventStartDate: Date;
    eventEndDate: Date;
    showText?: boolean;
}) => {
    return (
        <DuplicateEventDialog
            eventId={eventId}
            defaultName={eventName}
            defaultStartDate={eventStartDate}
            defaultEndDate={eventEndDate}
            trigger={
                <Button
                    variant={showText ? "outline" : "secondary"}
                    size={showText ? "default" : "icon"}
                    className={cn(showText ? "" : "aspect-square", className)}
                >
                    <Copy className={showText ? "h-4 w-4 mr-2" : ""} />
                    {showText && "Duplizieren"}
                </Button>
            }
        />
    );
};

export default DuplicateButton;

