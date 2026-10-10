import { FormPageSkeleton } from "@/components/layout/Skeletons";

export default function Loading() {
  return <FormPageSkeleton form="event" title="Neue Veranstaltung" context={false} />;
}
