
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 })
  }

  try {
    const result = await updateAllMetrics()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating metrics:", error)
    return NextResponse.json({ error: "Failed to update metrics" }, { status: 500 })
  }
}

async function updateAllMetrics() {
  // Simulate fetching and updating metrics
  const metrics = [
    { id: 1, name: "Metric A", value: Math.random() * 100 },
    { id: 2, name: "Metric B", value: Math.random() * 100 },
    { id: 3, name: "Metric C", value: Math.random() * 100 },
  ]

  // Simulate saving updated metrics to a database or external service
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate async operation

  console.log("Metrics updated successfully:", metrics)
  return { message: "Metrics updated successfully", metrics }
}


