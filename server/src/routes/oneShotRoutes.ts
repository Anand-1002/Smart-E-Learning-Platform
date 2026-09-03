import { Router } from 'express';
import {
  getOneShots,
  getOneShotBySlug,
  getOneShotsBySubjectSlug,
  createOneShot,
  updateOneShot,
  deleteOneShot
} from '../controllers/oneShotController.js';

const router = Router();

router.get('/', getOneShots);
router.get('/subject/:subjectSlug', getOneShotsBySubjectSlug);
router.get('/:slug', getOneShotBySlug);
router.post('/', createOneShot);
router.put('/:id', updateOneShot);
router.delete('/:id', deleteOneShot);

export default router;
