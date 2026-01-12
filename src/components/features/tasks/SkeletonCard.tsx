import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <Card className="flex flex-col transition-all duration-200 hover:shadow-lg h-full min-h-60 md:min-h-72 group">
      <CardHeader className="pb-3 md:pb-4 lg:pb-5 flex flex-col justify-start min-h-24 md:min-h-28 lg:min-h-32 relative">
        <div className="absolute top-3 md:top-4 right-3 md:right-4 z-10">
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        <div className="flex items-start gap-2 md:gap-3 lg:gap-4 h-full">
          <div className="flex-1 min-w-0 flex flex-col space-y-1.5 md:space-y-2 justify-between h-full">
            <div className="flex items-start min-h-12 md:min-h-14 pr-10 md:pr-12">
              <Skeleton className="h-6 w-40" />
            </div>
            <div className="flex items-start min-h-10 md:min-h-12 pr-10 md:pr-12">
              <div className="space-y-1 md:space-y-1.5 w-full">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 md:space-y-3 pt-2 md:pt-3">
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Teilnehmer
            </span>
          </div>
          <div className="space-y-2">
            <Progress value={null} className="h-2.5" aria-label="Lade Teilnehmer-Informationen" />
            <div className="flex items-center justify-between gap-2">
              <small className="text-xs md:text-sm font-medium text-muted-foreground">
                <Skeleton className="h-3 md:h-5 w-32 inline-block" />
              </small>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-3 md:pt-4 lg:pt-5">
        <Button
          variant="default"
          disabled
          className="whitespace-nowrap w-full h-10 md:h-11 text-sm md:text-base font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Zur Aufgabe anmelden
        </Button>
      </CardFooter>
    </Card>
  );
}
