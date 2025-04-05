import { redirect } from "next/navigation"
import { getUserProfile, getExpertProfile, getExpertVerificationStatus } from "@/lib/user" // Adjust the import path as needed

import { VerificationRequest } from "@/components/expert/verification-request"

export default async function ExpertVerificationPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?callbackUrl=/expert/verification")
  }

  const userProfile = await getUserProfile(user.id)

  if (!userProfile) {
    redirect("/onboarding")
  }

  if (userProfile.role !== "expert") {
    redirect("/dashboard")
  }

  const expertProfile = await getExpertProfile(userProfile.id)

  if (!expertProfile) {
    redirect("/expert/onboarding")
  }

  const verificationStatus = await getExpertVerificationStatus(expertProfile.id)

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Expert Verification</h1>

      <div className="max-w-3xl mx-auto">
        <VerificationRequest expertId={expertProfile.id} verificationStatus={verificationStatus} />
      </div>
    </div>
  )
}
async function getCurrentUser() {
  // Simulate fetching the current user from a session or authentication context
  const response = await fetch("/api/auth/session");
  if (!response.ok) {
    return null;
  }

  const session = await response.json();
  return session?.user || null;
}

