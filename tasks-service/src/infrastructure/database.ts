/**
 * Database connection pool
 */

import { Pool } from 'pg'

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://taskuser:taskpass@localhost:5432/taskdb'

export const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Test connection on startup
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err)
  process.exit(-1)
})

export async function testConnection(): Promise<boolean> {
  try {
    const result = await pool.query('SELECT NOW()')
    console.log('📊 Database connection test successful:', result.rows[0])
    return true
  } catch (error) {
    console.error('❌ Database connection test failed:', error)
    return false
  }
}
