import { Bell } from "lucide-react";
import { ComingSoonPage } from "@/presentation/components/placeholders/coming-soon-page";

export default function NotificationsPage() {
  return (
    <ComingSoonPage
      title="Notifications"
      description="Likes, comments, and connection updates will appear here."
      icon={Bell}
    />
  );
}
