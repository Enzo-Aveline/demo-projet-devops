import { useState, useEffect } from 'react'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { TaskStatsComponent } from './components/TaskStats'
import {
  fetchTasks,
  createTask,
  toggleTask,
  deleteTask,
  fetchStats,
  type Task,
  type TaskStats
} from './api/tasks.api'

export function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    todo: 0,
    done: 0,
    completionRate: 0
  })
  const [filter, setFilter] = useState<'all' | 'todo' | 'done'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTasks = async () => {
    try {
      setLoading(true)
      const fetchedTasks = await fetchTasks(filter === 'all' ? undefined : filter)
      setTasks(fetchedTasks)
      setError(null)
    } catch (err) {
      setError('Failed to load tasks. Make sure the backend is running.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const fetchedStats = await fetchStats()
      setStats(fetchedStats)
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }

  useEffect(() => {
    loadTasks()
    loadStats()
  }, [filter])

  const handleCreateTask = async (title: string, description?: string) => {
    try {
      await createTask(title, description)
      await loadTasks()
      await loadStats()
    } catch (err) {
      alert('Failed to create task')
      console.error(err)
    }
  }

  const handleToggleTask = async (id: string) => {
    try {
      await toggleTask(id)
      await loadTasks()
      await loadStats()
    } catch (err) {
      alert('Failed to toggle task')
      console.error(err)
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id)
      await loadTasks()
      await loadStats()
    } catch (err) {
      alert('Failed to delete task')
      console.error(err)
    }
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>📋 Task Manager</h1>
        <p style={styles.subtitle}>Microservices Demo Project</p>
      </header>

      {error && (
        <div style={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <TaskStatsComponent stats={stats} />

      <div style={styles.filters}>
        <button
          onClick={() => setFilter('all')}
          style={{
            ...styles.filterButton,
            ...(filter === 'all' ? styles.filterButtonActive : {})
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilter('todo')}
          style={{
            ...styles.filterButton,
            ...(filter === 'todo' ? styles.filterButtonActive : {})
          }}
        >
          To Do
        </button>
        <button
          onClick={() => setFilter('done')}
          style={{
            ...styles.filterButton,
            ...(filter === 'done' ? styles.filterButtonActive : {})
          }}
        >
          Completed
        </button>
      </div>

      <TaskForm onSubmit={handleCreateTask} />

      {loading ? (
        <div style={styles.loading}>Loading tasks...</div>
      ) : (
        <TaskList
          tasks={tasks}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '40px'
  },
  title: {
    fontSize: '42px',
    margin: '0 0 10px 0',
    color: '#2db7c4'
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    margin: 0
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #ef5350'
  },
  filters: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    justifyContent: 'center'
  },
  filterButton: {
    padding: '10px 20px',
    border: '2px solid #e0e0e0',
    backgroundColor: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500' as const,
    transition: 'all 0.3s'
  },
  filterButtonActive: {
    backgroundColor: '#2db7c4',
    borderColor: '#2db7c4',
    color: 'white'
  },
  loading: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#999',
    fontSize: '18px'
  }
}
