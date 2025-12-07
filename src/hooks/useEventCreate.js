import { useState, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useEvents } from '../contexts/EventContext'
import { eventService } from '../services/eventService'
import { imageService } from '../services/imageService'

/**
 * Custom hook for event creation with image upload
 */
export const useEventCreate = () => {
  const { user, profile } = useAuth()
  const { refreshEvents } = useEvents()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const createEvent = useCallback(
    async (eventData, coverImage = null) => {
      if (!user || !profile) {
        throw new Error('Must be logged in to create events')
      }

      try {
        setLoading(true)
        setError(null)
        setUploadProgress(0)

        let coverImageUrl = null

        // Upload cover image if provided
        if (coverImage) {
          setUploadProgress(25)
          coverImageUrl = await imageService.uploadImage(
            coverImage,
            'event-images',
            `events/${user.id}`
          )
          setUploadProgress(50)
        }

        setUploadProgress(75)

        // Create event in database
        const newEvent = await eventService.createEvent({
          ...eventData,
          host_id: user.id,
          host_name: profile.full_name,
          cover_image_url: coverImageUrl,
        })

        setUploadProgress(100)

        // Refresh events list to include new event
        await refreshEvents()

        return newEvent
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
        setUploadProgress(0)
      }
    },
    [user, profile, refreshEvents]
  )

  return {
    createEvent,
    loading,
    error,
    uploadProgress,
  }
}
