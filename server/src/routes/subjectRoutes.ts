import { Router } from 'express';
import {
  getSubjects,
  getSubjectBySlug,
  createSubject,
  updateSubject,
  deleteSubject
} from '../controllers/subjectController.js';

const router = Router();

router.get('/', getSubjects);
router.get('/:slug', getSubjectBySlug);
router.post('/', createSubject);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

export default router;
