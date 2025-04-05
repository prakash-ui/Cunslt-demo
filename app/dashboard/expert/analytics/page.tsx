// import { auth } from "@/lib/auth"
// import { createClient } from "@/lib/supabase/server"
// import { redirect } from "next/navigation"
// import { ExpertOverviewCard } from "@/components/analytics/expert/overview-card"
// import { ExpertEarningsChart } from "@/components/analytics/expert/earnings-chart"
// import { ExpertBookingsChart } from "@/components/analytics/expert/bookings-chart"
// import { BookingHistoryList } from "@/components/analytics/booking-history"
// import { format, subDays, eachDayOfInterval } from "date-fns"

// export default async function ExpertAnalytics() {
//   try {
//     const session = await auth()

//     if (!session) {
//       redirect("/login")
//     }

//     const supabase = createClient()

//     const { data: expert, error: expertError } = await supabase
//       .from("experts")
//       .select("id")
//       .eq("user_id", session.user.id)
//       .single()

//     if (expertError || !expert) {
//       redirect("/dashboard")
//     }

//     const { data: metrics, error: metricsError } = await supabase
//       .from("metrics")
//       .select("*")
//       .eq("expert_id", expert.id)
//       .single()

//     if (metricsError || !metrics) {
//       return (
//         <div className="container mx-auto py-10">
//           <h1 className="text-3xl font-bold mb-6">Expert Analytics</h1>
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//             {metricsError?.message || "Metrics data not found"}
//           </div>
//         </div>
//       )
//     }

//     const bookingHistory = (metrics.bookingHistory || []).map((booking: any) => ({
//       id: booking.id,
//       status: booking.status,
//       price: booking.price || 0,
//       createdAt: booking.createdAt,
//       scheduledAt: booking.scheduledAt || booking.createdAt,
//       completedAt: booking.completedAt,
//       canceledAt: booking.canceledAt,
//     }))

//     const today = new Date()
//     const last30Days = eachDayOfInterval({
//       start: subDays(today, 30),
//       end: today,
//     })

//     const earningsData = last30Days.map((day) => {
//       const dayStr = format(day, "yyyy-MM-dd")
//       const dayBookings = bookingHistory.filter(
//         (b: any) => b.completedAt && b.completedAt.startsWith(dayStr),
//       )
//       const dailyEarnings = dayBookings.reduce(
//         (sum: number, b: any) => sum + (b.price || 0),
//         0,
//       )

//       return {
//         date: format(day, "MMM dd"),
//         earnings: dailyEarnings,
//       }
//     })

//     const bookingsData = last30Days.map((day) => {
//       const dayStr = format(day, "yyyy-MM-dd")
//       const completedBookings = bookingHistory.filter(
//         (b: any) => b.completedAt && b.completedAt.startsWith(dayStr),
//       ).length

//       const canceledBookings = bookingHistory.filter(
//         (b: any) => b.canceledAt && b.canceledAt.startsWith(dayStr),
//       ).length

//       return {
//         date: format(day, "MMM dd"),
//         completed: completedBookings,
//         canceled: canceledBookings,
//       }
//     })

//     const calculated = metrics.calculatedMetrics || {}

//     return (
//       <div className="container mx-auto py-10">
//         <h1 className="text-3xl font-bold mb-6">Expert Analytics</h1>

//         <div className="space-y-6">
//           <ExpertOverviewCard
//             totalBookings={calculated.totalBookings || 0}
//             completedBookings={calculated.completedBookings || 0}
//             canceledBookings={calculated.canceledBookings || 0}
//             completionRate={calculated.completionRate || 0}
//             cancellationRate={calculated.cancellationRate || 0}
//             totalEarnings={calculated.totalEarnings || 0}
//             averageRating={calculated.averageRating || 0}
//             onTimeframeChange={async () => {}} // Client-side only
//             timeframe="month"
//           />

//           <div className="grid gap-6 md:grid-cols-8">
//             <ExpertEarningsChart data={earningsData} />
//             <ExpertBookingsChart data={bookingsData} />
//           </div>

//           <BookingHistoryList bookings={bookingHistory} showClient={true} />
//         </div>
//       </div>
//     )
//   } catch (error) {
//     console.error("ExpertAnalytics Error:", error)
//     return (
//       <div className="container mx-auto py-10">
//         <h1 className="text-3xl font-bold mb-6">Expert Analytics</h1>
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//           An unexpected error occurred while loading analytics.
//         </div>
//       </div>
//     )
//   }
// }
