const Registration = require('../models/Registration')

exports.getDashboard = async (req, res) => {
  try {
    const registrations = await Registration.find({
      userId: req.user._id
    }).populate('eventId')

    const now = new Date()

    const upcoming = []
    const past = []

    registrations.forEach(reg => {
      if (reg.eventId.date > now) {
        upcoming.push(reg.eventId)
      } else {
        past.push(reg.eventId)
      }
    })

    res.json({
      totalRegistered: registrations.length,
      upcomingCount: upcoming.length,
      pastCount: past.length,
      upcoming,
      past
    })

  } catch (error) {
    res.status(500).json({ message: 'Dashboard fetch failed' })
  }
}