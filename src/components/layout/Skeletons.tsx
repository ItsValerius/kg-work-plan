import { cn } from "@/lib/utils";
import { PageContainer } from "./PageContainer";

/** A single placeholder bar; size it with Tailwind classes. */
function Bar({ className }: { className?: string }) {
  return <span className={cn("skeleton", className)} />;
}

/** Wraps a placeholder page: busy for assistive tech, invisible to it otherwise. */
function Busy({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <PageContainer>
      <div role="status" aria-busy="true" aria-label={label}>
        <div aria-hidden="true">{children}</div>
      </div>
    </PageContainer>
  );
}

function PageTitle({ withIntro = true }: { withIntro?: boolean }) {
  return (
    <>
      <Bar className="h-12 w-72 max-w-full md:h-16 md:w-[26rem]" />
      {withIntro && <Bar className="mt-5 h-5 w-full max-w-md" />}
    </>
  );
}

/** Date numeral + two text lines, the shape of every date-led row. */
function DateRow() {
  return (
    <li className="grid grid-cols-[88px_1fr] items-center gap-4 border-b py-6 md:grid-cols-[120px_1fr] md:gap-8">
      <span className="flex items-center gap-2 pl-1 md:pl-3">
        <Bar className="h-11 w-12" />
        <span className="grid gap-1.5">
          <Bar className="h-3 w-6" />
          <Bar className="h-3 w-8" />
        </span>
      </span>
      <span className="grid gap-2.5">
        <Bar className="h-5 w-56 max-w-full" />
        <Bar className="h-4 w-36" />
      </span>
    </li>
  );
}

export function EventsListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <ol className="border-t" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <DateRow key={i} />
      ))}
    </ol>
  );
}

export function EventsPageSkeleton() {
  return (
    <Busy label="Veranstaltungen werden geladen">
      <PageTitle />
      <div className="mt-10">
        <EventsListSkeleton />
      </div>
    </Busy>
  );
}

function SheetSkeleton({ lines }: { lines: number }) {
  return (
    <div className="border-t-2 border-border">
      <div className="flex items-start justify-between gap-4 border-b py-4">
        <span className="grid gap-2">
          <Bar className="h-5 w-48" />
          <Bar className="h-4 w-32" />
        </span>
        <Bar className="h-8 w-12" />
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[44px_1fr] items-center border-b border-dashed py-3.5 md:grid-cols-[52px_1fr]"
        >
          <Bar className="h-5 w-5" />
          <Bar className={i === lines - 1 ? "h-11 w-full rounded-lg" : "h-4 w-40"} />
        </div>
      ))}
    </div>
  );
}

export function EventPlanSkeleton() {
  return (
    <Busy label="Arbeitsplan wird geladen">
      <Bar className="h-5 w-40" />
      <div className="mt-6 grid gap-x-10 gap-y-4 border-b pb-6 md:mt-8 md:grid-cols-[auto_1fr] md:pb-10">
        <Bar className="hidden h-16 w-24 md:block" />
        <div>
          <Bar className="h-12 w-80 max-w-full md:h-16" />
          <Bar className="mt-4 h-5 w-56" />
          <Bar className="mt-4 h-5 w-44" />
        </div>
      </div>
      {[3, 2].map((lines, i) => (
        <div key={i} className="grid gap-x-10 gap-y-4 pt-5 pb-8 md:grid-cols-[264px_1fr] md:py-10">
          <div className="rounded-lg bg-muted px-4 py-4 md:self-start md:px-5 md:py-6">
            <Bar className="h-8 w-40" />
            <Bar className="mt-3 h-7 w-28" />
          </div>
          <SheetSkeleton lines={lines + 1} />
        </div>
      ))}
    </Busy>
  );
}

export function MyTasksSkeleton() {
  return (
    <Busy label="Deine Aufgaben werden geladen">
      <PageTitle />
      <div className="mt-10 rounded-xl border-[1.5px] border-border p-5 md:p-8">
        <Bar className="h-8 w-56" />
        <div className="mt-5 grid gap-x-8 gap-y-4 md:grid-cols-[auto_1fr]">
          <Bar className="h-16 w-24" />
          <div className="grid gap-3">
            <Bar className="h-9 w-32" />
            <Bar className="h-6 w-60" />
            <Bar className="h-4 w-72 max-w-full" />
          </div>
        </div>
      </div>
      <div className="mt-14">
        <EventsListSkeleton rows={2} />
      </div>
    </Busy>
  );
}

export function DashboardSkeleton() {
  return (
    <Busy label="Organisation wird geladen">
      <Bar className="h-12 w-72 md:h-16" />
      <div className="mt-8 grid gap-8 md:grid-cols-[280px_1fr] md:gap-10">
        <div className="hidden rounded-lg bg-muted p-2 md:block md:self-start">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="grid grid-cols-[64px_1fr] items-center gap-3 py-3 pr-3 pl-2">
              <Bar className="h-8 w-10" />
              <span className="grid gap-1.5">
                <Bar className="h-4 w-32" />
                <Bar className="h-3 w-20" />
              </span>
            </div>
          ))}
        </div>
        <div>
          <Bar className="h-12 w-full md:hidden" />
          <div className="mt-6 grid gap-3 border-b pb-6 md:mt-0">
            <Bar className="h-12 w-72 max-w-full" />
            <Bar className="h-5 w-48" />
          </div>
          <div className="mt-6 flex gap-6 border-b pb-3">
            <Bar className="h-5 w-24" />
            <Bar className="h-5 w-24" />
          </div>
          <div className="mt-6 grid gap-4">
            <Bar className="h-6 w-48" />
            <Bar className="h-12 w-full" />
            <Bar className="h-12 w-full" />
          </div>
        </div>
      </div>
    </Busy>
  );
}

export function FormPageSkeleton({ label = "Formular wird geladen" }: { label?: string }) {
  return (
    <Busy label={label}>
      <div className="mx-auto max-w-2xl">
        <Bar className="h-10 w-64" />
        <div className="mt-8 grid gap-6 rounded-xl border p-6 md:p-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="grid gap-2.5">
              <Bar className="h-4 w-32" />
              <Bar className="h-11 w-full" />
            </div>
          ))}
          <Bar className="h-11 w-32 rounded-lg" />
        </div>
      </div>
    </Busy>
  );
}
