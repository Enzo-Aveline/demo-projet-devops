/**
 * Domain layer: Pure statistics calculation logic
 * No HTTP, no side effects, just pure functions
 */

export type TaskStatus = 'todo' | 'done'

export interface Task {
  id: string
  title: string
  status: TaskStatus
  createdAt: Date
}

export interface TaskStats {
  total: number
  todo: number
  done: number
  completionRate: number
}

export interface DailyStats {
  date: string
  created: number
  completed: number
}

/**
 * Computes overall task statistics
 * Pure function: deterministic output for given input
 */
export function computeStats(tasks: Task[]): TaskStats {
  const total = tasks.length
  const done = tasks.filter(t => t.status === 'done').length
  const todo = tasks.filter(t => t.status === 'todo').length
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0

  return {
    total,
    todo,
    done,
    completionRate
  }
}

/**
 * Groups tasks by creation date and computes daily stats
 * Pure function: no mutations
 */
export function computeDailyStats(tasks: Task[]): DailyStats[] {
  const dailyMap = new Map<string, { created: number; completed: number }>()

  for (const task of tasks) {
    const dateKey = task.createdAt.toISOString().split('T')[0]

    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, { created: 0, completed: 0 })
    }

    const stats = dailyMap.get(dateKey)!
    stats.created++

    if (task.status === 'done') {
      stats.completed++
    }
  }

  return Array.from(dailyMap.entries())
    .map(([date, stats]) => ({
      date,
      created: stats.created,
      completed: stats.completed
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Computes the average completion time (simulated)
 * In a real app, you'd track when tasks were marked as done
 */
export function computeAverageCompletionRate(tasks: Task[]): number {
  if (tasks.length === 0) return 0

  const completedTasks = tasks.filter(t => t.status === 'done')
  return Math.round((completedTasks.length / tasks.length) * 100)
}

/**
 * Finds the most productive day (most tasks completed)
 */
export function findMostProductiveDay(dailyStats: DailyStats[]): DailyStats | null {
  if (dailyStats.length === 0) return null

  return dailyStats.reduce((max, current) =>
    current.completed > max.completed ? current : max
  )
}
