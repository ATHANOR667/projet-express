import express, { type Express } from 'express';

import projectsRouter from './routes/projects.js';

const app: Express = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API de gestion des projets en cours d’exécution.');
});

app.use('/projects', projectsRouter);

app.listen(port, () => {
  console.log(
    `[server]: Serveur s'exécute à l'adresse http://localhost:${port}`,
  );
});
