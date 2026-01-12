import { EventSkeletonCard } from "./EventSkeletonCard";

export function EventsListSkeleton() {
    return (
        <div className="lg:grid lg:grid-cols-3 gap-4 md:gap-6 flex flex-col lg:items-stretch min-h-72">
            {Array.from({ length: 9 }).map((_, i) => (
                <EventSkeletonCard key={i} />
            ))}
        </div>
    );
}

