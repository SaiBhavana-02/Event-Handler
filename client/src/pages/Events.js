import { useState, useEffect } from 'react'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'
import EventCard from '../components/EventCard'
import './Events.css'

const Events = () => {
  const [events, setEvents] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const page = searchParams.get('page') || 1

  useEffect(() => {
  const fetchEvents = async () => {
    const { data } = await axios.get(
      `http://localhost:5000/api/events?search=${search}&category=${category}&page=${page}`
    )

    setEvents(data.events)
    setTotalPages(data.pages)
  }

  fetchEvents()
}, [search, category, page])

  const handleSearchChange = (e) => {
    setSearchParams({ search: e.target.value, page: 1 })
  }

  return (
    <div className="events-page">
      <h2>Explore Events</h2>

      <input
        className="search-input"
        placeholder="Search events..."
        value={search}
        onChange={handleSearchChange}
      />

      <div className="events-grid">
        {events.map(event => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>

      <div className="pagination">
        <button
          disabled={page <= 1}
          onClick={() => setSearchParams({ search, category, page: Number(page) - 1 })}
        >
          Prev
        </button>

        <span>{page} / {totalPages}</span>

        <button
          disabled={page >= totalPages}
          onClick={() => setSearchParams({ search, category, page: Number(page) + 1 })}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Events