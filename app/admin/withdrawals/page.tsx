import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { WithdrawalManagement } from "@/components/admin/withdrawal-management"


export default async function AdminWithdrawalsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const supabase = createClient()

  // Check if user is admin
  const { data: userProfile } = await supabase.from("user_profiles").select("role").eq("user_id", user.id).single()

  if (userProfile?.role !== "admin") {
    redirect("/")
  }

  try {
    const withdrawalRequests = await fetchWithdrawalRequests()

    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Manage Withdrawal Requests</h1>
        <WithdrawalManagement withdrawalRequests={withdrawalRequests} />
      </div>
    )
  } catch (error) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Manage Withdrawal Requests</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error instanceof Error ? error.message : "Failed to load withdrawal requests"}
        </div>
      </div>
    )
  }
}
async function fetchWithdrawalRequests() {
  const supabase = createClient()
  const { data, error } = await supabase.from("withdrawal_requests").select("*")

  if (error) {
    throw new Error("Failed to fetch withdrawal requests")
  }

  return data
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

