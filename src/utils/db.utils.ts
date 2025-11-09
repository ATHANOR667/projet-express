import * as fs from 'fs/promises';
import * as path from 'path';

const DB_PATH = path.join(process.cwd(), 'db.json');

// Interface pour typer les données de projet
export interface Project {
  id: string;
  studentName: string;
  course: string;
  githubUrl: string;
  grade?: number;
}

/**
 * Lit le contenu du fichier db.json
 * @returns {Promise<Project[]>} La liste des projets
 */
export async function readDb(): Promise<Project[]> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data) as Project[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * Écrit la liste des projets dans le fichier db.json
 * @param {Project[]} projects La liste des projets à écrire
 */
export async function writeDb(projects: Project[]): Promise<void> {
  const data = JSON.stringify(projects, null, 2);
  await fs.writeFile(DB_PATH, data, 'utf-8');
}
