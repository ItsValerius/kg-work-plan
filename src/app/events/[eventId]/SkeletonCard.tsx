import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export function SkeletonCard() {
  return (
    <Card className="h-[188px]">
      <CardHeader>
        <CardTitle className="font-medium">
          <Skeleton className="h-6 w-40" />
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          <Skeleton className="h-5 w-32" />
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter>
        <Button asChild className="text-wrap">
          <Link href={"#"}>Zur Aufgabe anmelden</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
