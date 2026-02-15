const express = require('express')
const protect = require('../middleware/protect')

const {
  createEvent,
  getEvents,
  getEventById,
  registerEvent,
  cancelRegistration
} = require('../controllers/eventController')

const router = express.Router()

router.post('/', createEvent)
router.get('/', getEvents)
router.get('/:id', getEventById)
router.post('/:id/register', protect, registerEvent)
router.delete('/:id/cancel', protect, cancelRegistration)

module.exports = router