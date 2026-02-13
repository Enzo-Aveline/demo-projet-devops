import { useState } from 'react'

interface TaskFormProps {
  onSubmit: (title: string, description?: string) => void
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    onSubmit(title, description || undefined)
    setTitle('')
    setDescription('')
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="Task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
        required
      />
      <input
        type="text"
        placeholder="Description (optional)..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={styles.input}
      />
      <button type="submit" style={styles.button}>
        Add Task
      </button>
    </form>
  )
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    marginBottom: '30px'
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.3s'
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#2db7c4',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold' as const,
    transition: 'background-color 0.3s'
  }
}
