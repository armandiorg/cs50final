import { useState, useRef, useEffect } from 'react'
import { eventService } from '../services/eventService'
import { imageService } from '../services/imageService'

/**
 * Modal form for editing existing events
 */
export default function EditEventForm({ isOpen, onClose, event, onUpdate }) {
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'party',
    has_chat: false,
    has_voting: false,
  })

  const [coverImage, setCoverImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  // Initialize form with event data
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date || '',
        time: event.time || '',
        location: event.location || '',
        type: event.type || 'party',
        has_chat: event.has_chat || false,
        has_voting: event.has_voting || false,
      })
      setImagePreview(event.cover_image_url || null)
    }
  }, [event])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCoverImage(file)

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setCoverImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let cover_image_url = event.cover_image_url

      // Upload new image if selected
      if (coverImage) {
        cover_image_url = await imageService.uploadEventCover(coverImage, event.id)
      } else if (!imagePreview && event.cover_image_url) {
        // Image was removed
        cover_image_url = null
      }

      const updatedEvent = await eventService.updateEvent(event.id, {
        ...formData,
        cover_image_url,
      })

      onUpdate(updatedEvent)
      onClose()
    } catch (err) {
      console.error('Failed to update event:', err)
      setError(err.message || 'Failed to update event')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="h2">Edit Event</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-event-form">
          {/* Cover Image Upload */}
          <div className="form-group">
            <label className="label">Cover Image</label>
            {imagePreview ? (
              <div className="image-preview">
                <img src={imagePreview} alt="Event cover preview" />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleRemoveImage}
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div className="file-input-wrapper">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="file-input"
                />
                <div className="file-input-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <p className="text-sm text-secondary">Click to upload cover image</p>
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="form-group">
            <label htmlFor="edit-title" className="label">Event Title *</label>
            <input
              id="edit-title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={100}
              className="input"
              placeholder="e.g. Crimson Cup Kick-Off Party"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="edit-description" className="label">Description *</label>
            <textarea
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              maxLength={500}
              rows={4}
              className="textarea"
              placeholder="What's this event about?"
            />
          </div>

          {/* Date & Time */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-date" className="label">Date *</label>
              <input
                id="edit-date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-time" className="label">Time *</label>
              <input
                id="edit-time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="edit-location" className="label">Location *</label>
            <input
              id="edit-location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              required
              maxLength={100}
              className="input"
              placeholder="e.g. The Fly Club"
            />
          </div>

          {/* Event Type */}
          <div className="form-group">
            <label htmlFor="edit-type" className="label">Event Type *</label>
            <select
              id="edit-type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="select"
            >
              <option value="party">Party</option>
              <option value="contest">Contest</option>
              <option value="tailgate">Tailgate</option>
              <option value="mixer">Mixer</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Event Chat Toggle */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                name="has_chat"
                type="checkbox"
                checked={formData.has_chat}
                onChange={handleChange}
                className="checkbox"
              />
              <span>Enable event chat</span>
            </label>
          </div>

          {/* Live Voting Toggle (Contest events only) */}
          {formData.type === 'contest' && (
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  name="has_voting"
                  type="checkbox"
                  checked={formData.has_voting}
                  onChange={handleChange}
                  className="checkbox"
                />
                <span>Enable live voting</span>
              </label>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="error-banner">
              <p className="error-text">{error}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
