/**
 * API layer: HTTP routes
 * Thin layer that adapts HTTP requests to domain logic
 */

import { Router, type Request, type Response } from 'express'
import type { ITaskRepository } from '../infrastructure/task.repository.js'
import {
  createTask,
  updateTask,
  toggleTaskStatus,
  filterTasksByStatus,
  sortTasksByDate,
  type CreateTaskDTO,
  type UpdateTaskDTO,
  type TaskStatus
} from '../domain/task.js'

export function createTaskRoutes(repository: ITaskRepository): Router {
  const router = Router()

  // GET /api/tasks?status=todo|done
  router.get('/', async (req: Request, res: Response) => {
    try {
      const status = req.query.status as TaskStatus | undefined
      let tasks = await repository.findAll()

      if (status) {
        tasks = filterTasksByStatus(tasks, status)
      }

      tasks = sortTasksByDate(tasks)

      res.json({ tasks, total: tasks.length })
    } catch (error) {
      console.error('Error fetching tasks:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  })

  // GET /api/tasks/:id
  router.get('/:id', async (req: Request, res: Response) => {
    const task = await repository.findById(req.params.id as string)

    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.json(task)
  })

  // POST /api/tasks
  router.post('/', async (req: Request, res: Response) => {
    try {
      const dto: CreateTaskDTO = req.body
      const task = createTask(dto)
      await repository.save(task)

      res.status(201).json(task)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Internal server error' })
      }
    }
  })

  // PATCH /api/tasks/:id
  router.patch('/:id', async (req: Request, res: Response) => {
    try {
      const existingTask = await repository.findById(req.params.id as string)

      if (!existingTask) {
        return res.status(404).json({ error: 'Task not found' })
      }

      const dto: UpdateTaskDTO = req.body
      const updatedTask = updateTask(existingTask, dto)
      await repository.save(updatedTask)

      res.json(updatedTask)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Internal server error' })
      }
    }
  })

  // PATCH /api/tasks/:id/toggle
  router.patch('/:id/toggle', async (req: Request, res: Response) => {
    const existingTask = await repository.findById(req.params.id as string)

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' })
    }

    const toggledTask = toggleTaskStatus(existingTask)
    await repository.save(toggledTask)

    res.json(toggledTask)
  })

  // DELETE /api/tasks/:id
  router.delete('/:id', async (req: Request, res: Response) => {
    const deleted = await repository.delete(req.params.id as string)

    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.status(204).send()
  })

  return router
}
