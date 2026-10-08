import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PageContainer } from "./PageContainer";

interface FormPageShellProps {
  title: string;
  /** One line of context under the title, e.g. the event a shift belongs to. */
  context?: string;
  backHref: string;
  backLabel: string;
  children: React.ReactNode;
}

/** Shared frame for the organizer's create/edit forms. */
export function FormPageShell({ title, context, backHref, backLabel, children }: FormPageShellProps) {
  return (
    <PageContainer>
      <div className="mx-auto max-w-2xl">
        <Link
          href={backHref}
          className="inline-flex min-h-11 items-center gap-2 rounded-md pr-2 text-[15px] font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {backLabel}
        </Link>
        <h1 className="mt-4 text-[44px] md:text-[56px]">{title}</h1>
        {context && <p className="mt-2 text-[17px] text-muted-foreground">{context}</p>}
        <div className="mt-8 rounded-xl border bg-muted p-6 md:p-9">{children}</div>
      </div>
    </PageContainer>
  );
}
