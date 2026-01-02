import { EventSkeletonCard } from "./EventSkeletonCard";

export function EventsListSkeleton() {
    return (
        <div className="lg:grid lg:grid-cols-3 gap-4 md:gap-6 flex flex-col lg:items-stretch min-h-[280px]">
            {Array.from({ length: 6 }).map((_, i) => (
                <EventSkeletonCard key={i} />
            ))}
        </div>
    );
}

