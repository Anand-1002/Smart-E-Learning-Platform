import { Request, Response, NextFunction } from 'express';
import { Course } from '../models/Course.js';
import { OneShot } from '../models/OneShot.js';
import { Subject } from '../models/Subject.js';

export const globalSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, type, subject, level } = req.query;
    const queryStr = (q as string || '').trim();

    if (!queryStr) {
      return res.json({
        success: true,
        query: '',
        counts: { total: 0, courses: 0, oneShots: 0, subjects: 0 },
        data: { courses: [], oneShots: [], subjects: [] }
      });
    }

    const regex = new RegExp(queryStr, 'i');

    const courseFilter: Record<string, any> = {
      $or: [
        { title: regex },
        { description: regex },
        { instructor: regex },
        { tags: { $in: [regex] } },
        { 'modules.title': regex },
        { 'modules.lessons.title': regex }
      ]
    };

    const oneShotFilter: Record<string, any> = {
      $or: [
        { title: regex },
        { description: regex },
        { instructor: regex },
        { tags: { $in: [regex] } }
      ]
    };

    const subjectFilter: Record<string, any> = {
      $or: [
        { name: regex },
        { description: regex },
        { popularTopics: { $in: [regex] } }
      ]
    };

    if (subject) {
      courseFilter.subjectSlug = subject;
      oneShotFilter.subjectSlug = subject;
    }

    if (level && level !== 'All Levels') {
      courseFilter.level = level;
      oneShotFilter.level = level;
    }

    let courses: any[] = [];
    let oneShots: any[] = [];
    let subjects: any[] = [];

    if (!type || type === 'all' || type === 'course') {
      courses = await Course.find(courseFilter)
        .populate('subject', 'name slug icon category')
        .limit(20);
    }

    if (!type || type === 'all' || type === 'one-shot') {
      oneShots = await OneShot.find(oneShotFilter)
        .populate('subject', 'name slug icon category')
        .limit(20);
    }

    if (!type || type === 'all' || type === 'subject') {
      subjects = await Subject.find(subjectFilter).limit(10);
    }

    const total = courses.length + oneShots.length + subjects.length;

    res.json({
      success: true,
      query: queryStr,
      counts: {
        total,
        courses: courses.length,
        oneShots: oneShots.length,
        subjects: subjects.length
      },
      data: {
        courses,
        oneShots,
        subjects
      }
    });
  } catch (error) {
    next(error);
  }
};
