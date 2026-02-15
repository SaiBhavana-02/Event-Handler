import { useEffect, useState, useContext, useCallback } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import './EventDetails.css'

const EventDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [event, setEvent] = useState(null)
  const [remainingSeats, setRemainingSeats] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchEvent = useCallback(async () => {
    const { data } = await axios.get(`http://localhost:5000/api/events/${id}`)
    setEvent(data)
    setRemainingSeats(data.remainingSeats)
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchEvent()
  }, [fetchEvent])

  const handleRegister = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/events/${id}/register`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      fetchEvent()
    } catch (error) {
      alert(error.response?.data?.message || 'Error')
    }
  }

  const handleCancel = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/events/${id}/cancel`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      fetchEvent()
    } catch (error) {
      alert(error.response?.data?.message || 'Error')
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div className="event-details">
      <h2>{event.name}</h2>
      <p>{event.description}</p>
      <p>Organizer: {event.organizer}</p>
      <p>Location: {event.location}</p>
      <p>Date: {new Date(event.date).toLocaleString()}</p>
      <p>Seats Left: {remainingSeats}</p>

      {!user ? (
        <button className="login" onClick={() => navigate('/login')}>Login to Register</button>
      ) : remainingSeats <= 0 ? (
        <p>Event Full</p>
      ) : (
        <>
          <button className="register" onClick={handleRegister}>Register</button>
          <button className="cancel" onClick={handleCancel}>Cancel Registration</button>
        </>
      )}
    </div>
  )
}

export default EventDetails