import { redirect } from "next/navigation"
import { VerificationReview } from "@/components/admin/verification-review"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Import or define the getVerificationRequest function

// Define the getUserProfile function
async function getUserProfile(userId: string) {
  // Simulate fetching user profile data
  const response = await fetch(`/api/users/${userId}`)
  if (!response.ok) {
    throw new Error("Failed to fetch user profile")
  }
  return await response.json()
}
async function getVerificationRequest(id: string) {
  // Simulate fetching verification request data
  const response = await fetch(`/api/verifications/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch verification request")
  }
  return await response.json()
}

interface VerificationDetailPageProps {
  params: {
    id: string
  }
}

export default async function VerificationDetailPage({ params }: VerificationDetailPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?callbackUrl=/admin/verifications")
  }

  const userProfile = await getUserProfile(user.id)

  if (!userProfile || userProfile.role !== "admin") {
    redirect("/dashboard")
  }

  const verificationRequest = await getVerificationRequest(params.id)
  const documents = await getVerificationDocuments(params.id)

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href="/admin/verifications">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Verification Requests
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Review Verification Request</h1>

      <VerificationReview verificationRequest={verificationRequest} documents={documents} />
    </div>
  )
}
async function getCurrentUser() {
  // Simulate fetching the current user from a session or authentication service
  const response = await fetch("/api/auth/session")
  if (!response.ok) {
    return null
  }

  const data = await response.json()
  return data?.user || null
}
async function getVerificationDocuments(id: string) {
  // Simulate fetching verification documents for the given verification request ID
  const response = await fetch(`/api/verifications/${id}/documents`)
  if (!response.ok) {
    throw new Error("Failed to fetch verification documents")
  }
  return await response.json()
}

