// src/routes/projects.ts
import { Router, Request, Response } from 'express';
import { readDb, writeDb, Project } from '../utils/db.utils.js'; // <-- Import .js
import { z } from 'zod'; 
import { v4 as uuidv4 } from 'uuid'; 

const router: Router = Router();

// Schéma de validation Zod pour la soumission d'un nouveau projet
const ProjectSchema = z.object({
  studentName: z.string().min(1, 'Le nom de l\'étudiant est requis.'),
  course: z.string().min(1, 'Le nom du cours est requis.'),
  githubUrl: z.string().url('L\'URL GitHub doit être un lien valide.'),
});

// Route 1: POST /projects (Soumission)
router.post('/', async (req: Request, res: Response) => {
  try {
    const validation = ProjectSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Données invalides', issues: validation.error.issues });
    }
    const newProjectData = validation.data;

    const newProject: Project = {
      id: uuidv4(), 
      ...newProjectData,
    };

    const projects = await readDb();
    projects.push(newProject);
    await writeDb(projects);

    res.status(201).json(newProject);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur interne du serveur lors de la soumission.' });
  }
});

// Route 2: GET /projects/:id (Détail)
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const projects = await readDb();
    const project = projects.find(p => p.id === id);

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