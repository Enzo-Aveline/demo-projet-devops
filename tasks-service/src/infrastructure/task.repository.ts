/**
 * Infrastructure layer: Data persistence
 * In-memory storage for simplicity (no DB dependency)
 */

import type { Task, TaskStatus } from '../domain/task.js'

/**
 * Interface commune pour les repositories
 * Permet de switcher entre in-memory et PostgreSQL
 */
export interface ITaskRepository {
  findAll(): Promise<Task[]>
  findById(id: string): Promise<Task | undefined>
  findByStatus(status: TaskStatus): Promise<Task[]>
  save(task: Task): Promise<Task>
  delete(id: string): Promise<boolean>
  count(): Promise<number>
}

export class TaskRepository implements ITaskRepository {
  private tasks: Map<string, Task> = new Map()

  async findAll(): Promise<Task[]> {
    return Array.from(this.tasks.values())
  }

  async findById(id: string): Promise<Task | undefined> {
    return this.tasks.get(id)
  }

  async findByStatus(status: TaskStatus): Promise<Task[]> {
    return this.findAll().then(tasks => tasks.filter(task => task.status === status))
  }

  async save(task: Task): Promise<Task> {
    this.tasks.set(task.id, task)
    return task
  }

  async delete(id: string): Promise<boolean> {
    return this.tasks.delete(id)
  }

  async count(): Promise<number> {
    return this.tasks.size
  }
}
