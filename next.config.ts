import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
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
  // Creating events, shifts and tasks moved into the organizer area.
  async redirects() {
    return [
      { source: "/events/new", destination: "/dashboard/events/new", permanent: true },
      {
        source: "/events/:eventId/shifts/new",
        destination: "/dashboard/events/:eventId/shifts/new",
        permanent: true,
      },
      {
        source: "/events/:eventId/shifts/:shiftId/tasks/new",
        destination: "/dashboard/events/:eventId/shifts/:shiftId/tasks/new",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
