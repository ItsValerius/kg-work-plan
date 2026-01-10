import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";

export function SkeletonCard() {
  return (
    <Card className="flex flex-col h-full min-h-[240px] md:min-h-[280px]">
      <CardHeader className="pb-3 md:pb-4 lg:pb-5 flex flex-col justify-start min-h-[100px] md:min-h-[110px] lg:min-h-[120px] relative">
        <div className="flex items-start gap-2 md:gap-3 lg:gap-4 h-full">
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
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Teilnehmer
            </span>
          </div>
          <Progress value={null} className="h-2.5" aria-label="Lade Teilnehmer-Informationen" />
          <div className="flex items-center justify-between">
            <small className="text-xs md:text-sm font-medium text-muted-foreground">
              <Skeleton className="h-[12px] md:h-[19px] w-32 inline-block" />
            </small>
          </div>
        </div>
      </CardContent>
      <CardContent className="mt-auto pt-2 md:pt-3 pb-0">
        <Button
          variant="ghost"
          size="sm"
          disabled
          className="w-full justify-start text-muted-foreground h-9 md:h-10"
        >
          <Users className="h-4 w-4 mr-2 shrink-0" />
          <Skeleton className="h-4 w-32" />
        </Button>
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
