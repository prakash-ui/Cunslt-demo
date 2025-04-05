"use client"

import type React from "react"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface ReviewResponseFormProps {
  reviewId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function ReviewResponseForm({ reviewId, onSuccess, onCancel }: ReviewResponseFormProps) {
  const [response, setResponse] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!response.trim()) {
      toast({
        title: "Response required",
        description: "Please enter a response before submitting",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createReviewResponse({
        review_id: reviewId,
        response,
      })

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Response submitted",
          description: "Your response has been submitted successfully",
        })

        if (onSuccess) {
          onSuccess()
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Write your response to this review..."
        className="min-h-[100px]"
      />

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}

        <Button type="submit" disabled={isSubmitting || !response.trim()}>
          {isSubmitting ? "Submitting..." : "Submit Response"}
        </Button>
      </div>
    </form>
  )
}
async function createReviewResponse({ review_id, response }: { review_id: string; response: string }) {
  try {
    const res = await fetch("/api/review-responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ review_id, response }),
    })

    if (!res.ok) {
      const errorData = await res.json()
      return { error: errorData.message || "Failed to submit response" }
    }

    return await res.json()
  } catch (error) {
    return { error: "An unexpected error occurred while submitting the response" }
  }
}

