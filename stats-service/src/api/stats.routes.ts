/**
 * API layer: HTTP routes for statistics
 */

import { Router, type Request, type Response } from 'express'
import { fetchAllTasks } from '../client/tasks.client.js'
import {
  computeStats,
  computeDailyStats,
  findMostProductiveDay
} from '../domain/stats.js'

export function createStatsRoutes(): Router {
  const router = Router()

  // GET /api/stats
  router.get('/', async (req: Request, res: Response) => {
    try {
      // Fetch tasks from tasks-service
      const tasks = await fetchAllTasks()

      // Compute stats using pure functions
      const stats = computeStats(tasks)
      const dailyStats = computeDailyStats(tasks)
      const mostProductiveDay = findMostProductiveDay(dailyStats)

      res.json({
        stats,
        dailyStats,
        mostProductiveDay
      })
    } catch (error) {
      console.error('Error computing stats:', error)
      res.status(500).json({
        error: 'Failed to compute statistics',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  })

  // GET /api/stats/summary
  router.get('/summary', async (req: Request, res: Response) => {
    try {
      const tasks = await fetchAllTasks()
      const stats = computeStats(tasks)

      res.json(stats)
    } catch (error) {
      console.error('Error computing summary:', error)
      res.status(500).json({
        error: 'Failed to compute summary',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  })

  return router
}
