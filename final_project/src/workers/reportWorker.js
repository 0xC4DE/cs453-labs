import { db } from '../database.js';
import { generateReport } from '../reportGenerator.js';
import { reportQueue } from '../reportQueue.js';

reportQueue.process(async (message) => {
  const { jobId, studentId } = message;

  // DONE (PART 5): Mark this job as "processing" with db.updateReportJob().
  db.updateReportJob(jobId, { status: 'processing' });

  // DONe (PART 5): Call generateReport(studentId).
  // generateReport uses Promises, so .then and .catch are able to handle results.
  generateReport(studentId)
    .then((downloadUrl) => {
      // DONE (PART 5): Mark it "completed" and save the downloadUrl.
      db.updateReportJob(jobId, { status: 'completed', downloadUrl });
    })
    .catch((error) => {
      console.error(`Error generating report for job ${jobId}:`, error);
      // DONE (PART 5): Catch generation errors, mark the job "failed", and do not crash the worker.
      db.updateReportJob(jobId, { status: 'failed' });
    });
});
