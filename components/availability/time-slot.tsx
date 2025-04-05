"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatTime } from "@/lib/utils"
import { Trash2 } from "lucide-react"


interface TimeSlotProps {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isRecurring: boolean
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function TimeSlot({ id, dayOfWeek, startTime, endTime, isRecurring }: TimeSlotProps) {
  const handleDelete = async () => {
    const formData = new FormData()
    formData.append("slotId", id)
    await deleteAvailabilitySlot(formData)
  }

  return (
    <Card className="mb-2">
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <p className="font-medium">{dayNames[dayOfWeek]}</p>
          <p className="text-sm text-muted-foreground">
            {formatTime(new Date(`2000-01-01T${startTime}`).getTime())} - {formatTime(new Date(`2000-01-01T${endTime}`).getTime())}
          </p>
          {isRecurring && <p className="text-xs text-muted-foreground">Recurring weekly</p>}
        </div>
        <Button variant="ghost" size="icon" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </CardContent>
    </Card>
  )
}
async function deleteAvailabilitySlot(formData: FormData) {
  try {
    const response = await fetch("/api/availability/delete-slot", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to delete time slot: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error deleting time slot:", error)
    throw error
  }
}

