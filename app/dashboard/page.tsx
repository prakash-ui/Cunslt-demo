import { redirect } from "next/navigation"

import { UpcomingBookings } from "@/components/booking/upcoming-bookings"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?callbackUrl=/dashboard")
  }
  
  async function getUserProfile(userId: string) {
    // Simulate fetching the user profile from an API or database
    const response = await fetch(`/api/user-profile/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for authentication
    });
  
    if (!response.ok) {
      return null; // Return null if the user profile is not found
    }
  
    const userProfile = await response.json();
    return userProfile; // Return the user profile object
  }

  const userProfile = await getUserProfile(user.id)

  if (!userProfile) {
    redirect("/onboarding")
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpcomingBookings />

        {/* Add more dashboard components here */}
      </div>
    </div>
  )
}
async function getCurrentUser() {
  // Simulate fetching the current user from an API or database
  const response = await fetch("/api/current-user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies for authentication
  });

  if (!response.ok) {
    return null; // Return null if the user is not authenticated
  }

  const user = await response.json();
  return user; // Return the user object
}

