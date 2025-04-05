import type { Metadata } from "next"

import { ExpertPackages } from "@/components/packages/expert-packages"
import { redirect } from "next/navigation"
import { getExpertPackages } from "@/lib/expert-packages" // Adjust the path as needed

import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface ExpertPackagesPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ExpertPackagesPageProps): Promise<Metadata> {
  const supabase = createClient()

  const { data: expert } = await supabase
    .from("experts")
    .select(`
      id,
      title,
      user_profiles
    `)
    .eq("id", params.id)
    .single()

  if (!expert) {
    return {
      title: "Expert Packages | Cunslt",
      description: "Consultation packages offered by our experts",
    }
  }

  return {
    title: `${expert.user_profiles?.full_name || "Expert"}'s Packages | Cunslt`,
    description: `Consultation packages offered by ${expert.user_profiles.full_name}`,
  }
}

export default async function ExpertPackagesPage({ params }: ExpertPackagesPageProps) {
  const user = await getCurrentUser()
  const supabase = createClient()

  const { data: expert } = await supabase
    .from("experts")
    .select(`
      id,
      title,
      user_profiles!inner (
        full_name
      )
    `)
    .eq("id", params.id)
    .single()

  if (!expert) {
    redirect("/experts")
  }

  const packages = await getExpertPackages(params.id)

  return (
    <div className="container py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Button variant="ghost" size="sm" asChild className="mb-2">
              <Link href={`/experts/${params.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Expert Profile
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">{expert.user_profiles[0]?.full_name}'s Packages</h1>
            <p className="text-muted-foreground">Choose a consultation package to save on multiple sessions</p>
          </div>
        </div>

        <ExpertPackages packages={packages} expertName={expert.user_profiles[0]?.full_name} />
      </div>
    </div>
  )
}
async function getCurrentUser() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  const { data: user } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", session.user.id)
    .single()

  return user
}

