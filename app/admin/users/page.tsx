import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { UserTable } from "@/components/admin/users/user-table"

export const metadata: Metadata = {
  title: "User Management | Cunslt Admin",
  description: "Manage users on the Cunslt platform",
}

export default async function AdminUsersPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?callbackUrl=/admin/users")
  }

  const supabase = createClient()

  // Check if user is admin
  const { data: userProfile } = await supabase.from("user_profiles").select("role").eq("id", user.id).single()

  if (!userProfile || userProfile.role !== "admin") {
    redirect("/")
  }

  // Get all users
  const { data: users } = await supabase
    .from("user_profiles")
    .select("id, full_name, email, role, status, created_at, avatar_url")
    .order("created_at", { ascending: false })

  // Format users for the table
  const formattedUsers =
    users?.map((user) => ({
      id: user.id,
      name: user.full_name,
      email: user.email,
      role: user.role as "client" | "expert" | "admin",
      status: user.status as "active" | "inactive" | "suspended" | "pending",
      joinedAt: user.created_at,
      avatar: user.avatar_url,
    })) || []

  async function updateUserStatus(userId: string, status: "active" | "inactive" | "suspended" | "pending"): Promise<void> {
    const supabase = createClient()

    const { error } = await supabase
      .from("user_profiles")
      .update({ status })
      .eq("id", userId)

    if (error) {
      console.error("Failed to update user status:", error.message)
      throw new Error("Failed to update user status")
    }
  }
  async function updateUserRole(userId: string, role: "client" | "expert" | "admin"): Promise<void> {
    const supabase = createClient()

    const { error } = await supabase
      .from("user_profiles")
      .update({ role })
      .eq("id", userId)

    if (error) {
      console.error("Failed to update user role:", error.message)
      throw new Error("Failed to update user role")
    }
  }
  async function sendUserEmail(userId: string, subject: string, message: string): Promise<void> {
    const supabase = createClient()

    // Fetch the user's email address
    const { data: user, error: fetchError } = await supabase
      .from("user_profiles")
      .select("email")
      .eq("id", userId)
      .single()

    if (fetchError || !user) {
      console.error("Failed to fetch user email:", fetchError?.message)
      throw new Error("Failed to fetch user email")
    }

    // Send the email using a server-side email service or API
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: user.email,
        subject,
        message,
      }),
    })

    if (!response.ok) {
      console.error("Failed to send email:", await response.text())
      throw new Error("Failed to send email")
    }
  }
  return (
    <div className="container py-10">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage users, update roles, and moderate accounts</p>
        </div>

        <UserTable
          users={formattedUsers}
          onStatusChange={updateUserStatus}
          onRoleChange={updateUserRole}
          onSendEmail={sendUserEmail}
        />
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

  return {
    id: session.user.id,
    email: session.user.email,
  }
}

