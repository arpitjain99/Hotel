import {
  findRoomByRoomNo,
  createRoom,
  getAllRooms,
  searchRoomsModel,
  findAllocatableRoom,
  deleteRoomByRoomNo,
  decreaseCapacityByRoomNo
} from '../models/Room.js'

const createError = (statusCode, message) => {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

export const addRoom = async (req, res, next) => {
  try {
    const { roomNo, capacity, hasAC, hasAttachedWashroom } = req.body

    if (!roomNo || capacity === undefined || hasAC === undefined || hasAttachedWashroom === undefined) {
      throw createError(400, 'All fields are required')
    }

    if (typeof capacity !== 'number' || capacity <= 0) {
      throw createError(400, 'Capacity must be a positive number')
    }

    const existing = await findRoomByRoomNo(roomNo.trim())
    if (existing) {
      throw createError(400, 'Room number already exists')
    }

    let room
    try {
      room = await createRoom({
        roomNo: roomNo.trim(),
        capacity,
        hasAC,
        hasAttachedWashroom
      })
    } catch (err) {
      if (err.code === '23505') {
        throw createError(400, 'Room number already exists')
      }
      throw err
    }

    res.status(201).json(room)
  } catch (error) {
    next(error)
  }
}

export const getRooms = async (req, res, next) => {
  try {
    const rooms = await getAllRooms()
    res.status(200).json(rooms)
  } catch (error) {
    next(error)
  }
}

export const searchRooms = async (req, res, next) => {
  try {
    const { capacity, hasAC, hasAttachedWashroom } = req.query

    const query = {}

    if (capacity) {
      const numericCapacity = Number(capacity)
      if (Number.isNaN(numericCapacity) || numericCapacity <= 0) {
        throw createError(400, 'Capacity must be a positive number')
      }
      query.capacity = { $gte: numericCapacity }
    }

    if (hasAC !== undefined && hasAC !== '') {
      query.hasAC = hasAC === 'true'
    }

    if (hasAttachedWashroom !== undefined && hasAttachedWashroom !== '') {
      query.hasAttachedWashroom = hasAttachedWashroom === 'true'
    }

    const rooms = await searchRoomsModel({
      capacity: query.capacity ? query.capacity.$gte : undefined,
      hasAC: query.hasAC,
      hasAttachedWashroom: query.hasAttachedWashroom
    })
    res.status(200).json(rooms)
  } catch (error) {
    next(error)
  }
}

export const allocateRoom = async (req, res, next) => {
  try {
    let { students, needsAC, needsWashroom } = req.body

    const studentCount = Number(students)

    if (!studentCount || Number.isNaN(studentCount) || studentCount <= 0) {
      throw createError(400, 'Students must be a positive number')
    }

    if (typeof needsAC === 'string') {
      needsAC = needsAC === 'true'
    }

    if (typeof needsWashroom === 'string') {
      needsWashroom = needsWashroom === 'true'
    }

    const room = await findAllocatableRoom({
      students: studentCount,
      needsAC,
      needsWashroom
    })

    if (!room) {
      return res.status(200).json({ message: 'No room available' })
    }

    const remaining = await decreaseCapacityByRoomNo(room.roomNo, studentCount)

    if (remaining === null) {
      return res.status(200).json({ message: 'No room available' })
    }

    res.status(200).json({
      ...room,
      remainingCapacity: remaining
    })
  } catch (error) {
    next(error)
  }
}

export const deleteRoom = async (req, res, next) => {
  try {
    const { roomNo } = req.params

    const deleted = await deleteRoomByRoomNo(roomNo)

    if (!deleted) {
      throw createError(404, 'Room not found')
    }

    res.status(200).json({ message: 'Room deleted successfully' })
  } catch (error) {
    next(error)
  }
}

