/**
 * Infrastructure layer: PostgreSQL persistence
 */

import { pool } from './database.js'
import type { Task, TaskStatus } from '../domain/task.js'
import type { ITaskRepository } from './task.repository.js'

export class TaskRepositoryPostgres implements ITaskRepository {
  async findAll(): Promise<Task[]> {
    const result = await pool.query(
      'SELECT id, title, description, status, created_at FROM tasks ORDER BY created_at DESC'
    )

    return result.rows.map(this.mapRowToTask)
  }

  async findById(id: string): Promise<Task | undefined> {
    const result = await pool.query(
      'SELECT id, title, description, status, created_at FROM tasks WHERE id = $1',
      [id]
    )

    return result.rows[0] ? this.mapRowToTask(result.rows[0]) : undefined
  }

  async findByStatus(status: TaskStatus): Promise<Task[]> {
    const result = await pool.query(
      'SELECT id, title, description, status, created_at FROM tasks WHERE status = $1 ORDER BY created_at DESC',
      [status]
    )

    return result.rows.map(this.mapRowToTask)
  }

  async save(task: Task): Promise<Task> {
    const existing = await this.findById(task.id)

    if (existing) {
      // Update
      await pool.query(
        'UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4',
        [task.title, task.description, task.status, task.id]
      )
    } else {
      // Insert
      await pool.query(
        'INSERT INTO tasks (id, title, description, status, created_at) VALUES ($1, $2, $3, $4, $5)',
        [task.id, task.title, task.description, task.status, task.createdAt]
      )
    }

    return task
  }

  async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id])
    return result.rowCount !== null && result.rowCount > 0
  }

  async count(): Promise<number> {
    const result = await pool.query('SELECT COUNT(*) as count FROM tasks')
    return parseInt(result.rows[0].count)
  }

  private mapRowToTask(row: any): Task {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      createdAt: new Date(row.created_at)
    }
  }
}
