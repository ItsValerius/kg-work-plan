import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // `pnpm dev:tunnel` serves the dev server through ngrok (for testing ChatGPT locally).
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok-free.dev", "*.ngrok.app"],
  // Static shell + cached data + streamed request data (Partial Prerendering).
  cacheComponents: true,
  // Prefetch one reusable shell per route instead of every visible link.
  partialPrefetching: true,
  cacheLife: {
    // Work-plan data (events, shifts, tasks, sign-ups). Every mutation calls
    // updateTag("workplan"), so the lifetime is only a safety net for writes that
    // reach the database some other way (seed script, another server instance).
    workplan: { stale: 30, revalidate: 60, expire: 3600 },
  },
  // Old English URLs (bookmarks, links in sent emails) keep working.
  async redirects() {
    const e = "/veranstaltungen/:eventId";
    const o = "/organisation/veranstaltungen";
    return [
      // Creating moved into the organizer area.
      { source: "/events/new", destination: `${o}/neu` },
      { source: "/events/:eventId/shifts/new", destination: `${o}/:eventId/schichten/neu` },
      {
        source: "/events/:eventId/shifts/:shiftId/tasks/new",
        destination: `${o}/:eventId/schichten/:shiftId/aufgaben/neu`,
      },
      // The old single-task page; tasks now live on the event's work plan.
      {
        source: "/events/:eventId/shifts/:shiftId/tasks/:taskId",
        destination: `${e}#aufgabe-:taskId`,
      },
      {
        source: "/events/:eventId/shifts/:shiftId/tasks/:taskId/edit",
        destination: `${e}/schichten/:shiftId/aufgaben/:taskId/bearbeiten`,
      },
      {
        source: "/events/:eventId/shifts/:shiftId/edit",
        destination: `${e}/schichten/:shiftId/bearbeiten`,
      },
      { source: "/events/:eventId/edit", destination: `${e}/bearbeiten` },
      { source: "/events/:eventId", destination: e },
      { source: "/events", destination: "/veranstaltungen" },
      { source: "/dashboard/events/new", destination: `${o}/neu` },
      {
        source: "/dashboard/events/:eventId/shifts/new",
        destination: `${o}/:eventId/schichten/neu`,
      },
      {
        source: "/dashboard/events/:eventId/shifts/:shiftId/tasks/new",
        destination: `${o}/:eventId/schichten/:shiftId/aufgaben/neu`,
      },
      { source: "/dashboard", destination: "/organisation" },
      { source: "/profile", destination: "/profil" },
      { source: "/signin", destination: "/anmelden" },
      { source: "/verify-request", destination: "/email-pruefen" },
    ].map((r) => ({ ...r, permanent: true }));
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
