import { CardDescription } from "@/components/ui/card";

interface TaskDescriptionProps {
    description: string;
}

export function TaskDescription({ description }: TaskDescriptionProps) {
    return (
        <CardDescription className="text-xs md:text-sm text-muted-foreground line-clamp-2 md:min-h-10 overflow-hidden wrap-break-word">
            {description}
        </CardDescription>
    );
}
