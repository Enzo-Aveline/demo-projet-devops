/**
 * Domain layer: Pure business logic
 * No dependencies on Express, HTTP, or any infrastructure
 */

export type TaskStatus = 'todo' | 'done'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  createdAt: Date
}

export interface CreateTaskDTO {
  title: string
  description?: string
}

export interface UpdateTaskDTO {
  title?: string
  description?: string
}

/**
 * Validates a task title
 * @returns error message if invalid, null if valid
 */
export function validateTaskTitle(title: string): string | null {
  if (!title || title.trim().length === 0) {
    return 'Title cannot be empty'
  }
  if (title.length > 100) {
    return 'Title must be less than 100 characters'
  }
  return null
}

/**
 * Creates a new task from a DTO
 * Pure function: no side effects
 */
export function createTask(dto: CreateTaskDTO): Task {
  const error = validateTaskTitle(dto.title)
  if (error) {
    throw new Error(error)
  }

  return {
    id: crypto.randomUUID(),
    title: dto.title.trim(),
    description: dto.description?.trim(),
    status: 'todo',
    createdAt: new Date()
  }
}

/**
 * Updates a task with partial data
 * Returns a new task (immutability)
 */
export function updateTask(task: Task, updates: UpdateTaskDTO): Task {
  if (updates.title !== undefined) {
    const error = validateTaskTitle(updates.title)
    if (error) {
      throw new Error(error)
    }
  }

  return {
    ...task,
    ...(updates.title !== undefined && { title: updates.title.trim() }),
    ...(updates.description !== undefined && { description: updates.description?.trim() })
  }
}

/**
 * Toggles task status between todo and done
 * Pure function: returns a new task
 */
export function toggleTaskStatus(task: Task): Task {
  return {
    ...task,
    status: task.status === 'todo' ? 'done' : 'todo'
  }
}

/**
 * Filters tasks by status
 * Pure function: no mutations
 */
export function filterTasksByStatus(
  tasks: Task[],
  status?: TaskStatus
): Task[] {
  if (!status) return tasks
  return tasks.filter(task => task.status === status)
}

/**
 * Sorts tasks by creation date (newest first)
 */
export function sortTasksByDate(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}
