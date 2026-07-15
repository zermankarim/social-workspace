import { MessagingPage } from "@/presentation/components/messaging/messaging-page";

type MessagingConversationPageProps = {
  params: Promise<{ conversationId: string }>;
};

export default async function MessagingConversationPage({
  params,
}: MessagingConversationPageProps) {
  const { conversationId } = await params;
  return <MessagingPage conversationId={conversationId} />;
}
