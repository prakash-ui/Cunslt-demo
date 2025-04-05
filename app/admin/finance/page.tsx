import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

import { FinancialReports } from "@/components/admin/finance/financial-reports"

export const metadata: Metadata = {
  title: "Financial Reports | Cunslt Admin",
  description: "View and export financial reports",
}

export default async function AdminFinancePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?callbackUrl=/admin/finance")
  }

  const supabase = createClient()

  // Check if user is admin
  const { data: userProfile } = await supabase.from("user_profiles").select("role").eq("id", user.id).single()

  if (!userProfile || userProfile.role !== "admin") {
    redirect("/")
  }

  // Get revenue data
  const revenueData = await getRevenueChartData()

  // Get category distribution data
  const { data: categories } = await supabase.from("expertise_categories").select("name")

  // Generate sample category data (in a real app, this would come from the database)
  const categoryData =
    categories?.map((category, index) => ({
      name: category.name,
      value: Math.floor(Math.random() * 10000) + 1000, // Random value between 1000 and 11000
    })) || []

  return (
    <div className="container py-10">
      <FinancialReports revenueData={revenueData} categoryData={categoryData} onExport={exportFinancialReport} />
    </div>
  )
}

// Function to handle exporting financial reports
async function exportFinancialReport(format: "csv" | "excel", period: string): Promise<void> {
  console.log(`Exporting financial report in ${format} format for period: ${period}`);
  // Add logic to export the financial report here
  return Promise.resolve(); // Placeholder for async logic
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
async function getRevenueChartData() {
  const supabase = createClient()

  // Fetch revenue data from the database
  const { data, error } = await supabase
    .from("revenue")
    .select("date, amount")
    .order("date", { ascending: true })

  if (error) {
    console.error("Error fetching revenue data:", error)
    return []
  }

  // Transform the data into a format suitable for charting
  return data?.map((entry) => ({
    month: new Date(entry.date).toLocaleString("default", { month: "long" }),
    revenue: entry.amount,
    platformFees: entry.amount * 0.1, // Example calculation for platform fees
    expertPayouts: entry.amount * 0.9, // Example calculation for expert payouts
  })) || []
}

