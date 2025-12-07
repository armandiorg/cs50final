import { supabase } from '../lib/supabase'

/**
 * Image Service
 * Handles image upload to Supabase Storage
 */
export const imageService = {
  /**
   * Upload an image to Supabase Storage
   * @param {File} file - Image file to upload
   * @param {string} bucket - Storage bucket name (default: 'event-images')
   * @param {string} folder - Folder path within bucket (default: '')
   * @returns {Promise<string>} Public URL of uploaded image
   */
  async uploadImage(file, bucket = 'event-images', folder = '') {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a JPG, PNG, WebP, or GIF image.')
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 5MB.')
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
    const filePath = folder ? `${folder}/${fileName}` : fileName

    try {
      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`)
    }
  },

  /**
   * Delete an image from Supabase Storage
   * @param {string} url - Public URL of the image
   * @param {string} bucket - Storage bucket name (default: 'event-images')
   */
  async deleteImage(url, bucket = 'event-images') {
    try {
      // Extract file path from URL
      const urlParts = url.split('/')
      const filePath = urlParts.slice(urlParts.indexOf(bucket) + 1).join('/')

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath])

      if (error) throw error
    } catch (error) {
      throw new Error(`Failed to delete image: ${error.message}`)
    }
  },

  /**
   * Get a placeholder image URL for events without covers
   * @param {string} eventType - Type of event (party, contest, etc.)
   * @returns {string} Placeholder image URL or emoji
   */
  getPlaceholderImage(eventType = 'party') {
    // For MVP, return emoji placeholders
    // In production, these could be actual hosted images
    const placeholders = {
      party: '🎉',
      contest: '🏆',
      tailgate: '🏈',
      mixer: '🍹',
      other: '⭐',
    }
    return placeholders[eventType] || placeholders.other
  },
}
