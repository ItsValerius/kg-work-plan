import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <Card className="flex flex-col h-full min-h-[240px] md:min-h-[280px]">
      <CardHeader className="pb-3 md:pb-4 lg:pb-5 lg:h-[120px] flex flex-col justify-start">
        <div className="flex items-start justify-between gap-2 md:gap-3 lg:gap-4 h-full">
          <div className="flex-1 min-w-0 flex flex-col space-y-1.5 md:space-y-2 lg:grid lg:grid-rows-[2.5rem_2.5rem] lg:gap-2 lg:h-full">
            <div className="flex items-start lg:h-[2.5rem]">
              <Skeleton className="h-6 w-40" />
            </div>
            <div className="flex items-start lg:h-[2.5rem]">
              <div className="space-y-1 md:space-y-1.5 w-full">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 md:space-y-3 pt-0">
        <div className="space-y-2 pt-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-2.5 w-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardContent>
      <CardFooter className="pt-3 md:pt-4 lg:pt-5">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
