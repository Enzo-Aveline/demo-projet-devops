# Frontend

Interface web du Task Manager (React + Vite).

## Prérequis

- Node.js 24+
- Tasks Service et Stats Service (doivent être en cours d'exécution)

## Installation

```bash
npm install
```

## Configuration

Créer un fichier `.env` avec :

```env
VITE_TASKS_API_URL=http://localhost:3001
VITE_STATS_API_URL=http://localhost:3002
```

## Lancer le projet

### Mode développement

```bash
npm run dev
```

Ouvrir http://localhost:5173 dans le navigateur.

### Build de production

```bash
npm run build
```

Les fichiers sont générés dans `dist/`.

### Prévisualiser le build

```bash
npm run preview
```

## Tests

```bash
npm test
```

## Dépendances

- **Tasks Service** : API des tâches (requis)
- **Stats Service** : API des statistiques (requis)
- **React 18** : framework UI
- **Vite** : build tool
