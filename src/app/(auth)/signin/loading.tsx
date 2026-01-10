import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <>
      <main id="main-content" className="flex h-screen w-full items-center justify-center px-4 flex-col">
        <Card className="w-full max-w-md mx-auto my-auto">
          <Skeleton className="w-[448px] h-[338px] "></Skeleton>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default loading;
