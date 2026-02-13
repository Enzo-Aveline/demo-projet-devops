# Tasks Service

Service de gestion des tâches (CRUD).

## Prérequis

- Node.js 24+
- PostgreSQL 18

## Installation

```bash
npm install
```

## Configuration

Copier le fichier d'exemple et l'adapter :

```bash
cp .env.example .env
```

Le fichier `.env` contient :

```env
DATABASE_URL=postgresql://taskuser:taskpass@localhost:5432/taskdb
PORT=3001
```

## Démarrer PostgreSQL

```bash
docker run -d --name postgres \
  -e POSTGRES_USER=taskuser \
  -e POSTGRES_PASSWORD=taskpass \
  -e POSTGRES_DB=taskdb \
  -v $(pwd)/init.sql:/docker-entrypoint-initdb.d/init.sql \
  -p 5432:5432 \
  postgres:18-alpine
```

## Lancer le projet

### Mode développement

```bash
npm run dev
```

### Mode production

```bash
npm run build
npm start
```

## Endpoints API

- `GET /health` - Health check
- `GET /tasks` - Lister toutes les tâches
- `GET /tasks/:id` - Récupérer une tâche
- `POST /tasks` - Créer une tâche
- `PUT /tasks/:id` - Mettre à jour une tâche
- `DELETE /tasks/:id` - Supprimer une tâche

## Tests

```bash
npm test
```

## Dépendances

- **PostgreSQL** : base de données (requis)
- **Express** : framework web
- **pg** : client PostgreSQL
