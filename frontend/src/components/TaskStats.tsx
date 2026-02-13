import type { TaskStats } from '../api/tasks.api'

interface TaskStatsProps {
  stats: TaskStats
}

export function TaskStatsComponent({ stats }: TaskStatsProps) {
  return (
    <div style={styles.container}>
      <div style={styles.statCard}>
        <div style={styles.statValue}>{stats.total}</div>
        <div style={styles.statLabel}>Total Tasks</div>
      </div>
      <div style={styles.statCard}>
        <div style={styles.statValue}>{stats.todo}</div>
        <div style={styles.statLabel}>To Do</div>
      </div>
      <div style={styles.statCard}>
        <div style={styles.statValue}>{stats.done}</div>
        <div style={styles.statLabel}>Completed</div>
      </div>
      <div style={{ ...styles.statCard, ...styles.completionCard }}>
        <div style={styles.statValue}>{stats.completionRate}%</div>
        <div style={styles.statLabel}>Completion Rate</div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center' as const,
    border: '2px solid #e0e0e0'
  },
  completionCard: {
    backgroundColor: '#2db7c4',
    color: 'white',
    border: '2px solid #2db7c4'
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold' as const,
    marginBottom: '8px'
  },
  statLabel: {
    fontSize: '14px',
    textTransform: 'uppercase' as const,
    opacity: 0.8,
    letterSpacing: '1px'
  }
}
