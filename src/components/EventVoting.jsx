import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { votingService } from '../services/votingService'
import { eventService } from '../services/eventService'

/**
 * Default voting options for contests
 */
const DEFAULT_OPTIONS = [
  { id: 'option_1', label: 'Option 1' },
  { id: 'option_2', label: 'Option 2' },
  { id: 'option_3', label: 'Option 3' },
]

/**
 * EventVoting Component
 * Live voting UI for contest events with has_voting enabled
 */
export default function EventVoting({ eventId, isHost, votingOptions }) {
  const { user } = useAuth()
  const [voteCounts, setVoteCounts] = useState({})
  const [voteLabels, setVoteLabels] = useState({})
  const [userVote, setUserVote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [error, setError] = useState('')
  const [savingOptions, setSavingOptions] = useState(false)
  
  // Editable options (for hosts) - initialize from props or defaults
  const [options, setOptions] = useState(() => {
    if (votingOptions && votingOptions.length > 0) {
      return votingOptions
    }
    return DEFAULT_OPTIONS
  })
  const [editingOptions, setEditingOptions] = useState(false)
  const [tempOptions, setTempOptions] = useState([])

  // Fetch initial data
  useEffect(() => {
    if (!eventId) return

    let subscription = null

    const initVoting = async () => {
      try {
        setLoading(true)
        await fetchVoteData()
        
        // Subscribe to real-time updates
        subscription = votingService.subscribeToVotes(eventId, fetchVoteData)
      } catch (err) {
        setError('Failed to load voting data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    initVoting()

    return () => {
      if (subscription) {
        votingService.unsubscribe(subscription)
      }
    }
  }, [eventId])

  const fetchVoteData = async () => {
    try {
      const { counts, labels } = await votingService.getVoteCounts(eventId)
      setVoteCounts(counts)
      setVoteLabels(labels)
      
      // Only update option labels from votes, don't replace the entire options array
      // This preserves options that haven't been voted on yet
      if (Object.keys(labels).length > 0) {
        setOptions(prev => {
          // Create a map of existing options
          const optionMap = new Map(prev.map(o => [o.id, o]))
          // Update labels from votes
          Object.entries(labels).forEach(([id, label]) => {
            if (optionMap.has(id)) {
              optionMap.set(id, { id, label })
            }
          })
          return Array.from(optionMap.values())
        })
      }

      if (user) {
        const vote = await votingService.getUserVote(eventId, user.id)
        setUserVote(vote)
      }
    } catch (err) {
      console.error('Error fetching vote data:', err)
    }
  }

  const handleVote = async (optionId, optionLabel) => {
    if (!user || voting) return

    setVoting(true)
    setError('')

    // Optimistic update
    const previousVote = userVote
    const previousCounts = { ...voteCounts }
    
    if (userVote) {
      setVoteCounts(prev => ({
        ...prev,
        [userVote.option_id]: Math.max(0, (prev[userVote.option_id] || 1) - 1),
        [optionId]: (prev[optionId] || 0) + 1,
      }))
    } else {
      setVoteCounts(prev => ({
        ...prev,
        [optionId]: (prev[optionId] || 0) + 1,
      }))
    }
    setUserVote({ option_id: optionId, option_label: optionLabel })

    try {
      await votingService.castVote({
        event_id: eventId,
        option_id: optionId,
        option_label: optionLabel,
        voter_id: user.id,
      })
    } catch (err) {
      // Revert on error
      setVoteCounts(previousCounts)
      setUserVote(previousVote)
      // Show user-friendly message
      if (err.message === 'You already voted') {
        setError('You already voted!')
      } else {
        setError('Failed to cast vote')
      }
      console.error(err)
    } finally {
      setVoting(false)
    }
  }

  const startEditingOptions = () => {
    setTempOptions([...options])
    setEditingOptions(true)
  }

  const saveOptions = async () => {
    const newOptions = tempOptions.filter(o => o.label.trim())
    setOptions(newOptions)
    setEditingOptions(false)
    
    // Save to database
    setSavingOptions(true)
    try {
      await eventService.updateEvent(eventId, {
        voting_options: newOptions
      })
    } catch (err) {
      console.error('Failed to save voting options:', err)
      setError('Failed to save options')
    } finally {
      setSavingOptions(false)
    }
  }

  const addOption = () => {
    setTempOptions([...tempOptions, { id: `option_${Date.now()}`, label: '' }])
  }

  const updateOptionLabel = (index, label) => {
    const updated = [...tempOptions]
    updated[index].label = label
    setTempOptions(updated)
  }

  const removeOption = (index) => {
    setTempOptions(tempOptions.filter((_, i) => i !== index))
  }

  // Calculate total votes and percentages
  const totalVotes = Object.values(voteCounts).reduce((sum, count) => sum + count, 0)
  const getPercentage = (optionId) => {
    if (totalVotes === 0) return 0
    return Math.round(((voteCounts[optionId] || 0) / totalVotes) * 100)
  }

  if (loading) {
    return (
      <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div className="spinner spinner-sm"></div>
          <p className="text-secondary" style={{ marginTop: '8px' }}>Loading votes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 className="h3" style={{ margin: 0 }}>🗳️ Live Voting</h3>
        {isHost && !editingOptions && (
          <button
            onClick={startEditingOptions}
            className="btn-text"
            style={{ fontSize: '14px', color: 'var(--color-crimson-bright)' }}
          >
            Edit Options
          </button>
        )}
      </div>

      {/* Total votes */}
      <p className="text-secondary text-sm" style={{ marginBottom: '12px' }}>
        {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} cast
      </p>

      {/* One vote notice */}
      {!userVote && (
        <p className="text-secondary text-sm" style={{ marginBottom: '16px', fontStyle: 'italic' }}>
          ⚠️ You only get 1 vote, so choose wisely!
        </p>
      )}

      {error && (
        <p style={{ color: 'var(--color-error)', fontSize: '14px', marginBottom: '12px' }}>
          {error}
        </p>
      )}

      {/* Editing mode for hosts */}
      {editingOptions ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tempOptions.map((option, index) => (
            <div key={option.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                value={option.label}
                onChange={(e) => updateOptionLabel(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="input"
                style={{ flex: 1 }}
                maxLength={50}
              />
              <button
                onClick={() => removeOption(index)}
                className="btn-text"
                style={{ color: 'var(--color-error)', padding: '8px' }}
              >
                ✕
              </button>
            </div>
          ))}
          
          <button
            onClick={addOption}
            className="btn btn-secondary"
            style={{ marginTop: '8px' }}
          >
            + Add Option
          </button>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              onClick={() => setEditingOptions(false)}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              onClick={saveOptions}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              Save Options
            </button>
          </div>
        </div>
      ) : (
        /* Voting options */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {options.map((option) => {
            const isSelected = userVote?.option_id === option.id
            const percentage = getPercentage(option.id)
            const voteCount = voteCounts[option.id] || 0

            return (
              <button
                key={option.id}
                onClick={() => handleVote(option.id, option.label)}
                disabled={voting || !user}
                style={{
                  position: 'relative',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: isSelected 
                    ? '2px solid var(--color-crimson-bright)' 
                    : '2px solid var(--color-gray-700)',
                  background: 'var(--color-bg-elevated)',
                  cursor: user ? 'pointer' : 'not-allowed',
                  textAlign: 'left',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease',
                }}
              >
                {/* Progress bar background */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${percentage}%`,
                    background: isSelected 
                      ? 'rgba(164, 16, 52, 0.3)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    transition: 'width 0.3s ease',
                  }}
                />
                
                {/* Content */}
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    color: isSelected ? 'var(--color-crimson-bright)' : 'white',
                    fontWeight: isSelected ? '600' : '400',
                  }}>
                    {option.label}
                    {isSelected && ' ✓'}
                  </span>
                  <span style={{ 
                    color: 'var(--color-gray-400)',
                    fontSize: '14px',
                  }}>
                    {voteCount} ({percentage}%)
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {!user && (
        <p className="text-secondary text-sm" style={{ marginTop: '12px', textAlign: 'center' }}>
          Sign in to vote
        </p>
      )}
    </div>
  )
}
