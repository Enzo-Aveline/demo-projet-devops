-- Initialization script for tasks database
-- This file is automatically executed when the PostgreSQL container starts for the first time

CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(10) NOT NULL CHECK (status IN ('todo', 'done')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Create an index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);

-- Insert some sample data for demonstration
INSERT INTO tasks (id, title, description, status, created_at) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Apprendre Docker', 'Comprendre les volumes et les réseaux', 'todo', CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440002', 'Maîtriser PostgreSQL', 'Créer des bases de données persistantes', 'todo', CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440003', 'Déployer en production', 'Utiliser docker-compose', 'done', CURRENT_TIMESTAMP - INTERVAL '1 day');
