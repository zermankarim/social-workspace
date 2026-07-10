import { MessageSquare } from "lucide-react";
import { ComingSoonPage } from "@/presentation/components/placeholders/coming-soon-page";

export default function MessagingPage() {
  return (
    <ComingSoonPage
      title="Messaging"
      description="Direct messages and conversations are coming next."
      icon={MessageSquare}
    />
  );
}
