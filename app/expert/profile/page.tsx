import { redirect } from "next/navigation"

import { ExpertProfile } from "@/components/expert/expert-profile"

export default async function ExpertProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?callbackUrl=/expert/profile")
  }

  const userProfile:any =[]

  if (!userProfile) {
    redirect("/onboarding")
  }

  if (userProfile.role !== "expert") {
    redirect("/dashboard")
  }

  const expertProfile:any = []

  if (!expertProfile) {
    redirect("/expert/onboarding")
  }

 // const skills = await getExpertSkills(expertProfile.id)
 // const reviews = await getExpertReviews(expertProfile.id)
 // const availability = await getExpertAvailability(expertProfile.id)
  //const verificationStatus = await getExpertVerificationStatus(expertProfile.id)

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">My Expert Profile</h1>

      {/* <ExpertProfile
        expert={expertProfile}
        skills={skills}
        reviews={reviews}
        availability={availability}
        isOwnProfile={true}
        isVerified={verificationStatus.isVerified}
      /> */}
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

