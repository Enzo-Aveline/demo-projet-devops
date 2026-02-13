/**
 * Entry point: HTTP server for statistics service
 */

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createStatsRoutes } from './api/stats.routes.js'

const app = express()
const PORT = process.env.PORT || 3002

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/stats', createStatsRoutes())

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'stats-service',
    timestamp: new Date().toISOString(),
    tasksServiceUrl: process.env.TASKS_SERVICE_URL || 'http://tasks-service:3001'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`📊 Stats service running on port ${PORT}`)
  console.log(`📈 API: http://localhost:${PORT}/api/stats`)
  console.log(`❤️  Health: http://localhost:${PORT}/health`)
})
