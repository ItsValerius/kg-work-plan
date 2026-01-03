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
      <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">Übersicht</span>
          <span className="sm:hidden">Stats</span>
        </TabsTrigger>
        <TabsTrigger value="events" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Veranstaltungen</span>
          <span className="sm:hidden">Events</span>
        </TabsTrigger>
        <TabsTrigger value="participants" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Teilnehmer</span>
          <span className="sm:hidden">Users</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6 space-y-6">
        {overviewContent}
      </TabsContent>

      <TabsContent value="events" className="mt-6">
        {eventsContent}
      </TabsContent>

      <TabsContent value="participants" className="mt-6">
        {participantsContent}
      </TabsContent>
    </Tabs>
  );
}

