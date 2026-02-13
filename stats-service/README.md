# Stats Service

Service de calcul des statistiques sur les tâches.

## Prérequis

- Node.js 24+
- Tasks Service (doit être en cours d'exécution)

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
TASKS_SERVICE_URL=http://localhost:3001
PORT=3002
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
- `GET /stats` - Statistiques (total, done, todo)

## Tests

```bash
npm test
```

## Dépendances

- **Tasks Service** : doit être accessible via `TASKS_SERVICE_URL` (requis)
- **Express** : framework web
