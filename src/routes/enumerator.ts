import { Router } from 'express';
import {
  createEnumerator,
  getEnumerator,
  deleteEnumerator,
  updateEnumerator,
} from '@controllers/enumerator';

const enumeratorRouter = Router();

enumeratorRouter.post('/sign-up', createEnumerator);
enumeratorRouter.post('/sign-in', getEnumerator);
// enumeratorRouter.post('/update', updateEnumerator);
// enumeratorRouter.post('/delete', deleteEnumerator);

export { enumeratorRouter };
