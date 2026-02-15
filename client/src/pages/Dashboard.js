import { useEffect, useState, useContext, useCallback } from 'react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboard = useCallback(async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:5000/api/dashboard',
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      setData(data)
      setLoading(false)
    } catch (error) {
      alert('Failed to fetch dashboard')
    }
  }, [user.token])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  if (loading) return <p>Loading...</p>

  return (
    <div className="dashboard">
      <h2>My Dashboard</h2>

      <p>Total Registered: {data.totalRegistered}</p>
      <p>Upcoming Events: {data.upcomingCount}</p>
      <p>Past Events: {data.pastCount}</p>

      <h3>Upcoming Events</h3>
      <ul className="event-list">
        {data.upcoming.map(event => (
          <li key={event._id}>
            {event.name} — {new Date(event.date).toLocaleDateString()}
          </li>
        ))}
      </ul>

      <h3>Past Events</h3>
      <ul className="event-list">
        {data.past.map(event => (
          <li key={event._id}>
            {event.name} — {new Date(event.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Dashboard