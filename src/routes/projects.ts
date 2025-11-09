// src/routes/projects.ts
import { Router } from 'express';
import type { Request, Response } from 'express';
import { readDb, writeDb } from '../utils/db.utils.js'; // <-- Import .js
import type { Project } from '../utils/db.utils.js';

const router: Router = Router();

// Route 5: DELETE /projects/:id (Suppression)
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const projects = await readDb();
    const initialLength = projects.length;

    const updatedProjects = projects.filter((p: Project) => p.id !== id);

    if (updatedProjects.length === initialLength) {
      return res
        .status(404)
        .json({ error: 'Projet non trouvé pour la suppression.' });
    }

    await writeDb(updatedProjects);

    res.status(204).send();
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ error: 'Erreur interne du serveur lors de la suppression.' });
  }
});

// Route 6: GET /projects/course/:courseName (Filtrage par cours)
router.get('/course/:courseName', async (req: Request, res: Response) => {
  const { courseName } = req.params;
  try {
    const projects = await readDb();

    // Filtrage insensible à la casse et aux espaces
    const normalizedCourseName = courseName.trim().toLowerCase();

    const filteredProjects = projects.filter(
      (p: Project) => p.course.trim().toLowerCase() === normalizedCourseName,
    );

    if (filteredProjects.length === 0) {
      return res
        .status(404)
        .json({ error: `Aucun projet trouvé pour le cours: ${courseName}.` });
    }

    res.json(filteredProjects);
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ error: 'Erreur interne du serveur lors du filtrage par cours.' });
  }
});

export default router;
