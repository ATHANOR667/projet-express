import { Router, type Request, type Response } from 'express';
import { readDb, writeDb } from '../utils/db.utils.js';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

interface Project {
  id: string;
  studentName: string;
  course: string;
  githubUrl: string;
  grade?: number;
}

const GradeSchema = z.object({
  grade: z
    .number()
    .int()
    .min(0, 'La note doit être entre 0 et 20')
    .max(20, 'La note doit être entre 0 et 20'),
});

const ProjectSchema = z.object({
  studentName: z.string().min(1, "Le nom de l'étudiant est requis."),
  course: z.string().min(1, 'Le nom du cours est requis.'),
  githubUrl: z.string().url("L'URL GitHub doit être un lien valide."),
});

const router: Router = Router();

// GET /projects - Liste tous les projets
router.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await readDb();
    res.json(projects);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur interne du serveur lors de la liste.' });
  }
});

// PUT /projects/:id/grade - Noter un projet
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
    const projects: Project[] = await readDb();
    const index = projects.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Projet non trouvé pour la notation.' });
    }

    projects[index].grade = grade;
    await writeDb(projects);
    res.json(projects[index]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur interne du serveur lors de la notation.' });
  }
});

// POST /projects - Soumettre un nouveau projet
router.post('/', async (req: Request, res: Response) => {
  try {
    const validation = ProjectSchema.safeParse(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({ error: 'Données invalides', issues: validation.error.issues });
    }

    const newProjectData = validation.data;
    const newProject: Project = {
      id: uuidv4(),
      ...newProjectData,
    };

    const projects: Project[] = await readDb();
    projects.push(newProject);
    await writeDb(projects);
    res.status(201).json(newProject);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur interne du serveur lors de la soumission.' });
  }
});

// GET /projects/:id - Détail d'un projet
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const projects: Project[] = await readDb();
    const project = projects.find((p) => p.id === id);
    if (!project) {
      return res.status(404).json({ error: 'Projet non trouvé.' });
    }
    res.json(project);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

export default router;