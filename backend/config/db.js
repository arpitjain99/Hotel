import pg from 'pg'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env') })

const { Pool } = pg

const createPool = () => {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  return new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false
  })
}

const pool = createPool()

const connectDB = async () => {
  try {
    await pool.query('SELECT 1')
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id SERIAL PRIMARY KEY,
        room_no TEXT UNIQUE NOT NULL,
        capacity INTEGER NOT NULL CHECK (capacity > 0),
        has_ac BOOLEAN NOT NULL,
        has_attached_washroom BOOLEAN NOT NULL,
        remaining_capacity INTEGER NOT NULL DEFAULT 0,
        is_occupied BOOLEAN NOT NULL DEFAULT FALSE
      );
    `)
    await pool.query(`
      ALTER TABLE rooms
      ADD COLUMN IF NOT EXISTS remaining_capacity INTEGER NOT NULL DEFAULT 0;
    `)
    await pool.query(`
      ALTER TABLE rooms
      ADD COLUMN IF NOT EXISTS is_occupied BOOLEAN NOT NULL DEFAULT FALSE;
    `)
    await pool.query(`
      UPDATE rooms
      SET remaining_capacity = capacity
      WHERE remaining_capacity = 0;
    `)
    await pool.query(`
      UPDATE rooms
      SET is_occupied = CASE WHEN remaining_capacity <= 0 THEN TRUE ELSE FALSE END;
    `)
    // eslint-disable-next-line no-console
    console.log('PostgreSQL connected and rooms table ensured')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('PostgreSQL connection error:', error.message)
    throw error
  }
}

export { pool }
export default connectDB

