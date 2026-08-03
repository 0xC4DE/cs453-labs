import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { db } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';
import { reportQueue } from '../reportQueue.js';

export const reportsRouter = Router();

reportsRouter.post('/', authenticateToken, async (req, res, next) => {
  try {
    const jobId = randomUUID();
    const studentId = req.user.sub;
    // DONE (PART 5): Create a pending report job with db.createReportJob().
    await db.createReportJob({
      id: jobId,
      studentId: studentId,
      status: 'pending',
      // downloadUrl is null for pending jobs
    });

    // DONE (PART 5): Send { jobId, studentId } to reportQueue.
    await reportQueue.send({ jobId: jobId, studentId: req.user.sub });

    // DONE (PART 5): Return 202 with jobId, status, and statusUrl.
    return res.status(202).json({
      jobId: jobId,
      status: 'pending',
      statusUrl: `/reports/${jobId}`,
    });
    // DONE (PART 5): Do not call generateReport() from this request handler.

  } catch (error) {
    return next(error);
  }
});

reportsRouter.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const job = await db.getReportJob(req.params.id);
    if (!job) return res.status(404).json({ error: 'Not Found' });
    return res.json(job);
  } catch (error) {
    return next(error);
  }
});

void reportQueue;
