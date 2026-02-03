import express from 'express'
import {
  addRoom,
  getRooms,
  searchRooms,
  allocateRoom,
  deleteRoom
} from '../controllers/roomController.js'

const router = express.Router()

router.post('/', addRoom)
router.get('/', getRooms)
router.get('/search', searchRooms)
router.post('/allocate', allocateRoom)
router.delete('/:roomNo', deleteRoom)

export default router

