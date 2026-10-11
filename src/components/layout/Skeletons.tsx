import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "./PageContainer";

/** A single placeholder bar; size it with Tailwind classes. */
function Bar({ className }: { className?: string }) {
  return <span className={cn("skeleton", className)} />;
}

/** Busy for assistive tech, invisible to it otherwise. */
function Status({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="status" aria-busy="true" aria-label={label}>
      <div aria-hidden="true">{children}</div>
    </div>
  );
}

/** Wraps a placeholder page. */
function Busy({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <PageContainer>
      <Status label={label}>{children}</Status>
    </PageContainer>
  );
}

/** An event row: date numeral (its line box sets the row height), name and open spots. */
function DateRow() {
  return (
    <li className="grid grid-cols-[88px_1fr_auto] items-center gap-x-4 border-b py-5 md:grid-cols-[120px_1fr_auto] md:gap-x-8 md:py-6">
      <span className="flex h-[60px] items-center pl-1 md:h-[66px] md:pl-3">
        <DateBlockBar />
      </span>
      <span className="flex min-w-0 flex-col">
        <Line className="h-[24.75px] md:h-[27.5px]" bar="h-5 w-48" />
        <Line className="mt-1.5 h-[23px] md:h-[22px]" bar="h-3.5 w-40" />
      </span>
    </li>
  );
}

export function EventsListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <ol className="border-t" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <DateRow key={i} />
      ))}
    </ol>
  );
}

/** A task sheet: title row with counter, sign-up lines, the claim button and a free line. */
function SheetSkeleton({ taken }: { taken: number }) {
  return (
    <div className="border-t-2 border-foreground/80">
      <div className="flex items-start justify-between gap-4 border-b pt-3 pb-3 md:pt-4">
        <span className="flex min-w-0 flex-col">
          <Line className="h-[27.5px]" bar="h-5 w-48" />
          <Line className="mt-1 h-[22.5px]" bar="h-3.5 w-56" />
        </span>
        <Bar className="h-10 w-12" />
      </div>
      <div className="pb-2">
        {Array.from({ length: taken }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[44px_1fr] items-center gap-x-2 border-b py-3 md:grid-cols-[52px_1fr]"
          >
            <Bar className="h-5 w-5" />
            <Line className="h-[25.5px]" bar="h-4 w-40" />
          </div>
        ))}
        <div className="grid grid-cols-[44px_1fr] items-center py-2 md:grid-cols-[52px_1fr]">
          <Bar className="h-5 w-5" />
          <Bar className="h-12 w-full rounded-lg" />
        </div>
        <div className="grid grid-cols-[44px_1fr] items-center gap-x-2 border-b border-dashed py-3 md:grid-cols-[52px_1fr]">
          <Bar className="h-5 w-5" />
          <Line className="h-[22.5px]" bar="h-3.5 w-10" />
        </div>
      </div>
    </div>
  );
}

export function EventPlanSkeleton() {
  return (
    <Busy label="Arbeitsplan wird geladen">
      <p className="inline-flex min-h-11 items-center gap-2 pr-2 text-[15px] font-semibold text-primary">
        <ArrowLeft className="size-4" />
        Alle Veranstaltungen
      </p>
      <div className="mt-3 grid gap-x-10 gap-y-4 border-b pb-6 md:mt-8 md:grid-cols-[auto_1fr] md:items-start md:pb-10">
        <span className="hidden h-[108px] items-center md:flex">
          <DateBlockBar large />
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="mb-3 flex h-[60px] items-center gap-3 md:hidden">
            <DateBlockBar />
          </span>
          <Line className="h-[45px] md:h-[75px]" bar="h-9 w-72 md:h-16 md:w-[26rem]" />
          <Line className="mt-3 hidden h-[25.5px] md:flex" bar="h-4 w-60" />
          {/* The event description: two lines on phones, one on desktop. */}
          <Line className="mt-2 h-[27.6px] md:mt-3" bar="h-4 w-full max-w-xl" />
          <Line className="h-[27.6px] md:hidden" bar="h-4 w-2/3" />
          <Line className="mt-3 h-[28.5px] md:mt-5" bar="h-5 w-52" />
        </div>
      </div>
      <div className="mt-1 md:mt-6">
        {[2, 1].map((sheets, i) => (
          <div
            key={i}
            className="grid gap-x-10 gap-y-4 pt-5 pb-8 md:grid-cols-[264px_1fr] md:py-10"
          >
            <div className="flex flex-col rounded-lg bg-muted px-4 py-4 md:self-start md:px-5 md:py-6">
              <Line className="h-[34px] md:h-9" bar="h-7 w-40" />
              <Line className="mt-2 h-[31.5px] md:h-[35.7px]" bar="h-6 w-32" />
              <Line className="mt-2 h-[22.5px]" bar="h-3.5 w-24" />
            </div>
            <div className="grid gap-5 md:gap-6">
              {Array.from({ length: sheets }).map((_, j) => (
                <SheetSkeleton key={j} taken={3 - j} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Busy>
  );
}

/** A bar inside a box as tall as the text line it stands for, so heights match the page. */
function Line({ className, bar }: { className: string; bar: string }) {
  return (
    <span className={cn("flex items-center", className)}>
      <Bar className={cn("max-w-full", bar)} />
    </span>
  );
}

/** DateBlock's shape: day numeral with weekday and month beside it. */
function DateBlockBar({ large = false }: { large?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2", large && "min-h-21 md:min-h-0")}>
      <Bar className={large ? "h-14 w-16 md:h-[72px] md:w-20" : "h-10 w-12 md:h-11"} />
      <span className="grid gap-1.5">
        <Bar className="h-3 w-6" />
        <Bar className="h-3 w-8" />
      </span>
    </span>
  );
}

/** The link buttons under a task (Arbeitsplan, Gruppe, Austragen), padded like the real ones so they wrap alike. */
function TaskActionBars() {
  return (
    <span className="-ml-3 flex flex-wrap gap-x-1">
      {["w-28", "w-28", "w-20"].map((width, i) => (
        <span key={i} className="flex min-h-11 items-center px-3">
          <Bar className={cn("h-4", width)} />
        </span>
      ))}
    </span>
  );
}

/** Everything on "Meine Aufgaben" below the static heading. */
export function MyTasksSkeleton() {
  return (
    <Status label="Deine Aufgaben werden geladen">
      <Line className="mt-3 h-[26px]" bar="h-4 w-72" />
      <div className="mt-10 rounded-xl border-[1.5px] border-primary bg-accent/40 p-5 md:p-8">
        <Line className="h-[29px] md:h-[33px]" bar="h-6 w-64 md:h-7" />
        <div className="mt-5 grid gap-x-8 gap-y-4 md:grid-cols-[auto_1fr]">
          <DateBlockBar large />
          <div className="flex min-w-0 flex-col">
            <Line className="h-[34px] md:h-10" bar="h-8 w-36 md:h-9" />
            <Line className="mt-2 h-[30px] md:h-[33px]" bar="h-6 w-64" />
            <Line className="mt-1 h-[26px] md:h-[25px]" bar="h-4 w-56" />
            <Line className="mt-1 h-[22px] md:h-[23px]" bar="h-3.5 w-80" />
            {/* The task description, which most next tasks have. */}
            <Line className="mt-3 h-7 md:h-[27px]" bar="h-4 w-52" />
            <div className="mt-4">
              <TaskActionBars />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-14">
        <Line className="h-[33px] md:h-[45px]" bar="h-7 w-36 md:h-10" />
        <ol className="mt-6 border-t">
          {Array.from({ length: 2 }).map((_, i) => (
            <li
              key={i}
              className="grid grid-cols-[88px_1fr] gap-x-4 border-b py-5 md:grid-cols-[120px_1fr_auto] md:items-center md:gap-x-8"
            >
              <span className="flex items-center pl-1 md:pl-3">
                <DateBlockBar />
              </span>
              <span className="flex min-w-0 flex-col">
                <Line className="h-[24.75px] md:h-[27.5px]" bar="h-5 w-56" />
                <Line className="h-[22.5px]" bar="h-3.5 w-36" />
                {/* The shift line wraps to two lines on phones. */}
                <Line className="mt-1 h-[22.5px]" bar="h-3.5 w-72" />
                <Line className="h-[22.5px] md:hidden" bar="h-3.5 w-32" />
              </span>
              <span className="col-span-2 mt-3 md:col-span-1 md:mt-0">
                <TaskActionBars />
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Status>
  );
}

export function DashboardSkeleton() {
  return (
    <Busy label="Organisation wird geladen">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-[48px] md:text-[clamp(56px,5.7vw,80px)]">Organisation</h1>
        <div className="flex flex-wrap gap-2.5">
          <Bar className="h-11 w-[142px] rounded-md" />
          <Bar className="h-11 w-[206px] rounded-md" />
        </div>
      </div>
      <div className="mt-8 grid gap-8 md:grid-cols-[280px_1fr] md:gap-10">
        <div className="hidden rounded-lg bg-muted p-2 md:block md:self-start">
          <h2 className="px-2 pt-2 pb-2 font-sans text-[12px] font-semibold tracking-normal text-muted-foreground">
            Kommende Veranstaltungen
          </h2>
          <div className="grid gap-0.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[64px_1fr] items-center gap-3 border border-transparent py-3 pr-3 pl-2"
              >
                <span className="flex h-12 items-center">
                  <DateBlockBar />
                </span>
                <span className="flex min-w-0 flex-col">
                  <Line className="h-6" bar="h-4 w-32" />
                  <Line className="h-5" bar="h-3 w-20" />
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 border-t pt-2">
            <Line className="h-11 px-2" bar="h-4 w-28" />
          </div>
        </div>
        <div className="min-w-0">
          {/* The event picker replaces the rail on phones. */}
          <div className="grid gap-1.5 md:hidden">
            <Line className="h-[22.5px]" bar="h-3.5 w-24" />
            <Bar className="h-12 w-full rounded-md" />
          </div>
          <div className="mt-6 md:mt-0">
            <div className="grid gap-x-8 gap-y-3 border-b pb-6 sm:grid-cols-[auto_1fr]">
              <span className="flex h-[84px] items-center md:h-auto">
                <DateBlockBar large />
              </span>
              <div className="flex min-w-0 flex-col">
                <Line className="h-[45px] md:h-[50px]" bar="h-9 w-72 md:h-10" />
                <Line className="mt-2 h-[25.5px]" bar="h-4 w-48" />
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <Bar className="h-9 w-[185px] rounded-md" />
                  <Bar className="h-9 w-[129px] rounded-md" />
                  <Bar className="h-[40.5px] w-[157px] rounded-md" />
                  <Bar className="h-9 w-[95px] rounded-md" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-1 border-b">
              {["w-24", "w-20", "w-14"].map((width) => (
                <span key={width} className="flex min-h-12 items-center px-4">
                  <Bar className={cn("h-4", width)} />
                </span>
              ))}
            </div>
            <div className="mt-6 grid gap-8">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i}>
                  <div className="flex items-center gap-3 border-b-2 border-foreground/80 pb-2">
                    <Line className="h-7" bar="h-5 w-24" />
                    <Line className="h-7" bar="h-4 w-20" />
                  </div>
                  {Array.from({ length: 2 }).map((_, j) => (
                    <div
                      key={j}
                      className="grid grid-cols-[1fr_auto] items-center gap-4 border-b py-3.5"
                    >
                      <span className="flex min-w-0 flex-col">
                        <Line className="h-6" bar="h-4 w-40" />
                        <Line className="h-[22.5px]" bar="h-3.5 w-52" />
                      </span>
                      <Bar className="h-10 w-8" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Busy>
  );
}

/** A text field: label, input and hint, sized like FormItem (which starts 4px lower). */
function TextFieldBars({ hintWraps = false }: { hintWraps?: boolean }) {
  return (
    <div className="flex flex-col pt-1">
      <Line className="h-4" bar="h-3 w-32" />
      <Bar className="mt-1 h-[46px] w-full rounded-md" />
      <Line className="mt-2 h-5" bar="h-3 w-60" />
      {hintWraps && <Line className="h-5 md:hidden" bar="h-3 w-24" />}
    </div>
  );
}

/** A date or time field: smaller label, a fixed-width control and an optional hint. */
function PickerFieldBars({
  controls,
  hint = "none",
}: {
  controls: React.ReactNode;
  hint?: "none" | "one" | "wraps";
}) {
  return (
    <div className="flex flex-col">
      <Line className="h-3.5" bar="h-3 w-28" />
      <div className="mt-2">{controls}</div>
      {hint !== "none" && <Line className="mt-2 h-5" bar="h-3 w-52" />}
      {hint === "wraps" && <Line className="h-5 md:hidden" bar="h-3 w-24" />}
    </div>
  );
}

const DATE_BUTTON = <Bar className="h-11 w-[186px] rounded-md" />;
const TIME_INPUT = <Bar className="h-[46px] w-32 rounded-md" />;

const FORM_FIELDS = {
  event: (
    <>
      <TextFieldBars />
      <TextFieldBars hintWraps />
      <PickerFieldBars controls={DATE_BUTTON} hint="one" />
      <PickerFieldBars controls={DATE_BUTTON} hint="one" />
    </>
  ),
  shift: (
    <>
      <TextFieldBars />
      <PickerFieldBars
        controls={
          <div className="flex flex-col gap-3 md:flex-row">
            <Bar className="h-11 w-[186px] rounded-md md:h-[46px]" />
            {TIME_INPUT}
          </div>
        }
      />
      <PickerFieldBars controls={TIME_INPUT} hint="wraps" />
    </>
  ),
  task: (
    <>
      <TextFieldBars />
      <TextFieldBars />
      <PickerFieldBars controls={TIME_INPUT} />
      <TextFieldBars />
    </>
  ),
};

/** An organizer form page (FormPageShell) with the fields of the given form. */
export function FormPageSkeleton({
  form,
  title,
  context = true,
}: {
  form: keyof typeof FORM_FIELDS;
  /** The page's fixed title, shown as real text so only the data parts load. */
  title: string;
  /** The page shows a line of context (event or shift name) under the title. */
  context?: boolean;
}) {
  return (
    <Busy label="Formular wird geladen">
      <div className="mx-auto max-w-2xl">
        <Line className="h-11" bar="h-4 w-48" />
        <h1 className="mt-4 text-[44px] md:text-[56px]">{title}</h1>
        {context && <Line className="mt-2 h-[25.5px]" bar="h-4 w-48" />}
        <div className="mt-8 rounded-xl border bg-muted p-6 md:p-9">
          <div className="flex flex-col gap-8">
            {FORM_FIELDS[form]}
            <Bar className="h-11 w-28 rounded-lg" />
          </div>
        </div>
      </div>
    </Busy>
  );
}

/** "Alle Helfer" below its heading: search, four filters, the two actions and ten rows. */
export function ParticipantsTableSkeleton() {
  return (
    <Status label="Helferliste wird geladen">
      <div className="flex flex-col pt-1">
        <Line className="h-4" bar="h-3 w-12" />
        <Bar className="mt-1 h-[46px] w-full rounded-md" />
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col">
            <Line className="h-4" bar="h-3 w-20" />
            <Bar className="mt-1 h-11 w-full rounded-md" />
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-2 md:flex-row md:justify-end">
        <Bar className="h-11 w-full rounded-md md:w-[193px]" />
        <Bar className="h-11 w-full rounded-md md:w-[137px]" />
      </div>
      <div className="mt-[18px] overflow-hidden">
        <div className="flex h-12 items-center gap-8 border-b px-10">
          {["w-12", "w-24", "w-14", "w-14"].map((width, i) => (
            <Bar key={i} className={cn("h-3.5 shrink-0", width)} />
          ))}
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex h-[58px] items-center gap-8 border-b px-10">
            {["w-24", "w-32", "w-44", "w-12"].map((width, j) => (
              <Bar key={j} className={cn("h-3.5 shrink-0", width)} />
            ))}
          </div>
        ))}
      </div>
    </Status>
  );
}

/** The consent page's request line and its two buttons. */
export function ConsentSkeleton() {
  return (
    <Status label="Anfrage wird geladen">
      <Line className="mt-6 h-[25.5px]" bar="h-4 w-72" />
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Bar className="h-11 rounded-lg sm:flex-1" />
        <Bar className="h-11 rounded-lg sm:flex-1" />
      </div>
    </Status>
  );
}

/** "KI-Assistenten": back link, fixed title and intro, two connection rows. */
export function AssistantsSkeleton() {
  return (
    <Busy label="Verbindungen werden geladen">
      <div className="mx-auto max-w-2xl">
        <Line className="h-11" bar="h-4 w-48" />
        <h1 className="mt-4 text-[44px] md:text-[56px]">KI-Assistenten</h1>
        <Line className="mt-2 h-[25.5px]" bar="h-4 w-full" />
        <Line className="h-[25.5px]" bar="h-4 w-4/5" />
        <Line className="h-[25.5px]" bar="h-4 w-2/3" />
        <h2 className="mt-10 text-[32px]">Deine Verbindungen</h2>
        <ul className="mt-3 border-t">
          {[0, 1].map((row) => (
            <li key={row} className="flex items-center justify-between gap-4 border-b py-4">
              <span className="flex flex-col">
                <Line className="h-[25.5px]" bar="h-4 w-32" />
                <Line className="h-[22.5px]" bar="h-3.5 w-52" />
              </span>
              <Bar className="h-9 w-20 rounded-lg" />
            </li>
          ))}
        </ul>
      </div>
    </Busy>
  );
}
