import { describe, it, expect } from 'vitest'
import {
  computeStats,
  computeDailyStats,
  computeAverageCompletionRate,
  findMostProductiveDay,
  type Task
} from './stats.js'

describe('computeStats', () => {
  it('should compute stats correctly', () => {
    const tasks: Task[] = [
      { id: '1', title: 'Task 1', status: 'todo', createdAt: new Date() },
      { id: '2', title: 'Task 2', status: 'done', createdAt: new Date() },
      { id: '3', title: 'Task 3', status: 'done', createdAt: new Date() },
      { id: '4', title: 'Task 4', status: 'todo', createdAt: new Date() }
    ]

    const stats = computeStats(tasks)

    expect(stats.total).toBe(4)
    expect(stats.todo).toBe(2)
    expect(stats.done).toBe(2)
    expect(stats.completionRate).toBe(50)
  })

  it('should return 0% completion for empty list', () => {
    const stats = computeStats([])

    expect(stats.total).toBe(0)
    expect(stats.todo).toBe(0)
    expect(stats.done).toBe(0)
    expect(stats.completionRate).toBe(0)
  })

  it('should return 100% completion when all tasks are done', () => {
    const tasks: Task[] = [
      { id: '1', title: 'Task 1', status: 'done', createdAt: new Date() },
      { id: '2', title: 'Task 2', status: 'done', createdAt: new Date() }
    ]

    const stats = computeStats(tasks)

    expect(stats.completionRate).toBe(100)
  })

  it('should round completion rate to nearest integer', () => {
    const tasks: Task[] = [
      { id: '1', title: 'Task 1', status: 'done', createdAt: new Date() },
      { id: '2', title: 'Task 2', status: 'todo', createdAt: new Date() },
      { id: '3', title: 'Task 3', status: 'todo', createdAt: new Date() }
    ]

    const stats = computeStats(tasks)

    // 1/3 = 33.33% → should round to 33
    expect(stats.completionRate).toBe(33)
  })
})

describe('computeDailyStats', () => {
  it('should group tasks by creation date', () => {
    const tasks: Task[] = [
      { id: '1', title: 'Task 1', status: 'todo', createdAt: new Date('2024-01-01') },
      { id: '2', title: 'Task 2', status: 'done', createdAt: new Date('2024-01-01') },
      { id: '3', title: 'Task 3', status: 'done', createdAt: new Date('2024-01-02') }
    ]

    const dailyStats = computeDailyStats(tasks)

    expect(dailyStats).toHaveLength(2)
    expect(dailyStats[0]).toEqual({
      date: '2024-01-01',
      created: 2,
      completed: 1
    })
    expect(dailyStats[1]).toEqual({
      date: '2024-01-02',
      created: 1,
      completed: 1
    })
  })

  it('should return empty array for no tasks', () => {
    const dailyStats = computeDailyStats([])
    expect(dailyStats).toHaveLength(0)
  })

  it('should sort results by date', () => {
    const tasks: Task[] = [
      { id: '1', title: 'Task 1', status: 'todo', createdAt: new Date('2024-01-03') },
      { id: '2', title: 'Task 2', status: 'todo', createdAt: new Date('2024-01-01') },
      { id: '3', title: 'Task 3', status: 'todo', createdAt: new Date('2024-01-02') }
    ]

    const dailyStats = computeDailyStats(tasks)

    expect(dailyStats[0].date).toBe('2024-01-01')
    expect(dailyStats[1].date).toBe('2024-01-02')
    expect(dailyStats[2].date).toBe('2024-01-03')
  })
})

describe('computeAverageCompletionRate', () => {
  it('should compute average completion rate', () => {
    const tasks: Task[] = [
      { id: '1', title: 'Task 1', status: 'done', createdAt: new Date() },
      { id: '2', title: 'Task 2', status: 'done', createdAt: new Date() },
      { id: '3', title: 'Task 3', status: 'done', createdAt: new Date() },
      { id: '4', title: 'Task 4', status: 'todo', createdAt: new Date() }
    ]

    const rate = computeAverageCompletionRate(tasks)
    expect(rate).toBe(75)
  })

  it('should return 0 for empty list', () => {
    const rate = computeAverageCompletionRate([])
    expect(rate).toBe(0)
  })
})

describe('findMostProductiveDay', () => {
  it('should find day with most completed tasks', () => {
    const dailyStats = [
      { date: '2024-01-01', created: 5, completed: 2 },
      { date: '2024-01-02', created: 3, completed: 3 },
      { date: '2024-01-03', created: 4, completed: 1 }
    ]

    const mostProductive = findMostProductiveDay(dailyStats)

    expect(mostProductive).toEqual({
      date: '2024-01-02',
      created: 3,
      completed: 3
    })
  })

  it('should return null for empty array', () => {
    const mostProductive = findMostProductiveDay([])
    expect(mostProductive).toBeNull()
  })

  it('should return first day if multiple days have same completion count', () => {
    const dailyStats = [
      { date: '2024-01-01', created: 5, completed: 3 },
      { date: '2024-01-02', created: 4, completed: 3 }
    ]

    const mostProductive = findMostProductiveDay(dailyStats)
    expect(mostProductive?.date).toBe('2024-01-01')
  })
})
