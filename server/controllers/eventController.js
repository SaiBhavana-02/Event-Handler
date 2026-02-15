const Event = require('../models/Event')
const Registration = require('../models/Registration')

exports.createEvent = async (req, res) => {
  const event = await Event.create(req.body)
  res.status(201).json(event)
}

exports.getEvents = async (req, res) => {
  const { search, location, category, date, page = 1, limit = 10 } = req.query

  let query = {}

  if (search) {
    query.name = { $regex: search, $options: 'i' }
  }

  if (location) {
    query.location = location
  }

  if (category) {
    query.category = category
  }

  if (date) {
    query.date = { $gte: new Date(date) }
  }

  const events = await Event.find(query)
    .sort({ date: 1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))

  const total = await Event.countDocuments(query)

  res.json({
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    events
  })
}

exports.getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id)

  if (!event)
    return res.status(404).json({ message: 'Event not found' })

  const remainingSeats = event.capacity - event.registeredCount

  res.json({
    ...event._doc,
    remainingSeats
  })
}

exports.registerEvent = async (req, res) => {
  const event = await Event.findById(req.params.id)

  if (!event)
    return res.status(404).json({ message: 'Event not found' })

  // Check capacity
  if (event.registeredCount >= event.capacity)
    return res.status(400).json({ message: 'Event is full' })

  try {
    // Create registration
    await Registration.create({
      userId: req.user._id,
      eventId: event._id
    })

    // Atomic increment
    await Event.findByIdAndUpdate(event._id, {
      $inc: { registeredCount: 1 }
    })

    res.json({ message: 'Successfully registered' })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already registered' })
    }

    res.status(500).json({ message: 'Registration failed' })
  }
}

exports.cancelRegistration = async (req, res) => {
  const registration = await Registration.findOne({
    userId: req.user._id,
    eventId: req.params.id
  })

  if (!registration)
    return res.status(400).json({ message: 'Not registered for this event' })

  await registration.deleteOne()

  await Event.findByIdAndUpdate(req.params.id, {
    $inc: { registeredCount: -1 }
  })

  res.json({ message: 'Registration cancelled' })
}