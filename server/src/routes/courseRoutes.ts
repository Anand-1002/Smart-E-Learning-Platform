import { Router } from 'express';
import {
  getCourses,
  getCourseBySlug,
  getCoursesBySubjectSlug,
  createCourse,
  updateCourse,
  deleteCourse
} from '../controllers/courseController.js';

const router = Router();

router.get('/', getCourses);
router.get('/subject/:subjectSlug', getCoursesBySubjectSlug);
router.get('/:slug', getCourseBySlug);
router.post('/', createCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

export default router;
