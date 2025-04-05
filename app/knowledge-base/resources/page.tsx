import type { Metadata } from "next"
import Link from "next/link"

import { ResourceCard } from "@/components/knowledge-base/resource-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Expert Resources | Knowledge Base",
  description: "Browse and download resources shared by our experts",
}

export default async function ResourcesPage() {
  const resources = await getExpertResources({ publicOnly: true })

  return (
    <div className="container py-8">
      <Link href="/knowledge-base">
        <Button variant="ghost" size="sm" className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Knowledge Base
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Expert Resources</h1>
        <p className="text-muted-foreground">Browse and download resources shared by our experts</p>
      </div>

      {resources.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border p-8 text-center">
          <h2 className="mb-2 text-xl font-medium">No resources found</h2>
          <p className="mb-4 text-muted-foreground">There are no expert resources available yet.</p>
          <Link href="/knowledge-base">
            <Button>Browse Knowledge Base</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
async function getExpertResources({ publicOnly }: { publicOnly: boolean }) {
  // Simulating a database or API call to fetch resources
  const allResources = [
    { id: "1", title: "Resource 1", public: true, file_url: "/files/resource1.pdf", download_count: 120, created_at: "2023-01-01" },
    { id: "2", title: "Resource 2", public: false, file_url: "/files/resource2.pdf", download_count: 80, created_at: "2023-02-01" },
    { id: "3", title: "Resource 3", public: true, file_url: "/files/resource3.pdf", download_count: 200, created_at: "2023-03-01" },
  ]

  // Filter resources based on the publicOnly flag
  return allResources.filter((resource) => (publicOnly ? resource.public : true))
}

