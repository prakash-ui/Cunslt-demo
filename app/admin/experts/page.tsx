import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ExpertApprovalTable } from "@/components/admin/experts/expert-approval-table"

export const metadata: Metadata = {
  title: "Expert Approval | Cunslt Admin",
  description: "Review and approve expert applications",
}

export default async function AdminExpertsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?callbackUrl=/admin/experts")
  }

  const supabase = createClient()

  // Check if user is admin
  const { data: userProfile } = await supabase.from("user_profiles").select("role").eq("id", user.id).single()

  if (!userProfile || userProfile.role !== "admin") {
    redirect("/")
  }

  // Get all experts
  const { data: experts } = await supabase
    .from("experts")
    .select(`
      id,
      user_id,
      title,
      hourly_rate,
      bio,
      expertise,
      experience,
      education,
      certifications,
      status,
      created_at,
      user_profiles (
        id,
        full_name,
        email,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false })

  // Format experts for the table
  const formattedExperts =
    experts?.map((expert) => ({
      id: expert.id,
      userId: expert.user_id,
      name: "Prakash",
      email: "prakash@gmail.com",
      title: expert.title,
      expertise: expert.expertise || [],
      hourlyRate: expert.hourly_rate,
      status: expert.status as "pending" | "approved" | "rejected",
      submittedAt: expert.created_at,
      avatar:"url",
      bio: expert.bio || "",
      experience: expert.experience || "",
      education: expert.education || "",
      certifications: expert.certifications || [],
    })) || []

  async function approveExpert(expertId: string, message?: string): Promise<void> {
    const supabase = createClient()

    // Update the expert's status to "approved"
    const { error } = await supabase
      .from("experts")
      .update({ status: "approved", approval_message: message || null })
      .eq("id", expertId)

    if (error) {
      console.error("Error approving expert:", error.message)
      throw new Error("Failed to approve expert. Please try again.")
    }

    // Optionally, you could trigger a revalidation or refresh logic here
    console.log(`Expert with ID ${expertId} approved successfully.`)
  }
  async function rejectExpert(expertId: string, reason: string): Promise<void> {
    const supabase = createClient()

    // Update the expert's status to "rejected" with a rejection reason
    const { error } = await supabase
      .from("experts")
      .update({ status: "rejected", rejection_reason: reason })
      .eq("id", expertId)

    if (error) {
      console.error("Error rejecting expert:", error.message)
      throw new Error("Failed to reject expert. Please try again.")
    }

    // Optionally, you could trigger a revalidation or refresh logic here
    console.log(`Expert with ID ${expertId} rejected successfully.`)
  }
  return (
    <div className="container py-10">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expert Approval</h1>
          <p className="text-muted-foreground">Review and manage expert applications</p>
        </div>

        <ExpertApprovalTable experts={formattedExperts} onApprove={approveExpert} onReject={rejectExpert} />
      </div>
    </div>
  )
}

async function getCurrentUser() {
  const supabase = createClient()
  const { data: user, error } = await supabase.auth.getUser()

  if (error) {
    console.error("Error fetching current user:", error.message)
    return null
  }

  return user
}

