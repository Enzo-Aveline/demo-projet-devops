/**
 * Entry point: HTTP server
 */

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { TaskRepositoryPostgres } from './infrastructure/task.repository.postgres.js'
import { testConnection } from './infrastructure/database.js'
import { createTaskRoutes } from './api/tasks.routes.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

app.use((_req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'")
  next()
})

// Repository (PostgreSQL storage)
const taskRepository = new TaskRepositoryPostgres()

// Routes
app.use('/api/tasks', createTaskRoutes(taskRepository))

// Health check
app.get('/health', async (req, res) => {
  const dbHealthy = await testConnection()

  res.status(dbHealthy ? 200 : 503).json({
    status: dbHealthy ? 'healthy' : 'unhealthy',
    service: 'tasks-service',
    database: dbHealthy ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  })
})

// Start server
async function startServer() {
  // Test database connection before starting
  const dbHealthy = await testConnection()

  if (!dbHealthy) {
    console.error('❌ Failed to connect to database. Exiting...')
    process.exit(1)
  }

  app.listen(PORT, () => {
    console.log(`🚀 Tasks service running on port ${PORT}`)
    console.log(`📋 API: http://localhost:${PORT}/api/tasks`)
    console.log(`❤️  Health: http://localhost:${PORT}/health`)
    console.log(`🐘 Database: PostgreSQL (persistent storage)`)
  })
}

startServer().catch(console.error)
