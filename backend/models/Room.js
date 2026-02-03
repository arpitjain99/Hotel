import { pool } from '../config/db.js'

const mapRowToRoom = (row) => ({
  roomNo: row.room_no,
  capacity: row.capacity,
  remainingCapacity: row.remaining_capacity,
  hasAC: row.has_ac,
  hasAttachedWashroom: row.has_attached_washroom,
  isOccupied: row.is_occupied
})

export const findRoomByRoomNo = async (roomNo) => {
  const result = await pool.query(
    'SELECT room_no, capacity, remaining_capacity, has_ac, has_attached_washroom, is_occupied FROM rooms WHERE room_no = $1',
    [roomNo]
  )
  return result.rows[0] ? mapRowToRoom(result.rows[0]) : null
}

export const createRoom = async ({ roomNo, capacity, hasAC, hasAttachedWashroom }) => {
  const result = await pool.query(
    `INSERT INTO rooms (room_no, capacity, remaining_capacity, has_ac, has_attached_washroom, is_occupied)
     VALUES ($1, $2, $3, $4, $5, FALSE)
     RETURNING room_no, capacity, remaining_capacity, has_ac, has_attached_washroom, is_occupied`,
    [roomNo, capacity, capacity, hasAC, hasAttachedWashroom]
  )
  return mapRowToRoom(result.rows[0])
}

export const getAllRooms = async () => {
  const result = await pool.query(
    'SELECT room_no, capacity, remaining_capacity, has_ac, has_attached_washroom, is_occupied FROM rooms ORDER BY room_no ASC'
  )
  return result.rows.map(mapRowToRoom)
}

export const searchRoomsModel = async ({ capacity, hasAC, hasAttachedWashroom }) => {
  const conditions = []
  const values = []

  if (capacity !== undefined) {
    values.push(capacity)
    conditions.push(`remaining_capacity >= $${values.length}`)
  }

  if (hasAC !== undefined) {
    values.push(hasAC)
    conditions.push(`has_ac = $${values.length}`)
  }

  if (hasAttachedWashroom !== undefined) {
    values.push(hasAttachedWashroom)
    conditions.push(`has_attached_washroom = $${values.length}`)
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const result = await pool.query(
    `SELECT room_no, capacity, remaining_capacity, has_ac, has_attached_washroom, is_occupied
     FROM rooms
     ${whereClause}
     ORDER BY capacity ASC`,
    values
  )

  return result.rows.map(mapRowToRoom)
}

export const findAllocatableRoom = async ({ students, needsAC, needsWashroom }) => {
  const conditions = ['remaining_capacity >= $1']
  const values = [students]

  if (needsAC) {
    conditions.push('has_ac = true')
  }

  if (needsWashroom) {
    conditions.push('has_attached_washroom = true')
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`

  const result = await pool.query(
    `SELECT room_no, capacity, remaining_capacity, has_ac, has_attached_washroom, is_occupied
     FROM rooms
     ${whereClause}
     ORDER BY capacity ASC
     LIMIT 1`,
    values
  )

  return result.rows[0] ? mapRowToRoom(result.rows[0]) : null
}

export const deleteRoomByRoomNo = async (roomNo) => {
  const result = await pool.query(
    'DELETE FROM rooms WHERE room_no = $1 RETURNING room_no',
    [roomNo]
  )
  return result.rowCount > 0
}

export const decreaseCapacityByRoomNo = async (roomNo, students) => {
  const result = await pool.query(
    `UPDATE rooms
     SET remaining_capacity = remaining_capacity - $2,
         is_occupied = CASE WHEN remaining_capacity - $2 <= 0 THEN TRUE ELSE FALSE END
     WHERE room_no = $1 AND remaining_capacity >= $2
     RETURNING room_no, remaining_capacity, is_occupied`,
    [roomNo, students]
  )
  return result.rowCount > 0 ? result.rows[0].remaining_capacity : null
}



