import { describe, it, expect } from 'vitest'
import {
  validateTaskTitle,
  createTask,
  updateTask,
  toggleTaskStatus,
  filterTasksByStatus,
  sortTasksByDate,
  type Task
} from './task.js'

describe('validateTaskTitle', () => {
  it('should return error for empty title', () => {
    expect(validateTaskTitle('')).toBe('Title cannot be empty')
    expect(validateTaskTitle('   ')).toBe('Title cannot be empty')
  })

  it('should return error for title too long', () => {
    const longTitle = 'a'.repeat(101)
    expect(validateTaskTitle(longTitle)).toBe('Title must be less than 100 characters')
  })

  it('should return null for valid title', () => {
    expect(validateTaskTitle('Valid task')).toBeNull()
    expect(validateTaskTitle('A'.repeat(100))).toBeNull()
  })
})

describe('createTask', () => {
  it('should create a task with default status todo', () => {
    const dto = { title: 'My task' }
    const task = createTask(dto)

    expect(task.id).toBeDefined()
    expect(task.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    expect(task.title).toBe('My task')
    expect(task.status).toBe('todo')
    expect(task.createdAt).toBeInstanceOf(Date)
    expect(task.description).toBeUndefined()
  })

  it('should trim title and description', () => {
    const dto = { title: '  Spaces  ', description: '  Desc  ' }
    const task = createTask(dto)

    expect(task.title).toBe('Spaces')
    expect(task.description).toBe('Desc')
  })

  it('should throw error for invalid title', () => {
    expect(() => createTask({ title: '' })).toThrow('Title cannot be empty')
    expect(() => createTask({ title: 'a'.repeat(101) })).toThrow('Title must be less than 100 characters')
  })
})

describe('updateTask', () => {
  const baseTask: Task = {
    id: '123',
    title: 'Original',
    description: 'Original desc',
    status: 'todo',
    createdAt: new Date('2024-01-01')
  }

  it('should update title', () => {
    const updated = updateTask(baseTask, { title: 'Updated' })

    expect(updated.title).toBe('Updated')
    expect(updated.description).toBe('Original desc')
    expect(updated.id).toBe('123')
  })

  it('should update description', () => {
    const updated = updateTask(baseTask, { description: 'New desc' })

    expect(updated.title).toBe('Original')
    expect(updated.description).toBe('New desc')
  })

  it('should not mutate original task', () => {
    const updated = updateTask(baseTask, { title: 'Updated' })

    expect(baseTask.title).toBe('Original')
    expect(updated.title).toBe('Updated')
  })

  it('should throw error for invalid title', () => {
    expect(() => updateTask(baseTask, { title: '' })).toThrow('Title cannot be empty')
  })

  it('should trim updated values', () => {
    const updated = updateTask(baseTask, { title: '  Trimmed  ' })
    expect(updated.title).toBe('Trimmed')
  })
})

describe('toggleTaskStatus', () => {
  it('should toggle from todo to done', () => {
    const task: Task = {
      id: '1',
      title: 'Test',
      status: 'todo',
      createdAt: new Date()
    }

    const toggled = toggleTaskStatus(task)
    expect(toggled.status).toBe('done')
    expect(toggled.id).toBe('1')
    expect(toggled.title).toBe('Test')
  })

  it('should toggle from done to todo', () => {
    const task: Task = {
      id: '1',
      title: 'Test',
      status: 'done',
      createdAt: new Date()
    }

    const toggled = toggleTaskStatus(task)
    expect(toggled.status).toBe('todo')
  })

  it('should not mutate original task (immutability)', () => {
    const task: Task = {
      id: '1',
      title: 'Test',
      status: 'todo',
      createdAt: new Date()
    }

    toggleTaskStatus(task)
    expect(task.status).toBe('todo')
  })
})

describe('filterTasksByStatus', () => {
  const tasks: Task[] = [
    { id: '1', title: 'Task 1', status: 'todo', createdAt: new Date() },
    { id: '2', title: 'Task 2', status: 'done', createdAt: new Date() },
    { id: '3', title: 'Task 3', status: 'todo', createdAt: new Date() }
  ]

  it('should return all tasks if no status provided', () => {
    expect(filterTasksByStatus(tasks)).toHaveLength(3)
  })

  it('should filter by todo status', () => {
    const filtered = filterTasksByStatus(tasks, 'todo')
    expect(filtered).toHaveLength(2)
    expect(filtered.every(t => t.status === 'todo')).toBe(true)
  })

  it('should filter by done status', () => {
    const filtered = filterTasksByStatus(tasks, 'done')
    expect(filtered).toHaveLength(1)
    expect(filtered[0].id).toBe('2')
  })
})

describe('sortTasksByDate', () => {
  it('should sort tasks by creation date (newest first)', () => {
    const tasks: Task[] = [
      { id: '1', title: 'Old', status: 'todo', createdAt: new Date('2024-01-01') },
      { id: '2', title: 'New', status: 'todo', createdAt: new Date('2024-01-03') },
      { id: '3', title: 'Middle', status: 'todo', createdAt: new Date('2024-01-02') }
    ]

    const sorted = sortTasksByDate(tasks)

    expect(sorted[0].id).toBe('2') // Newest
    expect(sorted[1].id).toBe('3')
    expect(sorted[2].id).toBe('1') // Oldest
  })

  it('should not mutate original array', () => {
    const tasks: Task[] = [
      { id: '1', title: 'Task', status: 'todo', createdAt: new Date('2024-01-01') },
      { id: '2', title: 'Task', status: 'todo', createdAt: new Date('2024-01-02') }
    ]

    sortTasksByDate(tasks)

    expect(tasks[0].id).toBe('1') // Original order preserved
  })
})
