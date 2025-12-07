import { Skeleton } from "@/components/ui/skeleton";
import { EventSkeletonCard } from "./EventsSection";

export function EventsSectionSkeleton({
    title,
    description,
    showAddButton,
    isFutureEvents,
}: {
    title: string;
    description: string;
    showAddButton: boolean;
    isFutureEvents: boolean;
}) {
    const titleClassName =
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl";

    return (
        <div className={isFutureEvents ? "" : "mt-12"}>
            <div
                className={
                    isFutureEvents
                        ? "md:flex-row flex-col flex justify-between md:items-center mb-6"
                        : "mb-6"
                }
            >
                <div className="flex-1">
                    {isFutureEvents ? (
                        <h1 className={titleClassName}>{title}</h1>
                    ) : (
                        <h2 className={titleClassName}>{title}</h2>
                    )}
                    <small className="text-sm font-medium leading-none">
                        {description}
                    </small>
                </div>
                {showAddButton && (
                    <Skeleton className="h-10 w-48 mt-4 md:mt-0" />
                )}
            </div>

            <div className="lg:grid lg:grid-cols-3 gap-4 flex flex-col">
                {Array.from({ length: 3 }).map((_, i) => (
                    <EventSkeletonCard key={i} />
                ))}
            </div>
        </div>
    );
}

