import { Suspense } from "react";
import { JobsPage as JobsPageComponent } from "@/presentation/components/jobs/jobs-page";

export default function JobsPage() {
  return (
    <Suspense>
      <JobsPageComponent />
    </Suspense>
  );
}
