"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, Calendar } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo, ReactNode, useTransition } from "react";

interface DashboardTabsProps {
  overviewContent: ReactNode;
  eventsContent: ReactNode;
  participantsContent: ReactNode;
}

const VALID_TABS = ["overview", "events", "participants"] as const;

export function DashboardTabs({
  overviewContent,
  eventsContent,
  participantsContent,
}: DashboardTabsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const tabFromUrl = searchParams.get("tab");
  const activeTab = useMemo((): string => {
    if (tabFromUrl && VALID_TABS.includes(tabFromUrl as typeof VALID_TABS[number])) {
      return tabFromUrl;
    }
    return "overview";
  }, [tabFromUrl]);

  const handleTabChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("tab", value);
      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;

      startTransition(() => {
        router.push(newUrl, { scroll: false });
      });
    },
    [searchParams, pathname, router]
  );

  return (
    <Tabs value={activeTab} defaultValue="overview" onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 h-auto p-1">
        <TabsTrigger value="overview" className="flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-3 text-xs sm:text-sm">
          <BarChart3 className="size-3.5 sm:size-4 shrink-0" />
          <span className="hidden sm:inline">Übersicht</span>
          <span className="sm:hidden truncate">Stats</span>
        </TabsTrigger>
        <TabsTrigger value="events" className="flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-3 text-xs sm:text-sm">
          <Calendar className="size-3.5 sm:size-4 shrink-0" />
          <span className="hidden sm:inline">Veranstaltungen</span>
          <span className="sm:hidden truncate">Events</span>
        </TabsTrigger>
        <TabsTrigger value="participants" className="flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-3 text-xs sm:text-sm">
          <Users className="size-3.5 sm:size-4 shrink-0" />
          <span className="hidden sm:inline">Teilnehmer</span>
          <span className="sm:hidden truncate">Users</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
        {overviewContent}
      </TabsContent>

      <TabsContent value="events" className="mt-4 sm:mt-6">
        {eventsContent}
      </TabsContent>

      <TabsContent value="participants" className="mt-4 sm:mt-6">
        {participantsContent}
      </TabsContent>
    </Tabs>
  );
}

