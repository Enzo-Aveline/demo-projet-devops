/**
 * API client for tasks-service
 */

const TASKS_API_URL = import.meta.env.VITE_TASKS_API_URL || 'http://localhost:3001/api/tasks'
const STATS_API_URL = import.meta.env.VITE_STATS_API_URL || 'http://localhost:3002/api/stats'

export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'done'
  createdAt: string
}

export interface TaskStats {
  total: number
  todo: number
  done: number
  completionRate: number
}

export async function fetchTasks(status?: 'todo' | 'done'): Promise<Task[]> {
  const url = status ? `${TASKS_API_URL}?status=${status}` : TASKS_API_URL
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch tasks')
  }

  const data = await response.json()
  return data.tasks
}

export async function createTask(title: string, description?: string): Promise<Task> {
  const response = await fetch(TASKS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create task')
  }

  return response.json()
}

export async function toggleTask(id: string): Promise<Task> {
  const response = await fetch(`${TASKS_API_URL}/${id}/toggle`, {
    method: 'PATCH'
  })

  if (!response.ok) {
    throw new Error('Failed to toggle task')
  }

  return response.json()
}

export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${TASKS_API_URL}/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error('Failed to delete task')
  }
}

export async function fetchStats(): Promise<TaskStats> {
  const response = await fetch(`${STATS_API_URL}/summary`)

  if (!response.ok) {
    throw new Error('Failed to fetch stats')
  }

  return response.json()
}
