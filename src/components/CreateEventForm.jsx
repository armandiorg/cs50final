import { useState, useRef } from 'react'
import { useEventCreate } from '../hooks/useEventCreate'

/**
 * Modal form for creating new events
 * Handles all event metadata + cover image upload
 */
export default function CreateEventForm({ isOpen, onClose }) {
  const { createEvent, loading, error, uploadProgress } = useEventCreate()
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'party',
    max_attendees: '',
    is_invite_only: false,
  })

  const [coverImage, setCoverImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

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

    // Create preview URL
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

    try {
      const eventData = {
        ...formData,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
        status: 'published',
        has_rsvp: true,
      }

      await createEvent(eventData, coverImage)

      // Success - close modal and reset form
      onClose()
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        type: 'party',
        max_attendees: '',
        is_invite_only: false,
      })
      setCoverImage(null)
      setImagePreview(null)
    } catch (err) {
      console.error('Failed to create event:', err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="h2">Create Event</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
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
            <label htmlFor="title" className="label">
              Event Title *
            </label>
            <input
              id="title"
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
            <label htmlFor="description" className="label">
              Description *
            </label>
            <textarea
              id="description"
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
              <label htmlFor="date" className="label">
                Date *
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="time" className="label">
                Time *
              </label>
              <input
                id="time"
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
            <label htmlFor="location" className="label">
              Location *
            </label>
            <input
              id="location"
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
            <label htmlFor="type" className="label">
              Event Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="select"
            >
              <option value="party">Party</option>
              <option value="social">Social</option>
              <option value="study">Study</option>
              <option value="sports">Sports</option>
              <option value="culture">Culture</option>
              <option value="food">Food</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Max Attendees */}
          <div className="form-group">
            <label htmlFor="max_attendees" className="label">
              Max Attendees (optional)
            </label>
            <input
              id="max_attendees"
              name="max_attendees"
              type="number"
              value={formData.max_attendees}
              onChange={handleChange}
              min={1}
              max={1000}
              className="input"
              placeholder="Leave empty for unlimited"
            />
          </div>

          {/* Invite Only Toggle */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                name="is_invite_only"
                type="checkbox"
                checked={formData.is_invite_only}
                onChange={handleChange}
                className="checkbox"
              />
              <span>Invite only (require approval)</span>
            </label>
          </div>

          {/* Error Display */}
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {/* Upload Progress */}
          {loading && uploadProgress > 0 && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-secondary">{uploadProgress}% uploaded</p>
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
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
