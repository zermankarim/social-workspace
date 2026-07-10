import { Users } from "lucide-react";
import { ComingSoonPage } from "@/presentation/components/placeholders/coming-soon-page";

export default function NetworkPage() {
  return (
    <ComingSoonPage
      title="My Network"
      description="Connections, invitations, and people nearby will live here."
      icon={Users}
    />
  );
}
