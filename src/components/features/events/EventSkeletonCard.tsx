import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

export function EventSkeletonCard() {
    return (
        <Card className="min-h-[280px] md:min-h-[340px] flex flex-col h-full">
            <CardHeader className="pb-3 md:pb-5 lg:pb-5 flex flex-col justify-start">
                <div className="flex-1 min-w-0 flex flex-col space-y-2 md:space-y-2.5 lg:flex lg:flex-col lg:gap-3">
                    <div className="lg:min-h-20 lg:pb-2">
                        <Skeleton className="h-7 w-48 lg:h-8" />
                    </div>
                    <div className="lg:min-h-12">
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col grow pt-0">
                <div className="space-y-3 md:space-y-4">
                    <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                            Datum
                        </span>
                        <Skeleton className="h-[23px] w-48" />
                    </div>

                    <div className="space-y-2 pt-2 md:pt-3 border-t">
                        <div className="flex items-center justify-between min-h-5">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Teilnehmer
                            </span>
                        </div>
                        <Progress value={null} className="h-2.5" aria-label="Lade Teilnehmer-Informationen" />
                        <div className="min-h-5">
                            <Skeleton className="h-4 w-36" />
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button variant={"outline"} disabled className="w-full">
                    Aufgabenübersicht{" "}
                    <ArrowRight className="ml-2" />
                </Button>
            </CardFooter>
        </Card>
    );
}

