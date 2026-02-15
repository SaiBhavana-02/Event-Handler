import { Link } from 'react-router-dom'
import './EventCard.css'

const EventCard = ({ event }) => {
  const remainingSeats = event.capacity - event.registeredCount

  return (
    <div className="event-card">
      <h3>{event.name}</h3>
      <p>{event.location}</p>
      <p>{new Date(event.date).toLocaleDateString()}</p>
      <p>Seats Left: {remainingSeats}</p>
      <Link to={`/event/${event._id}`}>View Details</Link>
    </div>
  )
}

export default EventCard