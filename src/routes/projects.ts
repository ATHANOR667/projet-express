import { Router, type Request, type Response } from 'express';
import { readDb, writeDb } from '../utils/db.utils.js';
import { z } from 'zod';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await readDb();
    res.json(projects);
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ error: 'Erreur interne du serveur lors de la liste.' });
  }
});

const GradeSchema = z.object({
  grade: z
    .number()
    .int()
    .min(0, 'La note doit être entre 0 et 20')
    .max(20, 'La note doit être entre 0 et 20'),
});

router.put('/:id/grade', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const validation = GradeSchema.safeParse(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({ error: 'Note invalide', issues: validation.error.issues });
    }
    const { grade } = validation.data;

    const projects = await readDb();
    const index = projects.findIndex((p) => p.id === id);

    if (index === -1) {
      return res
        .status(404)
        .json({ error: 'Projet non trouvé pour la notation.' });
    }

    projects[index].grade = grade;
    await writeDb(projects);

    res.json(projects[index]);
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ error: 'Erreur interne du serveur lors de la notation.' });
  }
});

export default router;
