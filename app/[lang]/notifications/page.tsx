import type { Metadata } from "next"
import { NotificationsList } from "@/components/notifications/notifications-list"

export const metadata: Metadata = {
  title: "Notifications",
  description: "View and manage your notifications",
}

export default async function NotificationsPage() {
  interface Notification {
    id: string;
    message: string;
    read: boolean;
  }

  const notifications: Notification[] = []; // Replace with actual notifications data
  const count = 0; // Replace with the actual count

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <NotificationsList initialNotifications={notifications} initialCount={count} />
    </div>
  )
}

