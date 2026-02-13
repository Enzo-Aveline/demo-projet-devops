/**
 * Client to fetch tasks from tasks-service
 * Demonstrates inter-service communication
 */

import type { Task } from '../domain/stats.js'
const TASKS_SERVICE_URL = process.env.TASKS_SERVICE_URL || 'http://localhost:3001'
//const TASKS_SERVICE_URL = process.env.TASKS_SERVICE_URL || 'http://tasks-service:3001'

export async function fetchAllTasks(): Promise<Task[]> {
  try {
    const response = await fetch(`${TASKS_SERVICE_URL}/api/tasks`)

    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.statusText}`)
    }

    const data = await response.json() as { tasks: any[] }

    // Parse dates (they come as strings from JSON)
    return data.tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt)
    }))
  } catch (error) {
    console.error('Error fetching tasks from tasks-service:', error)
    throw error
  }
}
