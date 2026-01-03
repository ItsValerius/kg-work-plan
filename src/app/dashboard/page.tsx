import { isAdmin } from "@/lib/auth/utils";
import { redirect } from "next/navigation";
import { DashboardTabs } from "./DashboardTabs";
import { OverviewTab } from "./overview/OverviewTab";
import { EventsTab } from "./events/EventsTab";
import { ParticipantsTab } from "./participants/ParticipantsTab";

// Force dynamic rendering to ensure fresh data on each tab switch
export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams: Promise<{ tab?: string }>;
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const userIsAdmin = await isAdmin();
  if (!userIsAdmin) return redirect("/");

  const params = await searchParams;
  const activeTab = params.tab || "overview";
  const validTabs = ["overview", "events", "participants"];
  const currentTab = validTabs.includes(activeTab) ? activeTab : "overview";

  return (
    <main id="main-content" className="container mx-auto py-6 md:py-8 lg:py-10 px-4 md:px-6 lg:px-8 max-w-7xl">
      <div className="mb-6 md:mb-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Admin Dashboard
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2 md:mt-3">
          Übersicht und Verwaltung aller Veranstaltungen, Teilnehmer und Aufgaben
        </p>
      </div>

      <DashboardTabs
        overviewContent={currentTab === "overview" ? <OverviewTab /> : null}
        eventsContent={currentTab === "events" ? <EventsTab /> : null}
        participantsContent={currentTab === "participants" ? <ParticipantsTab /> : null}
      />
    </main>
  );
};

export default DashboardPage;
