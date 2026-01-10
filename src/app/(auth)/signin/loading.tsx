import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/layout/PageContainer";

const loading = () => {
  return (
    <PageContainer variant="auth">
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <Skeleton className="h-3 w-8 bg-background" />
            </div>
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
        </Card>
      <Skeleton className="h-9 w-24 self-center" />
    </PageContainer>
  );
};

export default loading;
