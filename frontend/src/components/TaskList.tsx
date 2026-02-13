import type { Task } from '../api/tasks.api'

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div style={styles.empty}>
        <p>No tasks yet. Create one above!</p>
      </div>
    )
  }

  return (
    <div style={styles.list}>
      {tasks.map((task) => (
        <div key={task.id} style={styles.taskItem}>
          <div style={styles.taskContent}>
            <input
              type="checkbox"
              checked={task.status === 'done'}
              onChange={() => onToggle(task.id)}
              style={styles.checkbox}
            />
            <div style={styles.taskText}>
              <h3
                style={{
                  ...styles.taskTitle,
                  textDecoration: task.status === 'done' ? 'line-through' : 'none',
                  color: task.status === 'done' ? '#999' : '#333'
                }}
              >
                {task.title}
              </h3>
              {task.description && (
                <p style={styles.taskDescription}>{task.description}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => onDelete(task.id)}
            style={styles.deleteButton}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}

const styles = {
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px'
  },
  taskItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e0e0e0'
  },
  taskContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    flex: 1
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer'
  },
  taskText: {
    flex: 1
  },
  taskTitle: {
    margin: '0 0 5px 0',
    fontSize: '18px',
    fontWeight: '500' as const
  },
  taskDescription: {
    margin: 0,
    fontSize: '14px',
    color: '#666'
  },
  deleteButton: {
    padding: '8px 16px',
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold' as const
  },
  empty: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#999'
  }
}
