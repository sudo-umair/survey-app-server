import { Router } from 'express';
import {
  createAdmin,
  getAdmin,
  listEnumerators,
  listSurveys,
  resumeSession,
  toggleEnumeratorStatus,
  getStats,
} from '@controllers/admin';

const adminRouter = Router();

adminRouter.post('/sign-up', createAdmin);
adminRouter.post('/sign-in', getAdmin);
adminRouter.post('/surveys', listSurveys);
adminRouter.post('/enumerators', listEnumerators);
adminRouter.post('/resume-session', resumeSession);
adminRouter.post('/toggle-enumerator-status', toggleEnumeratorStatus);
adminRouter.post('/stats', getStats);

export { adminRouter };
