import { Router } from 'express';
import { createEnumerator, getEnumerator } from '@controllers/enumerator';

const enumeratorRouter = Router();

enumeratorRouter.post('/sign-up', createEnumerator);
enumeratorRouter.post('/sign-in', getEnumerator);

export { enumeratorRouter };
