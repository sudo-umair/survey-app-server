import { Router } from 'express';
import {
  createEnumerator,
  getEnumerator,
  resumeSession,
} from '@controllers/enumerator';

const enumeratorRouter = Router();

enumeratorRouter.post('/sign-up', createEnumerator);
enumeratorRouter.post('/sign-in', getEnumerator);
enumeratorRouter.post('/resume-session', resumeSession);

export { enumeratorRouter };
