import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

import { RevenueChart } from "@/components/admin/dashboard/revenue-chart"
import { UserGrowthChart } from "@/components/admin/dashboard/user-growth-chart"
import { BookingStatsChart } from "@/components/admin/dashboard/booking-stats-chart"
import { RecentActivities } from "@/components/admin/dashboard/recent-activities"

export const metadata: Metadata = {
  title: "Admin Dashboard | Cunslt",
  description: "Admin dashboard for Cunslt platform",
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?callbackUrl=/admin/dashboard")
  }

  const supabase = createClient()

  // Check if user is admin
  const { data: userProfile } = await supabase.from("user_profiles").select("role").eq("id", user.id).single()

  if (!userProfile || userProfile.role !== "admin") {
    redirect("/")
  }

  // Get dashboard data
  const stats = await getAdminDashboardStats()
  const rawRevenueData = await getRevenueChartData()
  const revenueData = rawRevenueData.map((item) => ({
    date: item.date,
    revenue: item.revenue,
    month: item.date ? new Date(item.date).toLocaleString('default', { month: 'long' }) : '',
    platformFees:  0,
    expertPayouts:  0,
  }))
    const userGrowthData = await getUserGrowthChartData()
  
  async function getUserGrowthChartData() {
    const supabase = createClient()
  
    // Fetch user growth chart data from the database
    const { data, error } = await supabase.from("user_growth_data").select("date, users").order("date", { ascending: true })
  
    if (error) {
      console.error("Error fetching user growth chart data:", error)
      throw new Error("Failed to fetch user growth chart data")
    }
  
    return data
  }
  const bookingStatsData = await getBookingStatsChartData()

  async function getBookingStatsChartData() {
    const supabase = createClient()

    // Fetch booking stats chart data from the database
    const { data, error } = await supabase.from("booking_stats_data").select("date, bookings").order("date", { ascending: true })

    if (error) {
      console.error("Error fetching booking stats chart data:", error)
      throw new Error("Failed to fetch booking stats chart data")
    }

    return data
  }
  const activities = await getRecentActivities()

  async function getRecentActivities() {
    const supabase = createClient()

    // Fetch recent activities from the database
    const { data, error } = await supabase.from("recent_activities").select("*").order("timestamp", { ascending: false }).limit(10)

    if (error) {
      console.error("Error fetching recent activities:", error)
      throw new Error("Failed to fetch recent activities")
    }

    return data
  }

  return (
    <div className="container py-10">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of platform performance and key metrics</p>
        </div>

      

        <div className="grid grid-cols-1 gap-6">
          <RevenueChart data={revenueData} />
         
          <RecentActivities activities={activities} />
        </div>
      </div>
    </div>
  )
}
async function getCurrentUser() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session || !session.user) {
    return null
  }

  return session.user
}
async function getAdminDashboardStats() {
  const supabase = createClient()

  // Fetch stats data from the database


  
}
async function getRevenueChartData() {
  const supabase = createClient()

  // Fetch revenue chart data from the database
  const { data, error } = await supabase.from("revenue_data").select("date, revenue").order("date", { ascending: true })

  if (error) {
    console.error("Error fetching revenue chart data:", error)
    throw new Error("Failed to fetch revenue chart data")
  }

  return data
}

