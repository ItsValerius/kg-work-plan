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
      <CardHeader className="pb-3 md:pb-4 lg:pb-5 flex flex-col justify-start min-h-[100px] md:min-h-[110px] lg:min-h-[120px]">
        <div className="flex items-start justify-between gap-2 md:gap-3 lg:gap-4 h-full">
          <div className="flex-1 min-w-0 flex flex-col space-y-1.5 md:space-y-2 justify-between h-full">
            <div className="flex items-start min-h-[3rem] md:min-h-[3.5rem]">
              <Skeleton className="h-6 w-40" />
            </div>
            <div className="flex items-start min-h-[2.5rem] md:min-h-[3rem]">
              <div className="space-y-1 md:space-y-1.5 w-full">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48 min-h-[2.5rem]" />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 md:space-y-3 pt-2 md:pt-3">
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
